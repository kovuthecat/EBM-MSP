# Plan P14 — Cohérence des nœuds DT2 : ce que la table des conditions a mis au jour   (rédigé par Opus)

## Objectif d'ensemble

Une lecture systématique des 84 cartes des 6 nœuds sous forme de **table des conditions** (2026-08-06) a
révélé neuf défauts qu'aucune vignette, aucun invariant de banc et aucune recette n'avaient vus — parce
que **tous sont RELATIONNELS** (entre deux cartes, entre deux nœuds, entre un jeu de cartes et le
domaine), alors que tous les artefacts du procédé ont pour unité **une** carte. Ce plan corrige les neuf
défauts, **mécanise** la lecture qui les a trouvés (6 invariants de banc), et **consigne la leçon** dans
la grammaire et le procédé de construction, pour que le prochain domaine ne la repaie pas.

Fil conducteur d'exécution : **les invariants sont écrits EN PREMIER**, en `it.fails` là où le contenu
ne les passe pas encore (convention maison, cf. `evaluateNode.insuline.test.ts`). Chaque session de
contenu les fait ensuite basculer au vert. On ne corrige jamais un défaut puis on le vérifie avec un
outil écrit après coup.

Source du diagnostic : `docs/decision/validation/table-conditions-2026-08-06.md` (produit en S3).

## Sessions

| Session | Tâches | Titre | Modèle | Effort | Env. | Dépend de | Zone modifiée | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [S1](S1.md) | T-160, T-161 | Invariants de RELATION : paires co-actives + doublon d'intitulé | Sonnet | high | — | — | `engine/banc/paires.test.ts` (nouveau), `__snapshots__/paires.*.txt` | [x] |
| [S2](S2.md) | T-162 → T-165 | Invariants structurels : définition unique, couverture des replis, R5, D30 | Sonnet | medium | — | — | `engine/banc/coherence-inter-noeuds.test.ts`, `engine/banc/invariants-contenu.test.ts` | [x] |
| [S3](S3.md) | T-166 | Verser la table des conditions et l'inventaire des paires dans `docs/` | Sonnet | medium | — | — | `docs/decision/validation/` | [x] |
| [S4](S4.md) | T-167 | `insuline` — la sur-basalisation se lit sur la courbe, pas sur le ratio | Sonnet | high | — | S1 | `content/…/insuline.yaml`, `engine/evaluateNode.insuline.test.ts` | [x] |
| [S5](S5.md) | T-168 | `insuline` — analogue 2ᵉ génération en posologie ; familles exclusives | Sonnet | high | Desktop | S4 | `content/…/insuline.yaml`, `engine/evaluateNode.insuline.test.ts` | [x] |
| [S6](S6.md) | T-169, T-185 | `prescription` — trois issues pour sulfamide et glinide, et redécoupage de « Traitement à alléger » | Sonnet | high | — | S1 | `content/…/prescription.yaml`, `engine/evaluateNode.prescription.test.ts` | [x] |
| [S7](S7.md) | T-170 | RHD — un repli neutre dans chacun des deux nœuds (R10) | Sonnet | medium | — | S2 | `content/…/rhd-alimentation.yaml`, `content/…/rhd-activite-physique.yaml` | [x] |
| [S8](S8.md) | T-171 → T-173, T-175 → T-177 | Alignements et nettoyages mécaniques | Sonnet | low | — | S4, S5, S6, S7 | 5 YAML de contenu, `schema/decision/noeud.schema.json` | [x] |
| [S9](S9.md) | T-178 | Écrire D50 (amendement de D28 : publication d'une valeur par une option OFM) | Opus | high | — | — | `DECISIONS.md`, `docs/commun/decisions/` | [x] |
| [S10](S10.md) | T-179 | Socle — publication d'une valeur par l'option retenue d'un nœud OFM | Sonnet | xhigh | Desktop | S9 | `schema/`, `content/node.types.ts`, `lib/sessionCriteres.ts`, `screens/DecisionNodeScreen.tsx` | [x] |
| [S11](S11.md) | T-180, T-181 | Contenu — `position_vs_cible` devient la définition unique, avec zone morte | Sonnet | high | Desktop | S10, S8 | `content/…/cible-glycemique.yaml`, `…/prescription.yaml`, `…/insuline.yaml` | [x] |
| [S14](S14.md) | T-186, T-187 | **P2** — diagnostic : la matrice des faits de sécurité du domaine, `STATUS.md` corrigé | Sonnet | medium | — | — | `docs/decision/validation/`, `STATUS.md`, `PROJECT_MAP.md` | [x] |
| [S15](S15.md) | T-188 | **P2** — socle : `criteres-communs.yaml`, schéma, résolution au chargement | Sonnet | xhigh | Desktop | S10, S14 | `schema/`, `content/criteres-communs/`, `content/loadNodes.ts` | [x] |
| [S16](S16.md) | T-189 | **P2** — invariant : un fait concerné est évalué, ou déclaré hors périmètre | Sonnet | medium | — | S15 | `engine/banc/invariants-contenu.test.ts`, `schema/` | [x] |
| [S17](S17.md) | T-190 | **P2** — déplacer les faits vers le domaine (gate référent) | Sonnet | high | Desktop | S16, S8, S11 | les 6 YAML, `content/criteres-communs/` | [x] |
| [S17-arbitrage1](S17-arbitrage1-antecedent-cv.md) | — (hors plan, actée par le référent en cours d'exécution) | `cible-glycemique` adopte `ASCVD_etablie` (tranche l'arbitrage 1 de S14, N4) | Sonnet | — | — | S14 | `content/…/cible-glycemique.yaml`, `engine/evaluateNode.cible-glycemique.test.ts` | [x] |
| [S17-arbitrage2](S17-arbitrage2-fragilite.md) | — (hors plan, actée par le référent en cours d'exécution) | `fragilite` devient canal de sécurité sur `cible-glycemique` et `insuline` (tranche l'arbitrage 2 de S14) | Sonnet | — | — | S14 | `content/…/cible-glycemique.yaml`, `content/…/insuline.yaml` | [x] |
| [S18](S18.md) | T-191 | **P2** — `insuline` voit la cétonémie (D5) | Sonnet | high | — | S17 | `content/…/insuline.yaml` | [x] |
| [S19](S19.md) | T-192 | **P2** — `prescription` voit l'hypoglycémie sévère récurrente (D9) | Sonnet | high | — | S17 | `content/…/prescription.yaml` | [x] |
| [S12](S12.md) | T-193, T-182 → T-184 | Extracteur mécanique de la table des conditions ; consigner la leçon : R13/R14/R15, R5/R8/R10 enrichies, P1/P5/P6 amendés, D52-D58 (D51 pris par une décision hors P14) | Sonnet | high | — | S8, S11, S17 | `engine/banc/tableConditions.test.ts`, `docs/decision/GRAMMAIRE-NOEUD.md`, `docs/decision/CONSTRUIRE-UN-MODULE.md`, `DECISIONS.md` | [x] |
| [S13](S13.md) | — | Consolidation : commits fichier par fichier, statuts, `STATUS.md` — **push exclu du mandat de cette session, cf. son bilan** | Haiku | low | — | toutes | `STATUS.md`, `TASKS.md`, `VALIDATION.md` | [x] |

## Ordonnancement

- **Vague 1 — parallélisable** : S1 · S2 · S3 · **S14** (quatre zones disjointes ; S1 crée un fichier
  neuf, S2 étend deux fichiers existants distincts, S3 et S14 n'écrivent que dans `docs/` + `STATUS.md`).
- **Vague 2 — parallélisable** : S4 (insuline) · S6 (prescription) · S7 (RHD) — trois YAML disjoints.
- **Vague 3** : S5 (après S4, même fichier).
- **Vague 4** : S8 (après tout le contenu de vagues 2-3 : elle traverse 5 YAML, elle passe en dernier
  pour ne jamais entrer en conflit).
- **Vague 5 — séquentielle** : S9 (D50 rédigée, relue par Thibault) → S10 (socle) → S11 (contenu).
- **Vague 6 — séquentielle, chantier P2** : **S15** (socle — après S10, qui touche le même schéma) →
  **S16** (invariant, en `it.fails`) → **S17** (déplacement du contenu, **gate référent**).
- **Vague 7 — parallélisable** : **S18** (insuline) · **S19** (prescription) — deux YAML disjoints.
- **Vague 8** : S12 (documentation, une fois que tout ce qu'elle décrit est vrai).
- **Vague 9 — consolidation** : S13.

**Règle de commit du plan (leçon P13)** : les sessions dépendantes qui touchent un même fichier ne
committent pas en cours de route ; la consolidation S13 commite **fichier par fichier**, pas tâche par
tâche.

**Écart assumé à la règle de découpage** : S6 porte **deux** tâches `high`, alors que la règle veut une
tâche `high` seule dans sa session. Motif : elles touchent le **même** fichier (`prescription.yaml`,
392 Ko) et la seconde dépend de la première. Les séparer créerait exactement la chaîne de sessions
dépendantes sur un même fichier que la leçon P13 identifie comme coûteuse. Elles sont donc groupées, et
spécifiées assez finement pour que ça tienne.

## Arbitrages du 2026-08-06 — actés, ne pas rouvrir

| Question | Décision |
| --- | --- |
| Sur-basalisation sans capteur | Basale seule + HbA1c > objectif + GAJ haute ⇒ **on titre**, et on suggère la MCG (la carte existe déjà et se déclenche pour ce patient). Le ratio 0,5 U/kg ne sélectionne plus rien. |
| Valeur publiée par chaque carte de cible | Le **plafond** : `< 9 %` → 9 · `≤ 8 %` → 8 · `~6,5 %` → 7 · `≤ 7 %` → 7. |
| Bandes de suggestion | **Zone morte autour de l'objectif seulement** : `< −0,5` sous-objectif · `[−0,5 ; +0,3]` à l'objectif · `]+0,3 ; +0,5[` **rien** · `[+0,5 ; +1,5]` au-dessus · `> +1,5` nettement au-dessus. |
| 3ᵉ issue sulfamide / glinide | **Les deux, avec périmètres redécoupés** : cartes « arrêter » par médicament **et** « Désintensifier » restreinte aux insulines. |
| « Le patient refuse de changer » | **Aucun critère.** La carte « réduire » est simplement disponible, `bas_rang: true`. La négociation reste dans la consultation. |
| Analogue basal 2ᵉ génération | **Les deux** : posologie de la carte d'initiation **et** alerte pour le patient déjà sous basale. |
| Familles « menu » de `rhd-activite-physique` | **Restent cumulables.** En RHD une carte est une *piste à proposer*, pas un *geste à exécuter* — le cadrage du module le dit déjà (« une piste refusée n'est pas un échec, c'est une information »). **T-174 abandonnée.** |
| Garde-fou D50 | **Pré-remplissage uniquement**, vérifié par un invariant. Sans lui, le mécanisme n'est pas livré. |
| Construction de la table des conditions (procédé futur) | **Un seul artefact, en deux temps** — brouillon au début de P5 (pas P2, qui interdit le DSL), régénération mécanique + **diff** contre ce brouillon en P6. Fusionne ce qui était initialement pensé comme deux artefacts distincts (« matrice de partition » avant / « table des conditions » après). L'outil de régénération (T-193, S12) est construit dans ce plan — l'extraction manuelle de S3 ne se généralise pas telle quelle. |
| Chantier P2 (critères communs de domaine) | **Absorbé en entier par P14** — `criteres-communs.yaml` compris. P13 l'avait renvoyé à « un plan P14 dédié » ; il est traité ici, S14 → S19. |
| `antecedent_cv` vs `ASCVD_etablie` | **T-176 tient** (poser une `aide`, utile tout de suite et réversible) ; la question de fond — un fait ou deux ? — est instruite par le diagnostic S14. |

## Ce que chaque défaut devient

| # (diagnostic) | Défaut | Traité par |
| --- | --- | --- |
| ① | `insuline` : « Ne pas sur-titrer » et « Titrer la basale » co-actives | S4 |
| ② | `prescription` : deux cartes de même intitulé, actions opposées | S6 (fond + titres) + S8 (titres restants) |
| ③ | `insuline` : alternatives présentées comme « gestes cumulables » | S5 |
| ④ | `cible_atteinte` : deux définitions sous un même nom | S11 (fond) + S2 (garde) |
| ⑤ | `presomption_non` asymétrique entre nœuds | S2 (mécanisation de D30) |
| ⑥ | `terrain_cible_assouplie` : deux écritures | S8 |
| ⑦ | RHD sans repli | S7 |
| ⑧ | `prescription` : trou dans la couverture des replis (R10) | S8 (T-177) + S2 (garde) |
| ⑨ | `verrou_effort` déclaré sans lecteur | S8 (T-172) + S2 (mécanisation de R5) |
| mineurs | `exclusions: []`, `aide` sur `antecedent_cv` | S8 (familles RHD : abandonné, cf. arbitrages) |
| **P2 / D9** | `hypo_severe_recurrente` absente de `prescription` — repliée dans une `aide` de saisie | S14 (verdict) + S19 |
| **P2 / D5** | `cetonemie` absente d'`insuline` — un patient en cétonémie n'y obtient rien | S14 (verdict) + S18 |
| **P2 / N4** | `antecedent_cv` vs `ASCVD_etablie` : deux vocabulaires pour un fait voisin | S14 (arbitrage posé) + S8/T-176 (surface) |
| **P2 / fond** | un fait de sécurité défini par nœud au lieu de l'être par domaine | S15 (socle) + S16 (invariant) + S17 (déplacement) |
| leçon | aucun artefact dont l'unité soit la relation ; **et un procédé entièrement par nœud, qui ne pose jamais de question au niveau du domaine** | S1, S3, S14, S12 |

## Bilan de clôture — 2026-08-07 (S13, consolidation)

**Les 19 sessions + les 2 sessions hors-plan (arbitrages 1 et 2) ont toutes été exécutées et livrées,
aucun STOP n'est resté ouvert.** Les trois STOP rencontrés en cours d'exécution (T-165/D30 sur S2, le
trou de couverture `couverture.test.ts`/`prescription` sur S6/S8, le golden master
`caracterisation.insuline.txt` incohérent sur S11) ont tous été résolus par une décision référent,
consignées respectivement en D55, dans les tables d'exception de `couverture.test.ts`, et en D58. Seul
T-172 (S8, suppression du dérivé `verrou_effort`) a nécessité une décision référent tardive
(2026-08-07) pour lever l'invariant R5/T-164 — non anticipée par `S13.md`, qui l'attendait « levé en
S8 » : en réalité S8 avait posé un STOP légitime sur ce point, résolu ensuite par le retrait du dérivé.

**N0 final, mesuré machine libre, deux exécutions consécutives identiques** : `npm run build` et
`npm run typecheck` verts (0 erreur) ; `npm test` → **65 fichiers passés | 1 skip (66)**,
**1275 tests passés | 11 skip (1286)**, **0 échec**, **aucun `it.fails` restant** dans
`engine/banc/` (`git grep "it\.fails("` → 0 occurrence). Départ du plan : ~1234 tests (S1).

### Découverte bloquante — un second lot, non-P14, entrelacé dans les mêmes fichiers de contenu

Cette session a découvert, en préparant les commits, qu'un **second chantier — la « contre-relecture des
quatre niveaux d'argumentaire »** (relecture éditoriale des cartes, distincte de P14, déjà partiellement
committée par Thibault le 2026-08-07 dans `f271c8c`) avait modifié, **dans l'arbre de travail non commité,
les quatre mêmes fichiers de contenu que P14** : `insuline.yaml`, `prescription.yaml`,
`rhd-alimentation.yaml`, `rhd-activite-physique.yaml`. Le commit `f271c8c` le dit lui-même noir sur blanc
dans son message (« non inclus ici pour ne pas mêler deux lots ») et le document
`docs/decision/validation/contre-relecture-redaction-2026-08-06.md` (§4 ter, déjà committé) demande
explicitement : « avant toute consolidation (P14/S13), vérifier qu'aucune autre session P14 n'est active
sur les fichiers de contenu » — la question inverse (contre-relecture active sur les fichiers P14) ne
s'était pas posée avant cette session.

Vérifié par grep sur les changelogs internes (`auteur: "Claude Code — contre-relecture rédactionnelle…"` /
`"…arbitrage référent, en attente de relecture clinique"`, aucune des deux tournures ne cite jamais
`P14/S<k>`) et confirmé par un test de séparabilité (le repli neutre créé par S7/T-170 a lui-même été
reformulé ensuite par la contre-relecture — les deux lots touchent parfois les mêmes lignes, pas
seulement des cartes différentes du même fichier) : **une séparation fiable par `git add -p` n'est pas
possible sans risque de commettre soit du texte clinique non relu par P14, soit un état interne
incohérent.** `cible-glycemique.yaml` est le seul des 5 nœuds de contenu que la contre-relecture n'a pas
touché (« le nœud modèle », cf. le document cité) — confirmé propre et commité.

**Conséquence : `insuline.yaml`, `prescription.yaml`, `rhd-alimentation.yaml`, `rhd-activite-physique.yaml`
et tout ce qui en dépend directement (leurs `evaluateNode.*.test.ts`, leurs snapshots `caracterisation*`/
`paires.*`/`table-conditions.*`, `banc/fixtures/profils.insuline.json`) restent NON COMMITÉS à l'issue de
cette session** — le travail existe intégralement dans l'arbre de travail (vérifié vert par le N0
ci-dessus, qui porte sur le disque, pas sur l'historique Git) mais n'entre pas dans l'historique tant que
quelqu'un n'aura pas tranché comment séparer les deux lots (ou accepté de les committer ensemble). Ce qui
EST commité : tout le socle générique (banc d'invariants, chantier P2, socle D50, procédé/grammaire,
D50/D52-D58) et le seul nœud de contenu propre, `cible-glycemique.yaml` (T-181, D56, D57 partie
cible-glycemique). Ce qui reste bloqué représente la majorité du contenu clinique concret des 9 défauts
(T-167 à T-177, T-185, T-190 à T-192). Détail et options pour trancher : rapport de la session S13 remis à
l'orchestrateur.
