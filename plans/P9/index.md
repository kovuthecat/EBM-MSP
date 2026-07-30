# Plan P9 — Contre-indications fiables + purge du jargon rendu + trois corrections ciblées   (rédigé par Opus)

## Objectif d'ensemble

Traiter le point de backlog **« Contre-indications liées à des conditions vérifiables »**
(`TASKS.md`, section « recherche clinique ») : aujourd'hui `contre_indications` est du texte libre,
**jamais évalué par le moteur**, donc affiché en permanence même quand les critères saisis
l'excluent — une alerte qui sonne tout le temps n'alerte jamais. C'est le cœur de ce plan (S1 + S3-S6).

En complément, ce plan couvre une partie de ce que P8 avait explicitement différé (`plans/P8/index.md`,
« Ce que ce plan NE fait pas ») : la purge du jargon de projet qui fuit sur l'écran clinique
(« nœud E », « red-team », « le référent », « Palette glycémique ouverte », des renvois internes non
résolvables), l'ambiguïté « Agent à ajouter » vs « Remplacement », et deux champs de jugement sans
définition. Trois remarques du praticien (recette du 2026-07-30) sont traitées avec la solution qu'il a
lui-même proposée : un protocole de titration de la metformine sourcé (mémo Ameli), une infobulle pour
« Autres facteurs de risque cardiovasculaire », et l'examen de la suppression du champ « Risque
hypoglycémique du schéma » au profit d'un dérivé automatique.

Source : `TASKS.md` l.37-39 · `docs/decision/validation/recette-praticien-naif-2026-07-30.md` (audit
complet croisé avec le périmètre livré par P8, voir conversation du 2026-07-30) · remarques et
arbitrages du référent du 2026-07-30 (metformine, FDRCV, risque hypoglycémique).

## Ce que ce plan a vérifié avant de se lancer

- **`contre_indications` n'a aucun mécanisme de garde aujourd'hui.** `schema/noeud.schema.json`
  (l.379-385) le documente lui-même comme « prose destinée au lecteur, distincte de `exclusions`,
  évaluée par le moteur ». `exclusions` (l.416-422), elle, EST déjà réévaluée par `evaluateNode` et
  peut retirer une option — c'est le mécanisme à imiter, pas à réinventer. `OptionCard.tsx` (l.146-249)
  rend `contre_indications` dès qu'il est non vide, sans condition.
- **Le motif « Proposé parce que » et le panneau « Pourquoi pas d'autres options ? » ne sont PAS dans ce
  plan.** `conditionText.ts::describeReasons` humanise l'expression booléenne brute des `conditions` —
  il n'existe **aucun** champ `motif`/`justification` rédigé dans le schéma à remplir : en ajouter un et
  rédiger le motif de chaque option de chaque nœud est un chantier de contenu à part entière (c'est le
  « défaut de lisibilité n° 1 » du rapport). P9 ne le rouvre pas — voir « Ce que ce plan NE fait pas ».
- **Le jargon rendu à l'écran est précisément localisé, pas diffus.** Grep exhaustif fait : « nœud E »
  fuit en clair 5 fois dans `prescription.yaml` (intitulé l.935, inconvénients l.700/961/1218/1747) ;
  « red-team » fuit une fois dans un champ rendu (`prescription.yaml:1946`, `reco_officielle.source`,
  affiché par `ArgumentPanel.tsx`) ; « le référent »/« retirée du nœud » fuient dans les `incertitudes`
  de `cible-glycemique.yaml` (l.184-199, également rendues) ; « voir la réserve majeure »/« voir le
  verrou de sécurité » fuient 4 fois dans les `inconvenients` de `rhd-activite-physique.yaml`
  (l.286/346/350/362). Toutes les autres occurrences (`statine.yaml`, commentaires `#` un peu partout)
  sont déjà hors du rendu — à ne pas toucher, ce n'est pas là que ça fuit.
- **« DFG > 0 » et « Palette glycémique ouverte » sont deux cas différents.** « Palette glycémique
  ouverte » est un simple libellé (`labels.ts:170`) : renommable sans toucher au moteur. « DFG > 0 »
  (`prescription.yaml:786`) est une condition brute humanisée par `describeReasons` — la corriger
  proprement exige la même refonte que « Proposé parce que », donc **hors périmètre P9** (voir plus
  bas) ; seul le premier est traité ici (S2).
- **« Agent à ajouter » vs « Remplacement » est concentré dans `prescription.yaml`.** Deux options
  seulement (« Introduire un iSGLT2 » l.712, l'option AR GLP-1 l.786) portent la famille « Agent à
  ajouter » tout en affichant, via le dérivé `remplacement_agent_sans_benefice`, un motif qui dit
  « Remplacement ». Aucune occurrence dans `insuline.yaml` ni `cible-glycemique.yaml`.
- **« Risque hypoglycémique du schéma » n'a pas de dérivé équivalent aujourd'hui.**
  `remplacement_agent_sans_benefice` (`prescription.yaml:392/417`) teste déjà
  `traitements_en_cours contient sulfamide/gliptine/glinide`, mais c'est un critère différent (agent
  sans bénéfice, pas risque hypoglycémique) et il ignore l'insuline. Rien n'existe qui dérive le risque
  hypoglycémique depuis les traitements en cours — la suggestion du référent (« l'outil peut définir à
  partir de la liste des traitements ») n'est donc pas un simple renommage, c'est une vraie question
  d'investigation : quelles options ce champ pilote-t-il exactement (`prescription.yaml:1190/1652/1713`,
  `insuline.yaml:514`), et une dérivation automatique couvre-t-elle tous ces cas ?
- **Le mécanisme de dérivé numérique ne sait pas calculer un IMC.** `deriveCritere.ts` n'accepte qu'un
  seul opérateur binaire par expression (pas de chaînage, pas d'exposant) : `IMC = poids / taille²`
  n'est pas exprimable tel quel. Saisie poids/taille au lieu d'IMC calculé reste donc **hors périmètre
  P9** (extension de grammaire du moteur, pas une session de contenu).
- **Un mécanisme d'aiguillage générique existe déjà, mais à l'échelle d'un module, pas du domaine
  entier.** `DecisionModuleScreen.tsx` (l.56-84) + `module.primer.question/orientations[]` fait
  exactement ce que le rapport demande pour l'écran d'accueil DT2 — mais RHD est aujourd'hui le seul
  module (2 nœuds sur 6). Étendre ça aux 6 nœuds du domaine suppose d'élargir la sémantique de
  `module` (actuellement un sous-groupe à cadrage commun, D22) : **hors périmètre P9**, c'est une
  décision d'architecture de contenu, pas une session isolée.

## Ce que ce plan NE fait pas

- **Le motif rédigé par option** (« Proposé parce que » en expression booléenne — défaut de lisibilité
  n° 1) **et la refonte de « Pourquoi pas d'autres options ? »** : nécessitent un champ de contenu
  nouveau (`motif`) et sa rédaction option par option, sur six nœuds — un chantier à part entière, pas
  une session.
- **Les cartes redondantes d'allègement** (« Désintensifier » vs « Réduire la posologie du sulfamide/de
  l'insuline »), **les blocs de texte trop longs** (pavé « Position déclarée AU-DESSUS… », argumentaire
  statine), et **les incohérences de voisinage entre cartes metformine** : ce sont des arbitrages de
  contenu clinique (faut-il fusionner, à quel point raccourcir sans perdre le sens) que ce plan ne
  tranche pas seul.
- **Les 15+ items de contenu clinique** relevés dans le rapport (dose/molécule d'iSGLT2/AR GLP-1,
  séquence d'introduction/arrêt, surveillance à J15, phrase jours de maladie, quantité de baisse en
  désescalade insuline, volume d'activité physique chiffré, définition d'« évaluation médicale
  minimale », seuil au-delà duquel « RHD seules 3 mois » n'est plus raisonnable…) : chacun exige sa
  propre collecte de preuve (pipeline `CONSTRUIRE-UN-MODULE.md`), pas une simple correction de contenu.
- **Les champs manquants relevés vignette par vignette** (kaliémie, cirrhose, chutes, NYHA, MMSE, TIR,
  refus de traitement, dialyse programmée sur le nœud « Traiter », poids sec, etc.) : une trentaine
  d'items dispersés sur 6 nœuds, chacun nécessitant d'abord un tri clinique (lequel agit vraiment sur
  la conduite ? lequel est juste informatif ?) avant tout cadrage de session.
- **L'aiguillage de l'écran d'accueil du domaine DT2** (sur le modèle du primer RHD) : suppose d'élargir
  la sémantique de `module`, décision d'architecture de contenu non prise.
- **Le cadrage de validité de l'HbA1c** (anémie, hémoglobinopathie, transfusion) : reste P7/SA2, plan
  séparé, non livré.
- **Une carte « RHD seules 3 mois »** et son seuil de raisonnabilité : nécessite une collecte de preuve
  dédiée avant tout encodage — non cadrée ici.

Tous ces points restent consignés dans le rapport du 2026-07-30 et l'audit qui l'accompagne ; à trier et
cadrer en **P10** une fois ce plan-ci livré.

## Sessions

| Session | Tâches | Titre | Modèle | Effort | Env. | Dépend de | Zone modifiée | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [S1](S1.md) | T-068 | Contre-indications vérifiables : schéma + moteur + rendu | Opus | high | — | — | `schema/noeud.schema.json`, `engine/evaluateNode.ts`, `lib/vueDecision.ts`, `components/OptionCard.tsx` | [x] |
| [S2](S2.md) | T-069 | Purge du jargon rendu, deux tooltips, ambiguïté « Agent à ajouter » | Sonnet | medium | — | — | `lib/labels.ts`, `prescription.yaml`, `cible-glycemique.yaml`, `rhd-activite-physique.yaml`, `statine.yaml` | [x] |
| [S3](S3.md) | T-070 | Contre-indications vérifiables : ré-encodage `prescription` | Sonnet | high | — | S1, S2 | `content/noeuds/diabete-type-2/prescription.yaml` | [ ] |
| [S4](S4.md) | T-071 | Contre-indications vérifiables : ré-encodage `statine` | Sonnet | high | — | S1, S2 | `content/noeuds/diabete-type-2/statine.yaml` | [ ] |
| [S5](S5.md) | T-072 | Contre-indications vérifiables : ré-encodage `insuline` | Sonnet | high | — | S1 | `content/noeuds/diabete-type-2/insuline.yaml` | [ ] |
| [S6](S6.md) | T-073 | Contre-indications vérifiables : ré-encodage `cible-glycemique` | Sonnet | high | — | S1, S2 | `content/noeuds/diabete-type-2/cible-glycemique.yaml` | [ ] |
| [S7](S7.md) | T-074 | « Risque hypoglycémique du schéma » : investigation et dérivation | Sonnet | high | — | S3, S5 | `content/noeuds/diabete-type-2/prescription.yaml`, `insuline.yaml`, `lib/labels.ts` | [ ] |
| [S8](S8.md) | T-075 | Metformine : protocole de titration sourcé (mémo Ameli) | Sonnet | medium | — | S3 | `content/noeuds/diabete-type-2/prescription.yaml`, `prescription.argumentaire.md` | [ ] |
| [S9](S9.md) | T-076 | Titre de dépli : aperçu du contenu replié, appliqué à la statine | Sonnet | medium | — | S1, S4 | `components/OptionCard.tsx`, `content/noeuds/diabete-type-2/statine.yaml` | [ ] |
| [S10](S10.md) | T-077 | Recette navigateur N1 des changements P9 | Claude + navigateur | medium | Desktop | tout ce qui précède | `docs/decision/validation/` | [ ] |

## Ordonnancement

- **Vague 1 — parallélisable** : **S1** (schéma/moteur/`OptionCard.tsx`, aucun YAML) · **S2** (jargon +
  labels + tooltips, texte YAML **hors** `contre_indications` et hors conditions). Zones disjointes :
  code moteur/composant vs prose de contenu.
- **Vague 2 — parallélisable** : **S3** · **S4** · **S5** · **S6** — le ré-encodage des
  `contre_indications` d'un nœud à la fois, quatre fichiers YAML disjoints. S3/S4/S6 dépendent de S2
  (elle touche déjà `prescription.yaml`/`cible-glycemique.yaml`/`statine.yaml` — jamais en parallèle sur
  ces fichiers) ; S5 ne dépend que de S1 (`insuline.yaml` n'est pas touché par S2).
  ⚠ **`labels.ts` est touché en S2, jamais en vague 2** : S3-S6 ne le modifient pas — seul S7 y revient
  ensuite (vague 3).
- **Vague 3** : **S9** (`OptionCard.tsx` + `statine.yaml`, après S1 et S4) **∥** **S7** (`prescription.yaml`
  + `insuline.yaml`, après S3 et S5 — zones disjointes de S9).
- **Vague 4** : **S8** (`prescription.yaml`, après S7 — jamais en parallèle avec S7 sur ce fichier).
- **Vague 5 — contrôle** : **S10**, recette navigateur **en local** (`npm run dev`), comme P6/P7/P8 :
  le code n'est poussé qu'après validation.
- **Vague 6 — consolidation** : commits tâche par tâche, statuts de cet index, `STATUS.md`, `TASKS.md`
  (retirer la ligne l.37-39), `VALIDATION.md`, push.

## Le fil rouge

Le mécanisme central (S1) ne change **aucune** doctrine clinique : il rend simplement une
contre-indication capable de se taire quand le critère qui la motivait ne s'applique plus — exactement
ce que `exclusions` sait déjà faire pour retirer une option entière. Les quatre sessions de ré-encodage
(S3-S6) n'inventent rien de neuf : elles rattachent à ce mécanisme des contre-indications déjà écrites,
et **s'arrêtent** dès qu'une contre-indication n'est pas vérifiable par un critère existant (elle reste
alors en texte libre, ce n'est pas un échec de la session). Toute session qui se retrouve à débattre du
bien-fondé clinique d'une contre-indication — plutôt que de sa vérifiabilité — s'est trompée de plan :
elle doit s'arrêter et signaler, pas décider.
