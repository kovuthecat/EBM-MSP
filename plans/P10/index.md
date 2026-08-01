# Plan P10 — L'outil dit pourquoi, dit ce qu'il ignore, et descend à l'ordonnance   (rédigé par Opus)

## Objectif d'ensemble

Traiter le **défaut de lisibilité n° 1** du rapport de recette naïf du 2026-07-30 : la ligne « Proposé
parce que » déverse une expression booléenne brute (« Intention ≠ Initier **et** Traitements en cours
comprend Sulfamide **et** Hypoglycémie récente »), constatée sur 3 cartes sur 4 d'un même écran, et le
panneau « Pourquoi pas d'autres options ? » en aligne 27 lignes. Y ajouter ce que le praticien a nommé
comme sa **réserve principale** — *« il ne se tait pas quand il devrait se taire »* : une réponse ferme
et badgée `Recommandée / Preuve élevée` chez un patient dont l'outil ignore la moitié du dossier, sans
le dire. Enfin, deux lacunes cliniques choisies par le référent, celles qui décident de son verdict
*« oui une fois, pas deux fois — la deuxième fois l'outil ne m'apportera plus rien puisqu'il ne descend
pas à la dose »*.

Source : `docs/decision/validation/recette-praticien-naif-2026-07-30.md` (audit complet croisé avec les
périmètres livrés par P8 et P9) · arbitrages du référent du 2026-07-31 (colonne A + deux items
cliniques + infobulle).

## Ce que ce plan a vérifié avant de se lancer

- **La disjonction entière est affichée, pas la branche qui a mordu.** `lib/conditionText.ts`
  (`humanizeExpression`, l.69-74) découpe sur `OR` et humanise **tous** les termes, satisfaits ou non.
  Sur un patient à maladie cardiovasculaire établie, l'écran énumère donc quand même « ou IMC ≥ 30 ou
  Palette glycémique ouverte ou DFG > 0 et DFG < 30 ». **N'afficher que la ou les branches réellement
  satisfaites est un correctif à part entière, sans aucun changement de contenu** — et c'est le
  préalable à tout motif rédigé (S1).
- **Les deux écrans incriminés n'ont PAS le même défaut, et ne se corrigent pas pareil.**
  - « Proposé parce que » (`OptionCard.tsx` l.285) et « Ce rang tient compte de » (l.289) affichent
    `EvaluateNodeResult.reasons` = les `conditions` **satisfaites** → le filtrage par branche de S1
    s'applique et suffit à les raccourcir.
  - « Pourquoi pas d'autres options ? » lit `nonRetenues` (`vueDecision.ts` l.191, 337-349 :
    « première condition non satisfaite — celle qui explique »), dont **toutes** les branches sont
    fausses. Les énumérer est honnête ; c'est la **formulation** qui est mauvaise (une liste positive
    suivie de « : non »). Le filtrage par branche n'y a aucun sens — appliqué là, il ne montrerait
    rien. Ce second écran se corrige par la reformulation en énumération négative + les motifs (S2).
- **Le mécanisme de motif doit être rétrocompatible et progressif, sinon c'est une migration de 82
  options.** Décompte réel : `prescription` 28, `rhd-alimentation` 16, `insuline` 14,
  `rhd-activite-physique` 13, `statine` 7, `cible-glycemique` 4. La forme retenue (S2) est une **carte
  optionnelle `motifs` sur l'option, indexée par le texte exact de la branche** : le contenu existant
  n'est pas touché, on écrit un motif **uniquement pour les branches qui se lisent mal**, et l'écran
  retombe sur la branche humanisée partout ailleurs. Un invariant de test garantit qu'aucune clé de
  `motifs` ne pointe vers une branche inexistante (une faute de frappe serait sinon silencieuse).
- **`cadrage` existe déjà — mais seulement sur 2 nœuds sur 6.** `insuline.yaml` et `statine.yaml` en
  portent un ; `prescription`, `cible-glycemique`, `rhd-alimentation` et `rhd-activite-physique` n'en
  ont aucun. C'est exactement le constat du rapport (« aucun bloc de cadrage en tête du nœud
  "Traiter", contrairement à Statine/Insuline »). La phrase de périmètre n'a donc **aucun mécanisme à
  créer** : c'est du contenu à écrire dans un champ qui existe.
- **Le champ « Risque hypoglycémique du schéma » n'est pas dérivable — c'est acté.** P9/S7 a établi
  qu'il agit à 4 endroits et qu'au moins un (l'alerte « place résiduelle », `prescription.yaml`
  l.1664) doit se déclencher chez un patient **sans aucun hypoglycémiant en cours**, pour orienter un
  premier choix : une dérivation depuis `traitements_en_cours` ne peut pas le faire par construction.
  Arbitrage du référent (2026-07-31) : **le garder, lui donner une infobulle** (S9). La scission des
  deux ou trois lectures que le champ cumule aujourd'hui n'est **pas** rouverte ici.

## Ce que ce plan NE fait pas

- **La scission de « Risque hypoglycémique du schéma »** en un dérivé + un champ prospectif réduit :
  arbitrage clinique explicitement reporté par le référent — l'infobulle rend le champ remplissable,
  elle ne lève pas l'ambiguïté de fond (cf. l'analyse des 4 usages dans `plans/P9/S7.md`).
- **Les cartes redondantes d'allègement** (« Désintensifier » vs « Réduire la posologie du
  sulfamide/de l'insuline » — trois formulations pour deux gestes) et **les incohérences de voisinage
  entre cartes metformine** : arbitrages de contenu clinique (faut-il fusionner ?) non tranchés.
- **Les blocs de texte trop longs** (pavé « Position déclarée AU-DESSUS… », argumentaire statine
  > 2 000 caractères) : raccourcir sans perdre le sens est un arbitrage de fond, pas une correction.
- **Les autres lacunes cliniques** que les deux choisies : la **séquence des gestes** (« j'arrête le
  gliclazide d'abord ou j'introduis d'abord ? », réclamée 2 fois — risque réel d'absence de source
  primaire), la surveillance à l'introduction d'un iSGLT2 (créatinine J15, mycose, jours de maladie),
  le volume d'activité physique chiffré, « RHD seules 3 mois » et son seuil, les chiffres de perte de
  poids et la chirurgie bariatrique. Chacune exige sa propre collecte de preuve.
- **Les ~30 champs de saisie manquants** (kaliémie, cirrhose, chutes, NYHA, MMSE, TIR, refus de
  traitement, dialyse programmée sur « Traiter »…) : nécessitent d'abord un tri clinique — lequel
  change vraiment la conduite ? — qui est lui-même un travail de référent.
- **L'ergonomie de saisie du nœud « Traiter »** (17-19 actions minimum, plus de la moitié des actions
  de toute la passe ; ordre des sections mettant le champ de jugement après 15 saisies objectives) et
  **les conversions mentales imposées** (IMC au lieu de poids+taille — bloqué par la grammaire de
  `deriveCritere.ts`, un seul opérateur binaire ; CK en multiples de la normale ; albuminurie en
  catégories quand le labo rend un ratio A/C).
- **L'aiguillage de l'écran d'accueil du domaine DT2** sur le modèle du primer RHD : suppose d'élargir
  la sémantique de `module` (D22), décision d'architecture non prise.
- **Le cadrage de validité de l'HbA1c** : reste P7/SA2, plan séparé, non livré.

## Sessions

| Session | Tâches | Titre | Modèle | Effort | Env. | Dépend de | Zone modifiée | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [S1](S1.md) | T-078 | N'afficher que la branche qui a réellement mordu | Opus | high | — | — | `engine/evaluateNode.ts`, `lib/conditionText.ts`, `lib/vueDecision.ts`, `components/OptionCard.tsx` | [x] 2026-07-31 (commit `6fd888d`) |
| [S2](S2.md) | T-079 | Mécanisme `motifs` + reformulation des options non retenues | Opus | high | — | S1 | `schema/noeud.schema.json`, `content/node.types.ts`, `engine/expressionsNoeud.ts`, `lib/conditionText.ts`, `lib/vueDecision.ts`, `components/OptionCard.tsx`, banc | [x] 2026-07-31 |
| [S3](S3.md) | T-080 | `prescription` parle clair : motifs + périmètre | Sonnet | high | — | S2 | `content/noeuds/diabete-type-2/prescription.yaml` | [x] 2026-07-31 |
| [S4](S4.md) | T-081 | `insuline` parle clair : motifs + périmètre | Sonnet | high | — | S2 | `content/noeuds/diabete-type-2/insuline.yaml` | [x] 2026-07-31 |
| [S5](S5.md) | T-082 | `statine` et `cible-glycemique` parlent clair | Sonnet | high | — | S2 | `content/noeuds/diabete-type-2/statine.yaml`, `cible-glycemique.yaml` | [x] 2026-07-31 |
| [S6](S6.md) | T-083 | Les deux nœuds RHD parlent clair | Sonnet | high | — | S2 | `content/noeuds/diabete-type-2/rhd-alimentation.yaml`, `rhd-activite-physique.yaml` | [x] 2026-07-31 |
| [S7](S7.md) | T-084 | iSGLT2 / AR GLP-1 : quelle molécule, à quelle dose | Sonnet | high | — | S3 | `content/noeuds/diabete-type-2/prescription.yaml`, `prescription.argumentaire.md` | [x] 2026-07-31 |
| [S8](S8.md) | T-085 | Descente d'insuline : combien, à quel rythme, quand recontrôler | Sonnet | high | — | S4 | `content/noeuds/diabete-type-2/insuline.yaml`, `insuline.argumentaire.md` | [x] 2026-07-31 (STOP sourcé, pas de chiffre) |
| [S9](S9.md) | T-086 | Infobulle « Risque hypoglycémique du schéma » | Sonnet | medium | — | S7, S8 | `content/noeuds/diabete-type-2/prescription.yaml`, `insuline.yaml` | [x] 2026-08-01 |
| [S10](S10.md) | T-087 | L'ordre des familles suit l'intention déclarée (investigation d'abord) | Sonnet | high | — | S1 | `lib/vueDecision.ts` ou `screens/` (selon l'issue) | [x] 2026-08-01 (issue 3, STOP documenté, aucun code modifié) |
| [S11](S11.md) | T-088 | Recette navigateur N1 des changements P10 | Claude + navigateur | medium | Desktop | tout ce qui précède | `docs/decision/validation/` | [x] 2026-08-01 (`docs/decision/validation/recette-P10-2026-08-01.md`) |

## Ordonnancement

- **Vague 1** : **S1** seule — elle change la façon dont les raisons sont calculées et rendues ; tout
  le reste s'appuie dessus.
- **Vague 2** : **S2** seule — même zone de code que S1, jamais en parallèle.
- **Vague 3 — parallélisable** : **S3** · **S4** · **S5** · **S6**. Six fichiers YAML répartis en
  quatre sessions disjointes ; aucune ne touche au code.
- **Vague 4 — parallélisable** : **S7** (`prescription.yaml`, après S3) · **S8** (`insuline.yaml`,
  après S4). Fichiers disjoints entre elles.
- **Vague 5 — parallélisable** : **S9** (les deux YAML, après S7 et S8) · **S10** (code d'affichage,
  zone disjointe de S9).
- **Vague 6 — contrôle** : **S11**, recette navigateur **en local** (`npm run dev`), comme P6 à P9 :
  rien n'est poussé avant validation.
- **Vague 7 — consolidation** : commits tâche par tâche, statuts de cet index, `STATUS.md`,
  `TASKS.md`, `VALIDATION.md`, push.

⚠ **Worktrees** : les sessions P9 ont toutes rencontré le même incident — un worktree créé depuis un
commit antérieur au cadrage du plan, donc sans `plans/P<n>/` ni les mécanismes livrés par les sessions
précédentes. Chaque session de vague 2+ doit **vérifier sa base de branche avant de lire quoi que ce
soit** (`git log --oneline -1` et présence du fichier de session), et faire un `git merge main
--ff-only` si elle est en retard. C'est écrit dans chaque `S<k>.md`.

## Le fil rouge

Les deux premières sessions ne changent **aucune doctrine clinique et aucun contenu** : elles rendent
l'écran capable de dire *pourquoi ce patient-ci*, là où il récitait jusqu'ici toutes les raisons qu'il
aurait pu avoir. Les quatre suivantes n'écrivent que ce que les conditions disent déjà — un motif qui
affirme plus que sa condition est une faute, pas une amélioration. Les deux sessions cliniques (S7, S8)
sont les seules à ajouter du fait médical, et elles sont tenues par la même règle que P9/S8 : rien qui
ne vienne d'une source primaire nommée, et un STOP plutôt qu'un comblement au jugé.
