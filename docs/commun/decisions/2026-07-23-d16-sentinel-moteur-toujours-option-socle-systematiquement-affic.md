# 2026-07-23 — D16 · Sentinel moteur `toujours` (option socle systématiquement affichée)

### Décision

Nouveau sentinel de `conditions` : `["toujours"]` (aux côtés de `["default"]`, D10/D11). Une option
`["toujours"]` est **systématiquement applicable** en mode `multi-options` (soumise à ses `exclusions`),
**indépendamment** de ce que les autres options font — **orthogonale** au repli `default` : elle ne compte
pas comme un « non-default satisfait » et ne masque donc pas un éventuel repli par ailleurs. En mode
`ordered-first-match`, elle est traitée comme systématiquement satisfaite (gagne dès qu'atteinte dans
l'ordre du nœud). `priorite` reste utilisable normalement sur une option `toujours`.

**Distinction d'affichage (UI)** : le badge « Recommandée » (le plus haut niveau EBM) ne va plus
automatiquement à l'option d'index 0, mais à la **1re option qui n'est PAS un socle `toujours`** — une
option `toujours` porte un badge distinct **« Recommandation officielle (France) »**. Logique extraite en
fonction pure (`computeBadges`, `src/features/decision/lib/optionBadges.ts`) pour rester testable sans rendu
React ; `isToujoursOption` exporté par `evaluateNode.ts` pour que l'UI n'ait pas à dupliquer le sentinel.

### Motivation (bug de production, nœud B)

La metformine (socle du nœud B) était encodée `["default"]` (repli) : elle **disparaissait entièrement**
dès qu'une autre option non-default matchait (sémantique de repli, jamais conçue pour un socle systématique)
— contredisant le cadrage référent (« proposer la metformine en base en argumentant, et proposer d'autres
1res lignes en parallèle si le contexte clinique les justifie »). Signalé par un utilisateur (capture
d'écran, profil IC+ASCVD+obésité) : la metformine n'apparaissait plus du tout, seul un ajout (iSGLT2) était
affiché. `["toujours"]` corrige cela génériquement (pas seulement pour le nœud B — tout nœud `multi-options`
futur avec un socle similaire en bénéficie sans extension moteur supplémentaire).

### Portée

- Moteur + schéma + types étendus, champ toujours **optionnel** (un nœud qui n'utilise ni `toujours` ni
  `default` garde son comportement — non-régression, nœud A inchangé).
- **Nœud B v1.4** : metformine `conditions: ["toujours"]`, `priorite: 0` → toujours en tête, badge
  « Recommandation officielle » ; le badge « Recommandée » va à la 1re option d'ajout EBM la plus indiquée
  (ex. iSGLT2 en IC/rein, AR GLP-1 en athérome/obésité), qui se retrouve donc en **2e position**.
- Tests : nœuds synthétiques (`evaluateNode.p2.test.ts`) + `computeBadges` (`optionBadges.test.ts`) + trace
  complète sur le nœud B réel, incluant un test dédié reproduisant le profil exact signalé par l'utilisateur.

### Raison

Modéliser un « socle toujours présent » (schéma de contenu récurrent : traitement de fond qu'on ne retire
jamais, seulement complète) sans détourner le repli `default` (dont la sémantique — actif seulement en
l'absence d'autre option — reste utile ailleurs, notamment nœud A). Choix de forme (mot-clé `toujours`,
badge séparé plutôt qu'un double affichage « Recommandée ») délégué au référent, tranché explicitement :
la 1re option EBM la plus indiquée garde SON badge « Recommandée » propre, distinct de la reco officielle du
socle.

### Vérification bi-agent (2026-07-23, après codage — pipeline étape 8)

- **Agent A (fidélité)** : CONFORME sur les 2 correctifs (D16 + D17, vérifiés ensemble) — 121 tests, build OK,
  traces indépendantes sur le nœud B réel (profil exact signalé) confirmant metformine en tête + badges
  distincts.
- **Agent B (red-team)** : 3 findings, 0 HAUTE. **F1 (MOYENNE, corrigé)** : le sentinel brut `"toujours"`
  fuyait dans « Pourquoi cette option » (`conditionText.ts::describeReasons` traitait `["default"]` mais pas
  `["toujours"]`) — une carte affichait littéralement « Pourquoi cette option : toujours ». Corrigé
  (message explicite symétrique du cas `default`) + test dédié (`conditionText.test.ts`, module jusque-là
  non testé). **F2 (BASSE, doc corrigée)** : le docstring affirmait l'orthogonalité `toujours`/`default`
  sans la restreindre au mode `multi-options` — en `ordered-first-match`, un `toujours` placé avant un
  repli le masque bel et bien (aucun contenu réel ne combine les deux, comportement non changé). Docstring
  précisé + test verrouillant explicitement ce comportement. **F3 (BASSE, notée)** : le filet d'erreur
  n'enveloppe pas `Header`/`DisclaimerBar` (périmètre volontaire, risque jugé négligeable, header
  quasi-statique) — documenté dans `AppShell.tsx`.
