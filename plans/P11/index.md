# Plan P11 — Le langage visuel de la maquette, appliqué à tous les nœuds   (rédigé par Opus)

## Objectif d'ensemble

Porter le langage visuel de la maquette Claude Design « Traiter — Refonte ergonomie » (v2, 2026-08-01)
sur les composants **génériques** du module Décision, donc sur les **6 nœuds à la fois** : icônes SVG à
la place des emoji, tons sémantiques sur les champs de saisie, points de preuve compacts, et surtout une
**carte d'option en une ligne** qui remplace la carte haute d'aujourd'hui. Zéro changement de contenu
clinique : le YAML est déjà aligné (cf. ci-dessous), tout le travail est en présentation.

Source : `design/maquettes/traiter-refonte-ergonomie-v2/` (figée dans le repo le 2026-08-01) ·
arbitrages référent du 2026-08-01 (4 questions, cf. « Arbitrages » plus bas).

## Ce que ce plan a vérifié avant de se lancer

- **Le contenu YAML est DÉJÀ aligné sur la maquette — rien à écrire côté clinique.**
  `prescription.yaml` porte déjà exactement les 6 groupes de la maquette (`Je souhaite` 1 champ ·
  `Traitement` 2 · `Équilibre` 2 · `Ce qui oriente le choix` 5 · `Signaux d'alerte et tolérance` 7 ·
  `Terrain et préférences` 5), et `position_vs_cible` (l.109) porte déjà les 4 valeurs colorées de la
  maquette. La section « Équilibre » n'est donc **pas** un contenu nouveau. P11 est intégralement un
  plan de présentation — aucune tâche ne touche `content/`.

- **5 nœuds sur 6 ont un accordéon multi-sections, et le 6ᵉ est le cas limite à ne pas casser.**
  `insuline` 8 sections · `prescription` 6 · `rhd-alimentation` 5 · `rhd-activite-physique` 4 ·
  `statine` 2 · **`cible-glycemique` 0 groupe → rendu à plat**, repli historique de `CriteriaForm.tsx`
  (l.167 `accordeon = groupes.length > 1`), verrouillé par `CriteriaForm.test.tsx:633`. Toute session
  qui touche l'accordéon vérifie les deux branches, pas seulement celle de la maquette.

- **Il n'existe aucun module d'icônes, et D9 disait « zéro icône MVP ».** Aucun `<svg>` inline dans
  `src/` (0 résultat), un seul fichier vectoriel dans tout le dépôt (`public/favicon.svg`). Les icônes
  d'aujourd'hui sont 13 emoji répartis en 2 dictionnaires (`lib/labels.ts` l.451-467 `ENUM_VALUE_ICONS`,
  `OptionCard.tsx` l.108-112 `ACTION_ICON`) plus des caractères ASCII en pastille. Introduire un kit SVG
  **amende D9** — à tracer, pas à faire en passant.

- **L'emoji `⚠` est asserté LITTÉRALEMENT par 5 assertions de test, dont une sur les 6 nœuds réels.**
  `OptionCard.test.tsx` l.103, 227, 238 · `banc/carte-affichage.test.tsx` l.185 (`.includes('⚠')`) et
  l.193 (`not.toContain`), ce dernier via `it.each(noeuds)` donc ×6. Le passage en SVG **ne peut pas**
  être livré sans réécrire ces tests : c'est du périmètre S6, pas un dommage collatéral.

- **Le garde-fou I12 verrouille la structure de la carte par ORDRE DU DOM, et la carte une ligne le
  contredit frontalement.** `banc/carte-affichage.test.tsx` exige aujourd'hui : doses et alertes
  **dans le socle**, avant tout `<details>` (§2-§3, l.200-218) ; contre-indications dans le **premier**
  `<details>` (§1, l.157-172) ; « Proposé parce que » dans le **dernier** (§4, l.224-230). L'arbitrage
  référent « carte en une ligne, tout au clic » fait tomber §3 pour les doses. Ce test se **réécrit**
  pour exprimer le nouveau contrat — il ne se supprime ni ne se contourne (S6, T-111).

- **Trois défauts réels trouvés en chemin, réparés par S1.** `DecisionNodeScreen.css` l.463-479 utilise
  `var(--border, #d8dce3)`, `var(--text, #1a202c)`, `var(--text-muted, #4a5568)` : **ces trois variables
  n'existent pas** (les tokens sont préfixés `--c-`), les fallbacks hexadécimaux s'appliquent donc
  toujours et ce bloc est hors du système OKLCH. Par ailleurs aucun token d'espacement ni échelle
  typographique n'existe (14 valeurs de `font-size` en dur), et 4 breakpoints coexistent sans constante
  partagée (480/481, 640, 959/960).

- **Le compte du CTA flottant mobile est faux.** `DecisionNodeScreen.tsx` l.309-314 aplatit
  `vue.familles` **y compris les cartes repliées** derrière « Autres pistes possibles », que le praticien
  ne voit pas au premier coup d'œil. Corrigé en S7 (T-113).

## Arbitrages référent du 2026-08-01 (opposables aux sessions)

La maquette contredit trois décisions récentes ; Claude Design ne les connaissait pas. Tranché :

| Sujet | Maquette | Retenu | Conséquence |
| --- | --- | --- | --- |
| Ouverture CI / posologie | survol seul (`title=`) | **Survol ≥960px + clic partout** | `PastilleInfo` (S3) : un vrai bouton, jamais un `title=` |
| Barre d'étapes en tête de formulaire | réintroduite, numérotée | **Reste retirée** (décision du 2026-07-29 maintenue) | S4 ajoute seulement le chevron d'état manquant |
| Posologie sur la carte | repliée | **Repliée — carte en une ligne** | **Fait tomber l'acquis du 2026-08-01** « posologie toujours visible » ; amende D34 |
| Couleur des champs de saisie | par gravité clinique | **Oui, catalogue de tons par valeur** | Mécanisme générique dans `labels.ts`, aucun nom de nœud en dur (D8) |

**Ce qui n'est PAS négociable malgré la carte une ligne** : les alertes d'option (`AlertList`) restent
hors dépli — un fait de sécurité s'affiche avec son motif (D21), et aucun arbitrage n'a porté dessus.

## Arbitrages référent du 2026-08-02 (après lecture du code livré par S1→S7, avant la recette)

Rendus une fois S1→S7 livrées et **avant** S8, pour que la recette porte sur l'état définitif. Deux
amendent P11, le troisième ne demande aucun travail :

| Sujet | Livré par P11 | Retenu | Conséquence |
| --- | --- | --- | --- |
| Cible tactile des pastilles (N2 de T-105) | pastilles 32×32 px | **« je verrai à l'usage »** | Aucune action ; l'item reste ouvert dans `VALIDATION.md` |
| Largeur de l'écran (N2 de T-114) | `max-width: 900px` | **Les deux colonnes occupent la largeur ; usage principal desktop grand écran** | S10/T-118 — tranche le N2, qui se ferme |
| Badge de niveau de preuve | 3 points (T-109) | **Retour au badge textuel précédent** | S10/T-117 — **révoque T-109** |

**Les deux tâches de S10 sont indissociables** : T-109 justifiait les points par « c'est ce qui rend la
carte en une ligne tenable » ; c'est l'élargissement de T-118 qui reprend ce rôle. Livrer T-117 seule
casserait la carte compacte de S6.

## Sessions

| Session | Tâches | Titre | Modèle | Effort | Env. | Dépend de | Zone modifiée | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [S1](S1.md) | T-102, T-103 | Fondations du design system | Sonnet | medium | — | — | `src/styles/`, `DecisionNodeScreen.css` (l.463-479) | [x] 2026-08-01 |
| [S2](S2.md) | T-104 | Kit d'icônes SVG | Sonnet | medium | — | — | `src/features/shared/icons/` | [x] 2026-08-01 |
| [S3](S3.md) | T-105 | `PastilleInfo` — survol desktop, clic partout | Sonnet | high | Desktop | S2 | `src/features/shared/ui/` | [x] 2026-08-01 |
| [S4](S4.md) | T-106→T-108 | CriteriaForm — chevron, tons, icônes | Sonnet | medium | Desktop | S1, S3 | `components/CriteriaForm.*`, `lib/labels.ts` | [x] 2026-08-02 |
| [S5](S5.md) | T-109, T-110 | Badge de preuve en points + périphériques | Sonnet | medium | — | S1, S2 | `badges/EvidenceBadge.*`, `AlertList.*`, `CadrageList.*`, `ArgumentPanel.*` | [x] 2026-08-02 |
| [S6](S6.md) | T-111 | OptionCard — carte en une ligne | Sonnet | high | Desktop | S3, S5 | `components/OptionCard.*`, `banc/carte-affichage.test.tsx` | [x] 2026-08-02 |
| [S7](S7.md) | T-112→T-114 | Colonne recommandations & écran | Sonnet | medium | Desktop | S6 | `screens/DecisionNodeScreen.*` | [x] 2026-08-02 |
| [S10](S10.md) | T-117, T-118 | Arbitrages référent du 2026-08-02 | Sonnet | medium | — | S7 | `badges/EvidenceBadge.*`, `tokens.css`, `DecisionNodeScreen.css` | [x] 2026-08-02 |
| [S8](S8.md) | T-115 | Vérification visuelle 3 nœuds | Sonnet | low | Desktop | **S10** | `VALIDATION.md`, `docs/decision/validation/` | [x] 2026-08-02 |
| [S9](S9.md) | T-116 | Consolidation, D44/D45/D46, push | Haiku | low | — | S8 | `DECISIONS.md`, `STATUS.md`, `TASKS.md` | [x] 2026-08-02 |

## Ordonnancement

- **Vague 1 — parallélisable** : S1 · S2 (zones disjointes, aucune dépendance).
- **Vague 2** : S3 (après S2 — consomme `Icon`).
- **Vague 3 — parallélisable** : S4 · S5 (zones disjointes : `CriteriaForm`+`labels.ts` d'un côté,
  les 4 autres composants de l'autre. **S5 ne touche pas `labels.ts`**, c'est la condition de la
  parallélisation).
- **Vague 4** : S6 (après S3 et S5) — la session la plus risquée, seule.
- **Vague 5** : S7 (après S6).
- **Vague 5bis** : S10 — arbitrages référent du 2026-08-02, **avant** la recette pour qu'elle porte sur
  l'état définitif (badge textuel restauré, mise en page élargie).
- **Vague 6** : S8 — vérification visuelle N1 sur `prescription`, `insuline` et `cible-glycemique`.
- **Vague 7 — consolidation** : S9 (commits tâche par tâche, statuts, `STATUS.md`, push).

## Reprise — état au 2026-08-02

**S1→S7 et S10 livrées, rien n'est commité, `.claude/wave.lock` est toujours posé** (il bloque commit et
push : c'est S9 qui le retire). N0 vérifié après S10 et après le relèvement du budget du banc :
`npm run build` vert, `npm run typecheck` vert, `npm test` → **980 passés, 11 skippés, 0 échec**.
La suite est verte, S9 n'est plus bloquée.

**Reprendre par S8, depuis Claude Code Desktop** — elle a été tentée depuis VSCode et arrêtée : son
bandeau la déclare bloquante sans navigateur in-app, et `/verif-visuelle` prescrit le STOP dans ce cas.
Aucune ligne de l'UI de P11 n'a donc encore été rendue dans un navigateur. Les sessions S3→S7 ont chacune
laissé, dans leur `S<k>.md`, une checklist N1 « Mode B » à reverser dans la recette de S8.

Trois points ouverts que S8 doit trancher, et qu'aucun test unitaire ne couvre :

- **La carte tient-elle sur une ligne à 380 px** (condition d'arrêt de S6, jamais vérifiée). La colonne
  reçoit ~390 px réels (mesure S7) : 10 px de marge. Si ça déborde → arbitrage de conception, pas correctif CSS.
- **L'en-tête de colonne est non sticky** : repli prudent de S7 faute d'avoir pu observer un sticky
  imbriqué, pas un choix validé.
- **Aucun `validateDOMNesting`** en console (risque introduit par les pastilles dans `CriteriaForm` et `OptionCard`).

Trois dettes relevées en chemin, à traiter par S9 ou à verser au backlog :

- **`npx tsc --noEmit` est factice** à la racine (`tsconfig.json` en `files: []` + références de projet :
  0 fichier compilé). C'est pourtant la garde N0 inscrite dans les 9 sessions de ce plan et dans
  `CLAUDE.md`. La vraie commande est `npm run typecheck` (`tsc -b --noEmit`) — à corriger aussi dans les
  gabarits de `Templates/`, sinon tous les plans à venir héritent du défaut.
- **Le ton `attention` de `PastilleInfo` est surchargé en CSS depuis `OptionCard.css`** : S3 ne lui a donné
  que `neutre`/`danger`, S6 en demandait un troisième. Résolu sans toucher `PastilleInfo` (les deux
  registres — danger clinique vs dose manquante — ne devaient pas être confondus). À rendre natif.
- **~~`securite-atteignable.test.ts` dépasse son délai~~ — RÉGLÉ le 2026-08-02 (arbitrage référent).**
  Le banc qui garantit qu'aucun écran ne reste muet balaie tous les profils × tous les critères masqués
  un à un : il coûte **~115 s pour un budget de 120 s**, soit 4 % de marge. Son verdict était donc
  fonction de la charge machine et non du code — même arbre, suite complète en 134 s → vert ; en 294 s →
  rouge. `DELAI_BANC_MS` **relevé 120 000 → 300 000 ms dans les 4 fichiers du banc** (`couverture`,
  `impasse`, `invariants`, `securite-atteignable`), qui le tiennent en phase à dessein : n'en relever
  qu'un aurait laissé les trois autres au bord de la même falaise. Le test, sa couverture et le moteur
  sont **inchangés** — seul le budget bougeait. Vérifié sur le run le plus lent des trois (327 s) :
  980 passés, 0 échec. Le budget est déclaré **par test**, en 3ᵉ argument d'`it` : c'est pourquoi un
  `--testTimeout` en ligne de commande restait sans effet. Ligne de backlog correspondante retirée de
  `TASKS.md`.
