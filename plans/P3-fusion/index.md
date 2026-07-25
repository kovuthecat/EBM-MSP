# Plan P3 — Fusion du module « Prescription non‑insulinique » (B+C+D) + gating de terrain   (rédigé par Opus)

> **À appliquer AVANT de reprendre P2 · S3–S7** (red‑team système). On corrige et on fusionne d'abord,
> puis les sessions adverses mordent sur la vraie cible (le nœud fusionné durci), au lieu de re‑découvrir
> des trous déjà identifiés (gating négatif absent, préférence iSGLT2/GLP‑1 inversée, flux de saisie).
> Ce plan **absorbe** l'ex‑« P3 — Remédiation » esquissé dans [`../P2/index.md`](../P2/index.md) §Suite ;
> la Veille reste **P4** ; les tests de non‑régression inter‑nœuds (`T‑018`) et le store de critères
> partagé (`T‑019`) restent en **suite** (après P2·S7).

## Objectif d'ensemble

Fusionner les trois nœuds de prescription orale — **B (1re intention)**, **C (intensification /
optimisation)**, **D (sulfamides / gliptines)** — en **un seul nœud `prescription`** piloté par les
**traitements en cours** et la **position de l'HbA1c vs objectif**, et y **encoder les correctifs cliniques**
issus de l'analyse des remarques utilisateur (2026‑07‑24) :

1. **Gating négatif de terrain** (remarques 2/3/10/11) — **décisions référent gelées (2026‑07‑24)** :
   GLP‑1 **exclu** si `IMC < 22` **ou** `denutrition` (mord même chez l'obèse dénutri) + **alerte** si
   `fragilite` ; **tirzépatide réservé à l'obésité** (`IMC ≥ 30`, plus de déclencheur ASCVD‑sans‑obésité) ;
   iSGLT2 rétrogradé + alerte si infections génito‑urinaires récidivantes ; intolérance → **proposer des
   choix** de switch. Détail : [S1](S1.md) §4.
2. **Logique de portes** (décision référent) : *présence d'un SU/iDPP4* **ou** *intolérance* = **portes vers
   l'optimisation par switch** — **sauf HbA1c sous la cible → déprescription** (jamais un switch vers un
   agent plus puissant chez un patient déjà sous l'objectif).
3. **Moteur de préférence** (remarque 9) : `priorite` **conditionnelle** (D14) — GLP‑1 devant iSGLT2 en
   athérome pur ; iSGLT2 devant en IC/rénal. (Bug né de l'encodage séparé B vs C : disparaît à la fusion.)
4. **Flag HbA1c < 6,5 %** + **primer tri‑état « position vs objectif »** (remarques 1 et 5).

**Invariant technique validé** : tout ceci s'encode **en contenu** (`conditions` / `exclusions` D13 /
`priorite` conditionnelle D14 / `alertes` D15 / critères `derive`). **Aucune modification du moteur**
([`evaluateNode.ts`](../../src/features/decision/engine/evaluateNode.ts)). Le flux de saisie (maquette 4a :
ordre primer→drapeaux→groupes, estompage des champs sans effet, reco provisoire) est du **câblage app**,
placé en **Track B — non bloquant** pour S3–S7.

## Ce que la fusion impose (gouvernance)

Un nœud validé qui change = **bump version + changelog + re‑vérification bi‑agents + validation référent**
(CLAUDE.md invariant 4 ; `DECISIONS.md` D5). Ici c'est une **refonte**, donc **re‑validation complète** du
nœud fusionné, pas un simple diff. Nouvelle décision transverse à acter : **D18 — fusion B+C+D**.

## Vecteur d'exécution

Sessions séquentielles avec **deux gates humaines bloquantes** (gel de la spec en S1 ; validation clinique
référent en S6) et **une session bi‑agents** (S4, via l'outil **Workflow**, méthode
[`VALIDATION_COHERENCE.md`](../../docs/decision/VALIDATION_COHERENCE.md) : A = fidélité au dossier, B =
red‑team sur le **moteur réel**, gate « **0 finding HAUTE** », triangulation, sources FR jamais via
OpenEvidence). Le reste est du contenu + du code applicatif, avec build + typecheck + Vitest à chaque
session de code.

## Rappels structurants (ne pas re‑trancher)

- **Périmètre = fusion + correctifs déjà cadrés.** On ne rouvre pas l'EBM des nœuds A/E/F/H, ni le socle de
  preuve B/C/D (déjà validé) — sauf pour **sourcer les règles NOUVELLES** (plancher IMC, fragilité/incrétine,
  iSGLT2+infections uro, intolérance→switch, sous‑cible→déprescription), qui passent la triangulation en S2.
- **Nuances de D à préserver absolument** dans le nœud fusionné : socle « ne pas privilégier SU/gliptine »
  (`toujours`, rang 0) ; **sitagliptine = seule gliptine FR** ; **glibenclamide proscrit** ; **SU retiré si
  DFG < 30** ; dosing rénal ; place **résiduelle** conditionnée à `classes_a_benefice_indisponibles`.
- **Nuances de B à préserver** : gate **insuline d'initiation** sur état catabolique (HbA1c ≥ 10 + glucotoxicité
  OU cétonémie) ; metformine **socle `toujours`** (badge « Recommandation officielle », D16) ; exclusions
  DFG < 20 / cétonémie / glucotoxicité sur iSGLT2 ; alertes dose metformine par palier de DFG (D15).
- **Nuances de C à préserver** : trois leviers (intensifier / substituer / désintensifier) ; non‑association
  gliptine + GLP‑1 par construction ; désintensification jamais d'un agent protecteur (ADA 13.14d) ; sécurité
  rénale metformine (arrêt < 30, réduction 30‑59).
- **B/C/D restent en place** jusqu'à ce que le nœud fusionné soit `valide` **et** câblé ; retrait en S5.

## Sessions

| Session | Tâche | Titre | Modèle | Effort | Dépend de | Zone modifiée (sortie) | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [S1](S1.md) | T‑020 | **Spec du nœud unifié** (design + gel humain) | Opus | xhigh | analyse + décisions user | `docs/decision/noeuds/prescription.SPEC.md` | [x] **gelé 2026‑07‑24** |
| [S2](S2.md) | T‑021 | **Dossier de preuve consolidé** + sourcing des règles nouvelles | Opus | high | S1 | `docs/decision/noeuds/prescription.md` | [x] fait (claims FR à re‑vérifier en S6) |
| [S3](S3.md) | T‑022 | **Encodage** YAML + argumentaire (brouillon v0.1) | Opus | high | S1, S2 | `content/…/prescription.yaml` + `.argumentaire.md` | [x] fait — Ajv OK, 17 tests profils verts |
| [S4](S4.md) | T‑023 | **Vérification bi‑agents** (A fidélité + B red‑team moteur) | Opus | xhigh | S3 | banc exécutable + red‑team agent | [x] fait — **0 HAUTE résiduel** (H1/M1 corrigés) |
| [S5](S5.md) | T‑024 | **Câblage app** (3 onglets → 1) + tests + retrait B/C/D | Sonnet | medium | S4 | `src/…`, cross‑refs, `content/` (retrait) | [x] fait — B/C/D retirés, 148 tests + build OK (visuel → VALIDATION.md) |
| S3–S7 | — | **Validation adversariale** (red-team indépendant + banc exécutable) | Opus | xhigh | S5 | `docs/decision/validation/RAPPORT-prescription-S3-S7.md` | [x] fait — **0 HAUTE** ; M1/M2 corrigés, M3 arbitrage consigné |
| [S6](S6.md) | T‑025 | **Validation référent** → `valide` + D18 | humain | — | S3–S7 | YAML `valide` v1.0, `DECISIONS.md` D18 | [x] fait (go référent) |
| [S7‑ui](S7-ui.md) | T‑026 | **Refonte UI** (maquette 4a), générique | Sonnet/Opus | medium | — | `engine/relevance.ts`, `CriteriaForm`, `DecisionNodeScreen` | [~] Lots 1‑3 faits (moteur+estompage+reco provisoire) — **visuel à valider**, Lot 4 (primer/rail/argumentaires) restant |
| S8 | T‑027 | **Refonte « par intention »** (4 intentions) + trous glycémiques (M3/insuline/déprescrire/B2) | Opus | high | S6 | `prescription.SPEC-intentions.md` (spec) → contenu + UI | [~] **SPEC écrit — gel réf. en attente** ; re-test focalisé requis |

**Track UI actif (parallèle, décision user 2026‑07‑24)** — [S7‑ui](S7-ui.md) : flux de saisie de la maquette 4a
(primer→drapeaux→groupes, estompage des champs sans effet, **reco provisoire + champs décisifs manquants**),
tiering argumentaire + réécriture **courte** des `avantages`/`inconvenients` (remarque 8). **Générique
(invariant 5)** : les composants ne connaissent aucun nœud par son nom → se construisent **en parallèle** du
contenu (S1–S4) et bénéficient à A/E/F/H aussi. Le rendu final sur le nœud fusionné arrive quand S5 le câble.
Validation **visuelle = humaine** (VALIDATION.md ; jamais Playwright — règle projet).

## Ordonnancement

- **Vague 1 — S1** (spec). **🚦 Gate humaine bloquante** : le référent **gèle** le modèle de critères, la table
  de décision « portes », les **seuils** (plancher IMC, tri‑état position, seuil « sous‑cible »), et le schéma
  de `priorite` conditionnelle. Rien ne s'encode avant ce gel.
- **Vague 2 — S2** (dossier consolidé + sourcing des règles nouvelles, triangulé).
- **Vague 3 — S3** (encodage) → **S4** (bi‑agents). S4 **boucle** avec S3 tant qu'il reste un finding HAUTE.
- **Vague 4 — S5** (câblage + tests + retrait B/C/D). Build + typecheck + Vitest verts obligatoires.
- **Vague 5 — S6** : **🚦 Gate humaine bloquante** — validation clinique référent → `statut: valide`, bump
  version, changelog, **D18**, puis **re‑pointage de P2·S3–S7** (cf. ci‑dessous) et mise à jour STATUS/TASKS.
- **Consolidation** : commit **tâche par tâche**, puis un seul push (skill `/fin-de-tache`).

## Rapport à P2 (pourquoi ce plan s'insère avant S3–S7)

P2·S3–S7 était conçu pour valider le système **à 7 nœuds**. La fusion change la topologie : **les coutures
B↔C↔D disparaissent** (moins de risques d'incohérence inter‑nœuds à tester), mais **apparaît un gros nœud
unique à red‑teamer en interne** + une **logique de gating/portes neuve**. Donc, en **S6**, avant de reprendre
P2 :

- **Re‑pointer les vignettes** de [`../P2/S4.md`](../P2/S4.md) vers le nœud `prescription` (supprimer les
  vignettes « traversée B→C→D » devenues sans objet ; **ajouter** des vignettes patient‑fragile /
  IMC‑bas / infections uro / sous‑cible qui ciblent le nouveau gating et les portes).
- **Re‑pointer** [`../P2/S3.md`](../P2/S3.md) (données inter‑nœuds) et [`../P2/S5.md`](../P2/S5.md) (personas
  hostiles) : la surface partagée change ; les règles nouvelles (non‑EBM historique) sont **prioritaires** à
  attaquer.
- La **carte de cohérence des valeurs** ([`../../docs/decision/validation/carte-coherence.md`](../../docs/decision/validation/carte-coherence.md))
  reste la référence des homonymes (DFG, HbA1c…) que le nœud fusionné doit respecter par construction.

## Critères de sortie du plan

- `content/…/prescription.yaml` **`statut: valide`**, Ajv OK, 0 finding HAUTE en S4, référent OK en S6.
- App : **un seul onglet** de prescription (A/E/F/H inchangés) ; B/C/D **retirés** ; build + typecheck +
  Vitest verts ; profils de test frail/IMC‑bas/uro/sous‑cible **couverts** par des tests unitaires.
- `DECISIONS.md` **D18** écrit ; P2·S3–S7 re‑pointés et prêts à lancer.
