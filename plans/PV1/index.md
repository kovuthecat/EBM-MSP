# Plan PV1 — Démarrage du module Veille : deux éditions à la main avant tout code   (rédigé par Opus)

> **Numérotation** — les plans du module Veille portent le préfixe `PV`, ceux du module Décision
> gardent `P` (P1→P10). Les identifiants de tâches restent dans la séquence globale `T-0xx` de
> `TASKS.md` : c'est un espace de noms unique, le forker créerait des collisions.

## Objectif d'ensemble

Ouvrir le module Veille par la **production réelle**, pas par l'écran. Deux éditions hebdomadaires
produites entièrement à la main — **en conditions live, depuis la boîte mail dédiée** — fixent la
liste de sources, le schéma d'entrée, le contrat de cadence et le vocabulaire d'affichage. Le modèle
n'est gelé qu'ensuite, et V1/V2 se câblent sur du contenu réel — jamais sur des entrées inventées.

C'est la transposition au module Veille de la leçon P2 de
[CONSTRUIRE-UN-MODULE.md](../../docs/decision/CONSTRUIRE-UN-MODULE.md) : *inverser l'ordre
d'acquisition de la certitude*. En DT2, on a été certain des données très tôt et du modèle très tard.
Ici, la tentation symétrique est d'être certain du schéma YAML et de l'écran très tôt, et du **cycle
de production** très tard — alors que c'est lui, et lui seul, qui décide si le module survit à la
semaine 4.

**Second pivot — boîte mail plutôt qu'archives web (arbitrage du 2026-08-01)** : l'arbitrage du
2026-07-31 ci-dessous (collecte rétrospective sur `2026-W30`/`2026-W31` via archives datées des
sources) est **abandonné avant exécution**. Le web-fetch programmé se heurtait de façon répétée aux
anti-bots (`SOURCES.md`, vérification S2 : 403/429 sur la majorité des domaines), alors que plusieurs
sources Tier 1 sont de toute façon **nativement des newsletters**, pas des sites à scraper
(DragiWebdo, EvidenceAlerts, DGS-Urgent...). Une boîte mail dédiée (`ebmmsp@gmail.com`) reçoit
désormais les newsletters natives **et** les flux RSS sans newsletter, pontés par Blogtrottr (47/55
flux importés avec succès, cf. `docs/veille/flux-rss-a-importer.txt`). Conséquence structurante :
**S3 et S4 ne sont plus rétrospectives** — ce sont les deux premières éditions **live**, produites à
partir de ce qui arrive réellement dans la boîte, sans reconstruction sur archives. Elles ne peuvent
donc plus s'enchaîner dans la même séance : chacune attend sa propre semaine de collecte (cf.
Ordonnancement). Exception connue : **DGS-Urgent** ne peut pas être routé vers la boîte dédiée (canal
MSSanté, lié à l'identité professionnelle RPPS/ADELI) — il reste consulté sur la boîte MSSanté
personnelle du référent, hors boîte de collecte centralisée.

## Arbitrages entrants (tranchés avec le référent le 2026-07-31, consignés en S1)

| point | arbitrage |
| --- | --- |
| Taxonomie | **13ᵉ thème `infectiologie-antibiotherapie`** ajouté (arbitrage du 2026-07-31). `BRIEF_VEILLE.md` §8bis la liste comme priorité MG et aucun des 12 thèmes ne la couvrait ; la taxonomie n'existe encore dans **aucun code ni contenu**, le coût est nul aujourd'hui et non nul après S5. |
| Périmètre de production | **9 thèmes MG** : `soins-premiers`, `diabete-metabolisme`, `cardiovasculaire-prevention`, `bpco-pneumo`, `infectiologie-antibiotherapie`, `geriatrie-deprescription`, `prevention-depistage-vaccination`, `sante-mentale-addictologie`, `douleur-soins-palliatifs`. Les 4 autres (`ETP`, `sante-femme-perinatalite`, `orthophonie`, `soins-infirmiers`) restent au modèle de données, sans production. |
| Comptes | **Aucun en v1.** Profil et « pour mémoire » en `localStorage`. Supabase et tout le §9bis RGPD reportés. |
| Double lecture | **Aucun second lecteur humain aujourd'hui** → la SOP est amendée et la page Méthode publie ce qui est réellement fait. |
| Jour | **Lundi.** Éditions de cadrage produites **live**, depuis la boîte mail dédiée : `2026-W32` (S3, lundi 03/08) puis `2026-W33` (S4, lundi 10/08) — cf. second pivot du 2026-08-01 ci-dessus. |
| Triage | **Tout item potentiellement à impact pratique passe en grille complète + vérification bi-agents.** L'informatif reste en brève. |
| Arborescence | **Séparer le commun du propre à chaque module** avant que le contenu Veille existe — sinon on déplace deux fois (S0). |

**Conséquence structurante du triage** — le régulateur de charge n'est plus un plafond d'analyses, il
est dans le **seuil de classement au screening**. Et comme le screening ne peut juger que du
*potentiel*, deux champs distincts sont nécessaires : la **route de production** (brève | analyse,
décidée avant de savoir) et le **`niveau_impact`** (pratique | informatif, verdict après analyse).
Ils ne coïncident pas : une analyse complète peut conclure « informatif », et c'est le cas le plus
utile au lecteur. Donc **analyse ⊇ pratique**, et brève ⟹ informatif toujours.

## Sessions

| Session | Tâches | Titre | Modèle | Effort | Env. | Dépend de | Zone modifiée | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [S0](S0.md) | T-101 | Réorganiser l'arborescence : commun / décision / veille | Sonnet | medium | — | — | `docs/`, `content/`, `schema/`, `src/features/decision/content/`, `PROJECT_MAP.md`, `CLAUDE.md` | [x] 2026-07-31 |
| [S1](S1.md) | T-089→T-092 | Doctrine de production : seuil, SOP amendée, gabarits, décisions | Opus | high | — | S0 | `docs/veille/SOP_veille.md`, `docs/veille/semaines/_gabarit/`, `DECISIONS.md`, `docs/commun/decisions/` | [x] 2026-07-31 |
| [S2](S2.md) | T-093 | Liste de sources candidate, vérifiée en ligne | Sonnet | medium | — | S0 | `docs/veille/SOURCES.md` | [x] 2026-07-31 |
| [S3](S3.md) | T-094 | **Édition `2026-W32`** (première édition live, boîte mail dédiée) + arbitrage de la liste à chaud | Opus | high | — | S1, S2 | `docs/veille/semaines/2026-W32/`, `docs/veille/SOURCES.md` | [ ] |
| [S4](S4.md) | T-095 | **Édition `2026-W33`** (deuxième édition live) + bilan mesuré → contrat de cadence | Opus | high | — | S3, **+7 jours de collecte réelle** | `docs/veille/semaines/2026-W33/`, `docs/veille/SOURCES.md`, `docs/veille/SOP_veille.md` | [ ] |
| [S5](S5.md) | T-096 | Gel du modèle : JSON Schema, types, chargement, conversion des 2 semaines | Sonnet | medium | — | S4 | `schema/veille/`, `content/veille/`, `src/features/veille/content/` | [ ] |
| [S6](S6.md) | T-097 | Écran V1 — liste filtrable sur les 2 semaines réelles | Sonnet | medium | Desktop | S5 | `src/features/veille/screens/`, `src/features/veille/components/`, `src/App.tsx` | [ ] |
| [S7](S7.md) | T-098 | Écran V2 — détail + pont bidirectionnel veille ↔ nœud | Sonnet | medium | Desktop | S6 | `src/features/veille/`, `src/features/decision/screens/DecisionDomainsScreen.tsx` | [ ] |
| [S8](S8.md) | T-099 | Page Méthode réalignée sur la SOP amendée | Haiku | low | — | S1 | `src/features/shared/screens/MethodeScreen.tsx` | [ ] |
| [S9](S9.md) | T-100 | Consolidation : commits tâche par tâche, statuts, fichiers de contexte, push | Haiku | low | — | S7, S8 | `STATUS.md`, `TASKS.md`, `PROJECT_MAP.md`, `VALIDATION.md`, `plans/PV1/index.md` | [ ] |

## Ordonnancement

- **Vague 1** : S0 **seule**. Un déplacement de fichiers à l'échelle du dépôt ne se parallélise avec
  rien — il touche les chemins que toutes les autres sessions écriront.
- **Vague 2 — parallélisable** : S1 · S2 (zones disjointes : doctrine vs liste de sources ; aucune
  dépendance — les 8 thèmes sont déjà arrêtés, le seuil d'inclusion ne change pas quelles sources
  existent).
- **Vague 3** : S3 (édition `2026-W32`, lundi 03/08 — dès que la collecte de la semaine est
  disponible dans la boîte mail).
- **Vague 4** : S4 (édition `2026-W33`, lundi 10/08). **Ne s'enchaîne plus immédiatement après S3** :
  les deux éditions sont désormais live, chacune attend sa propre semaine de collecte réelle — à la
  différence de l'ancien schéma rétrospectif où les deux fenêtres étaient déjà closes.
- **Vague 5** : S5 (après S4 — le schéma ne se gèle pas sur une seule édition).
- **Vague 6 — parallélisable** : S6 · S8 (zones disjointes : `features/veille/` vs
  `features/shared/screens/MethodeScreen.tsx`).
- **Vague 7** : S7 (après S6).
- **Vague 8 — consolidation** : S9.

## Ce que ce plan ne fait pas

- **Aucun diff de nœud de décision.** Si une édition remonte un item `concerne_decision`, il est
  **enregistré** (`noeuds_impactes`, `proposition_maj: candidate`) et une tâche est ouverte dans
  `TASKS.md` — la rédaction du diff et le circuit D5 sont hors périmètre de PV1. Sans ce garde-fou,
  une seule étude fait exploser une session de production.
- **Aucun compte, aucune dépendance Supabase, aucun document RGPD.**
- **Ni V3 (profil) ni V4 (« pour mémoire »)** — PV1 livre V1 et V2. Le filtre par profession existe
  dans V1 comme **filtre**, pas comme préférence enregistrée : même service, sans persistance. Le
  profil en `localStorage` (D37) est une décision *contre Supabase*, pas un engagement à le construire
  dans ce plan ; V3/V4 feront l'objet d'un PV2, une fois qu'il y aura des lecteurs pour les réclamer.
- **Aucune collecte automatisée** (PubMed E-utilities, Europe PMC, GitHub Action) — D7 la maintient
  en Phase 4, et le brief §14 la place après le rodage manuel. PV1 **est** le rodage manuel.
- **Aucun déplacement de `plans/`** : le préfixe `PV` suffit à séparer les deux modules, et déplacer
  dix dossiers de plan casserait leurs liens internes pour un gain nul.

## Après PV1

L'édition hebdomadaire devient une **session récurrente**, dont le modèle et l'effort sont fixés par
le bilan mesuré de S4 — pas reconduits par défaut à Opus/high, qui est le coût de la première fois.
C'est le premier chiffre à surveiller : une veille dont chaque semaine coûte une session Opus n'est
pas soutenable douze mois.
