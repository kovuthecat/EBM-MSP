# P14 · S17-arbitrage1-antecedent-cv — Décision référent : `cible-glycemique` adopte `ASCVD_etablie`

> Session ad hoc, hors numérotation du plan P14 (le fichier `S17.md` existant porte une AUTRE tâche —
> « Déplacer les faits vers le domaine », bloquée sur son propre gate référent N2). Celle-ci exécute une
> décision prise EN CONVERSATION par le référent le 2026-08-07, tranchant l'arbitrage 1 laissé ouvert par
> S14 (`docs/decision/validation/criteres-communs-2026-08-06.md` §6). Fichier créé par consigne explicite
> de la conversation qui a lancé cette session — pas de commit ni de push (`.claude/wave.lock` actif).

- Date : 2026-08-07 · Exécutant : Claude Code (Sonnet)

## Contexte

S14 avait posé sans trancher : `antecedent_cv` (déclaré sur `cible-glycemique.yaml`) et `ASCVD_etablie`
(déclaré à l'identique sur `prescription.yaml` et `statine.yaml`, `partage: true`, `presomption_non: true`)
désignent-ils le même fait clinique ? `antecedent_cv` avait été ajouté le 2026-08-06 (P14/S8, T-176) avec
une définition large (« tout antécédent cardiovasculaire »), tandis qu'`ASCVD_etablie` porte, sur les deux
autres nœuds, une définition stricte (maladie cardiovasculaire **établie**, au sens des essais CTT/HPS).

Le référent a tranché en conversation, le 2026-08-07 : **« il faut appliquer `ASCVD_etablie` sur le nœud de
cible glycémique »**. Conséquence assumée : des patients qui obtenaient aujourd'hui l'assouplissement de
cible à 8 % sur la seule base d'un antécédent cardiovasculaire ancien/stabilisé, sans répondre au sens
strict d'« établie », ne l'obtiendront plus par ce critère seul — ils restent éligibles via
`fragilite`/`comorbidite_grave`/`esperance_vie == limitee`, les trois autres branches `OR` de la carte
« Cible ≤ 8 % », inchangées.

## Ce qui a été fait

### 1. `content/decision/noeuds/diabete-type-2/cible-glycemique.yaml`

- **Retiré** : le bloc `antecedent_cv` (déclaration, `aide` de T-176, `presomption_non`).
- **Ajouté** : `ASCVD_etablie`, encodage **rigoureusement identique** à `prescription.yaml`/`statine.yaml`
  (`partage: true`, `type: bool`, `presomption_non: true` — aucune `valeurs`/`derive`, saisie directe).
  Pas de `groupe` : aucun critère de ce nœud n'en porte un (organisation à plat, une seule section de
  formulaire) — cohérent avec l'existant, `antecedent_cv` n'en portait pas non plus (contrairement à ce
  que supposait la consigne de départ). `groupe` est de toute façon explicitement EXCLU de la signature
  comparée par l'invariant I19/I32 (`coherence-inter-noeuds.test.ts` l. 36-39), donc son absence ne pouvait
  de toute façon pas faire diverger l'encodage partagé.
- **`aide`** (voir texte exact ci-dessous) : ni `prescription.yaml` ni `statine.yaml` ne portent d'`aide`
  sur leur propre `ASCVD_etablie` (vérifié — aucune des deux déclarations n'a ce champ) — celle-ci en
  devient la première du domaine. Reprend le texte posé sur `antecedent_cv` par T-176 (déjà proche de la
  définition stricte : IDM/AVC-AIT/revascularisation) et l'aligne sur la définition complète de
  `docs/decision/noeuds/F-statine.md` (« maladie athéromateuse établie … = prévention secondaire »), en
  ajoutant l'artériopathie périphérique symptomatique, absente du texte précédent. **Non reportée** sur
  `prescription.yaml`/`statine.yaml` (hors périmètre de cette session, signalé dans le changelog).
- **Remplacements `antecedent_cv` → `ASCVD_etablie`** dans toutes les occurrences actives du fichier :
  - condition de « Cible ≤ 8 % » (`... OR antecedent_cv == true` → `... OR ASCVD_etablie == true`) ;
  - garde négatif de « Cible ~6,5 % (6,5–7 %) » (`conditions`) ;
  - `contre_indications` de la même option : `condition` renommée, et `texte` « Antécédent cardiovasculaire
    établi » → « Maladie cardiovasculaire établie » (cohérence de vocabulaire) ;
  - clé de `motifs` : `"antecedent_cv == false"` → `"ASCVD_etablie == false"`, texte « Aucun antécédent
    cardiovasculaire » → « Aucune maladie cardiovasculaire établie » (demandé explicitement) ;
  - motif `default` de « Cible ≤ 7 % » et son commentaire : « antécédent CV » → « maladie cardiovasculaire
    établie » ;
  - prose de `cadrage` (§ ancienneté du diabète) et de l'`argumentaire` court (dans le YAML, pas
    l'exhaustif) : « antécédent cardiovasculaire »/« antécédent CV » → « maladie cardiovasculaire établie »,
    pour rester cohérent avec le nom du critère renommé.
- **`argumentaire_exhaustif` (`cible-glycemique.argumentaire.md`) : NON modifié.** Relu en entier (§« Ce que
  montrent les essais », §« Recommandation officielle vs position critique », §« Périmètre »). Il emploie
  déjà la nuance stricte : « Un antécédent cardiovasculaire **établi** ouvre à lui seul la cible ≤ 8 % »
  (§Périmètre, point 1), et la table `reco_officielle` cite « Antécédent CV non évolué ≤ 7 % · évolué
  → ≤ 8 % ». Aucune phrase ne parle d'« antécédent » au sens large d'une façon qui contredirait la lecture
  stricte — conforme à ce que S14 anticipait (« la référence SFD réserve déjà le relâchement à la maladie
  cardiovasculaire évoluée/établie »). Pas de changement de fond nécessaire.
- **`meta.version`** : `2.17` → `2.18`. **`changelog`** : nouvelle entrée datée 2026-08-07, détaillée
  (décision référent, remplacements listés, blocage signalé — cf. le fichier pour le texte complet).
- Historique (header de fichier, anciennes entrées de changelog datées 2026-07/08-xx) **laissé intact** :
  ce sont des enregistrements datés, jamais réécrits rétroactivement — seules les occurrences ACTIVES
  (conditions, motifs, prose vivante) ont été renommées.

### Texte final de l'`aide` sur `ASCVD_etablie`

```
Cocher en cas de maladie cardiovasculaire athéromateuse établie (prévention secondaire) :
infarctus du myocarde, AVC ischémique ou AIT, artériopathie périphérique symptomatique, ou
revascularisation coronaire ou périphérique. Cocher cette case assouplit la cible d'HbA1c
proposée, vers « Cible ≤ 8 % ».
```

### 2. `src/features/decision/engine/evaluateNode.cible-glycemique.test.ts`

Toutes les vignettes qui posaient `antecedent_cv: <bool>` dans leurs critères (`criteria()` helper, A-13,
A-14, A-15, A2, A-19) renommées en `ASCVD_etablie: <bool>`, **même valeur, même profil clinique visé** —
aucune assertion changée. Le commentaire et la description de A-19 (« Couverture — effet propre… ») mis à
jour pour ne plus nommer l'ancien identifiant dans le libellé du test (l'historique narratif du bloc de
commentaire au-dessus, qui date de la décision référent du 2026-07-26 sous l'ancien nom, est laissé
inchangé — c'est un enregistrement historique, pas une description de l'état courant). Une note « RENOMMÉ
le 2026-08-07 » ajoutée pour tracer le changement sans réécrire l'historique.

### 3. Snapshots régénérés (`-u`)

- `src/features/decision/engine/banc/__snapshots__/caracterisation.cible-glycemique.txt`
- `src/features/decision/engine/banc/__snapshots__/caracterisation-indetermine.cible-glycemique.txt`
- `paires.cible-glycemique.txt` : re-exécuté (`paires.test.ts`, tous nœuds), **0 mise à jour** — ce nœud
  est `ordered-first-match` (une seule carte possible par profil), donc « 0 paire » avant et après ; aucun
  impact.

## Le mécanisme de la fixture figée — à comprendre AVANT de lire le diff

`banc/fixtures/profils.cible-glycemique.json` est un jeu de 179 profils **figé** (golden master, jamais
recalculé — cf. `fixtureProfils.ts`). Il contient une colonne nommée `antecedent_cv`. Après le renommage :

- cette colonne devient **inerte** (`profilsFigesPourNoeud` ignore silencieusement toute colonne absente
  de `criteres_entree` courant — comportement documenté, pas un bug) ;
- `ASCVD_etablie` est **absente** de la fixture (jamais capturée sous ce nom) → chaque profil figé reçoit
  la **valeur par défaut générique** (`buildDefaultCriteria` : `false` pour un `bool`) — **et cette valeur
  par défaut est traitée comme DÉTERMINÉE, jamais indéterminée**, parce que `ASCVD_etablie` porte
  `presomption_non: true` (identique à `antecedent_cv` avant renommage).

Concrètement : **tout profil figé qui avait `antecedent_cv: true` se retrouve désormais avec
`ASCVD_etablie: false`.** Ce n'est pas modifié à la main dans cette session (hors périmètre — cf.
« Blocages » ci-dessous) ; c'est le comportement par construction du mécanisme de fixture figée appliqué à
un critère renommé, documenté en tête de `fixtureProfils.ts` (« un critère RETIRÉ suit le chemin inverse
sans code dédié »).

## Diff relu — vérifié par script, pas à l'œil sur 195 profils

Relire 180 + 15 profils à l'œil aurait été peu fiable. Vérification programmatique à la place : extraction
des lignes compactes (`N :: critères :: ¤::Carte@…`) du diff `vitest` avant/après, jointure par index de
profil, comparaison de la carte retenue.

### `caracterisation.cible-glycemique.txt` (180 profils complets)

- **Toutes les 180 lignes diffèrent textuellement** (renommage `antecedent_cv` → `ASCVD_etablie` présent
  dans chaque ligne, y compris quand la valeur reste `false` — donc aucun changement de sortie).
- **Vérifié par diff strict, colonne critères hors `antecedent_cv`/`ASCVD_etablie` retirée des deux côtés :
  IDENTIQUE ligne à ligne sur les 180 profils** — aucun autre champ (`age`, `anciennete_diabete_annees`,
  `esperance_vie`, `fragilite`, `comorbidite_grave`) n'a bougé. Le seul champ dont la VALEUR change est
  `antecedent_cv`/`ASCVD_etablie` lui-même, et uniquement là où il valait `true`.
- **19 profils sur 180 changent de carte retenue** (`Cible ≤ 8 %` → autre chose). Les 19, sans exception :
  `fragilite = false`, `comorbidite_grave = false`, `esperance_vie ≠ limitee`, `antecedent_cv = true`
  (donc `ASCVD_etablie = false` après le renommage) — c'est-à-dire exactement le profil « antécédent
  cardiovasculaire seul, sans aucun des trois autres critères qui ouvrent ≤ 8 % » que la tâche annonçait
  comme le changement attendu :
  - **16/19** retombent sur le repli **« Cible ≤ 7 % »** (`default`) : ils ne satisfont pas les conditions
    de « Cible ~6,5 % » (`age < 70 AND anciennete_diabete_annees < 5 AND esperance_vie == longue`).
  - **3/19** (profils #86, #147, #152) remontent à **« Cible ~6,5 % (6,5–7 %) »** : ces trois profils
    satisfont en plus `age < 70`, `anciennete_diabete_annees < 5` et `esperance_vie == longue` — la
    disparition du seul frein qui les en empêchait (l'ancien `antecedent_cv == true`, qui excluait
    explicitement cette carte) les laisse remonter à la cible la plus stricte, cohérent avec la logique du
    nœud (un patient jeune, diabète récent, espérance de vie longue, et qui n'a — sous la lecture stricte —
    plus de maladie cardiovasculaire établie, redevient éligible à la cible ~6,5 %).
  - **Aucune autre carte concernée** (jamais de bascule vers « Cible < 9 % », qui reste gouvernée par
    `esperance_vie == limitee` seule ou combinée, jamais par ce critère).
  - Le libellé de contre-indication (« Antécédent cardiovasculaire établi » → « Maladie cardiovasculaire
    établie ») et son statut (« levee ») ont été vérifiés sur les 5 profils qui l'affichent (#0, #6, #8,
    #46, #90, tous « Cible ~6,5 % ») : renommage cosmétique correct, statut inchangé (`ASCVD_etablie ==
    false` → contre-indication toujours levée, comme `antecedent_cv == false` avant).

### `caracterisation-indetermine.cible-glycemique.txt` (15 profils, dont 1 vierge)

- 11/15 profils : renommage cosmétique seul (label + éventuellement valeur `false`→`false` sans
  changement), aucune sortie modifiée.
- **4/15 profils changent de sortie** (#11, #12, #13, #14) — tous avaient `antecedent_cv: true` **et**
  étaient marqués « masqué » (simulateur d'indétermination) pour ce critère. Explication précise, vérifiée
  disjonct par disjonct :
  - `ASCVD_etablie`/`antecedent_cv` porte `presomption_non: true` : un critère « masqué » (simulé non
    répondu) reste **déterminé** pour ce critère précis (jamais indéterminé), avec la valeur réellement
    stockée dans la fixture — c'est le mécanisme normal de `presomption_non`, pas un artefact de ce test.
    Avant renommage, cette valeur stockée était `true` (déterminée) ; après, `false` (déterminée aussi,
    mais par défaut faute de colonne).
  - Avant : `antecedent_cv == true` étant DÉTERMINÉ-vrai, il suffisait seul à rendre vraie la disjonction
    `fragilite == true OR comorbidite_grave == true OR esperance_vie == limitee OR antecedent_cv == true`
    (logique ternaire standard : un OR avec un opérande déterminé-vrai est vrai, même si d'autres opérandes
    — `esperance_vie`, `fragilite` — sont eux authentiquement indéterminés dans le profil). D'où « Cible
    ≤ 8 % » **résolue**, alors même que le formulaire montrait `esperance_vie`/`fragilite` comme masqués.
  - Après : `ASCVD_etablie == false` étant déterminé-faux, la disjonction dépend maintenant réellement des
    autres opérandes. Profils #11, #12, #14 : au moins un opérande pertinent (`esperance_vie` ou
    `fragilite`) est authentiquement indéterminé → la carte passe correctement en **« en attente »**
    (`à renseigner : esperance_vie` ou `fragilite`) plutôt que d'être injustement résolue — un
    comportement **plus sûr**, pas un défaut (le moteur n'affirme plus une conclusion sur la base d'un
    critère qu'il ne connaît pas réellement). Profil #13 : tous les opérandes de la disjonction sont en
    fait déterminés (fragilite/comorbidite_grave/esperance_vie tous à `false`/`≠limitee`) → « Cible ≤ 8 % »
    devient déterminée-FAUSSE (pas indéterminée), et le nœud retombe sur le repli « Cible ≤ 7 % »
    (`default`) — exactement le même mécanisme que les 16 profils « repli » du fichier précédent.
  - **Aucun autre mécanisme en jeu** : vérifié qu'aucun autre champ ne diffère entre ancien et nouveau pour
    ces 4 profils.

**Verdict global : 23 profils changent de sortie sur 195 (19 + 4), et les 23 s'expliquent intégralement et
sans exception par le même mécanisme unique — le défaut de colonne de la fixture figée pour le critère
renommé, combiné à `presomption_non: true` (déterminé par défaut, jamais indéterminé) et à la logique
ternaire standard des `OR`. Aucun changement non expliqué observé. Pas de STOP.**

## N0

- `npm run typecheck` → **vert** (`tsc -b --noEmit`, sortie vide).
- `npm run build` → **vert** (`tsc -b && vite build`, build produit, seul avertissement = taille de chunk,
  préexistant et sans rapport).
- `npx vitest run src/features/decision/engine/evaluateNode.cible-glycemique.test.ts` → **vert**, 19/19
  tests passés, **aucune assertion changée** (confirme que le renommage des vignettes manuelles préserve
  exactement les mêmes verdicts cliniques qu'avant, puisque chaque vignette pose la même valeur booléenne
  sous le nouveau nom).
- `npx vitest run src/features/decision/engine/banc/coherence-inter-noeuds.test.ts` → **vert**, 42/42 tests
  passés (I19/I32 — dénommés « S7 »/« S8 » dans ce fichier — confirment l'encodage identique
  d'`ASCVD_etablie` sur `cible-glycemique`/`prescription`/`statine`).
- Snapshots régénérés (`caracterisation*.cible-glycemique.txt`, `-u`) → tests repassés **verts** après
  régénération ; diff relu intégralement (voir section précédente).
- `paires.test.ts` (tous nœuds) → **vert**, 8/8, 0 snapshot mis à jour.
- Vérifications supplémentaires (non exigées par le mandat, faites par prudence) :
  - `npx vitest run src/features/decision/engine/banc/invariants.test.ts src/features/decision/engine/banc/invariants-contenu.test.ts src/features/decision/engine/banc/discernabilite.test.ts src/features/decision/engine/banc/couverture.test.ts -t "cible-glycemique"`
    → **vert**, 21/21 (124 autres tests skippés = tests d'autres nœuds, filtre `-t` fonctionne).
  - `npx vitest run src/features/decision/lib/esperanceVieDefault.test.ts src/features/decision/screens/DecisionNodeScreen.esperanceVie.test.tsx src/features/decision/screens/DecisionNodeScreen.reentree.test.tsx`
    → **vert**, 21/21 — mais ce vert est **trompeur**, voir « Blocages » ci-dessous : ces tests posent
    eux-mêmes `antecedent_cv` en dur dans leurs propres fixtures (boîte blanche), donc ils ne peuvent pas
    détecter la régression d'intégration réelle.

## Blocages / signalements — NON corrigés dans cette session (hors périmètre YAML)

**Trouvé, signalé, volontairement pas touché :**

`src/features/decision/lib/esperanceVieDefault.ts` lit le nom de critère **en dur** :

```ts
const antecedentCv = Boolean(criteria.antecedent_cv)          // l.22
export const ESPERANCE_VIE_DRIVERS = ['age', 'fragilite', 'comorbidite_grave', 'antecedent_cv'] as const  // l.40
```

C'est le seul endroit du dépôt (hors contenu YAML) où `antecedent_cv` est un identifiant de CODE, pas de la
prose. Après ce renommage, dans le flux réel de l'application, la clé `antecedent_cv` n'existe plus sur
les critères du nœud `cible-glycemique` — `criteria.antecedent_cv` y sera systématiquement `undefined`
(→ `Boolean(undefined) = false`). Conséquence : l'heuristique `suggestEsperanceVie` (auto-suggestion
d'`esperance_vie` à partir de `age`/`fragilite`/`comorbidite_grave`/`antecedent_cv`) **perd silencieusement
un de ses quatre facteurs** — elle continuera de fonctionner, mais toujours comme si le patient n'avait
jamais de maladie cardiovasculaire établie, quelle que soit la réponse réelle cochée à l'écran. Les tests
dédiés (`esperanceVieDefault.test.ts`, `DecisionNodeScreen.esperanceVie.test.tsx`,
`DecisionNodeScreen.reentree.test.tsx`) restent **verts** après ce renommage (vérifié en les exécutant) —
mais uniquement parce qu'ils construisent leurs propres objets `Criteria` de test avec la clé
`antecedent_cv` posée à la main, en boîte blanche ; ils ne passent jamais par le contenu réel du nœud et ne
peuvent donc pas voir la rupture d'intégration. **Aucune régression sur les cartes de décision elles-mêmes**
(le moteur `evaluateNode` ne connaît que le contenu YAML, pas ce fichier) — l'impact se limite à la
suggestion d'`esperance_vie` pré-remplie à l'écran.

`src/features/decision/lib/labels.ts` : **rien à corriger**. `ASCVD_etablie` y a déjà un libellé
(`'Maladie cardiovasculaire athéromateuse établie'`, l. 113, posé pour `prescription`/`statine`) — il
s'applique automatiquement à `cible-glycemique` maintenant qu'il porte le même nom. L'entrée
`antecedent_cv` (l. 126) devient orpheline (plus référencée par aucun contenu) mais ne casse rien.

**Recommandation** : une session future, courte, doit renommer `criteria.antecedent_cv` →
`criteria.ASCVD_etablie` et `'antecedent_cv'` → `'ASCVD_etablie'` dans `ESPERANCE_VIE_DRIVERS`
(`esperanceVieDefault.ts` l. 22 et 40), puis relancer les trois fichiers de test cités (qui devront eux
aussi être mis à jour, en boîte blanche, sur le même modèle que ce qui a été fait ici pour
`evaluateNode.cible-glycemique.test.ts`). Non fait ici : hors périmètre explicite de cette session
(« ne touche que `cible-glycemique.yaml` »), et une modification de code (pas de contenu) mérite sa propre
relecture.

**Autres occurrences d'`antecedent_cv` dans le dépôt** (grep exhaustif, hors `cible-glycemique.yaml` et son
fichier de test, déjà traités) — toutes en PROSE/DOCUMENTATION, aucune en code actif ni en contenu clinique
d'un autre nœud :

- `docs/decision/CONSTRUIRE-UN-MODULE.md`, `docs/decision/noeuds/A-cible-glycemique.md`,
  `docs/decision/noeuds/A-cible-glycemique.verification-p2.md`, `docs/decision/noeuds/F-statine.md` — dossiers
  de preuve et documentation historique, hors périmètre (ne décrivent pas le contenu YAML actuel, racontent
  la genèse du critère — y compris la remarque de F-statine.md qui documentait déjà la distinction
  `antecedent_cv`/`ASCVD_etablie`, désormais résorbée par cette décision).
- `docs/decision/validation/criteres-communs-2026-08-06.md`, `table-conditions-2026-08-06.md`,
  `chantier-2026-07-27/verif-finale-transverse.md`, `chantier-2026-07-26/ETAT-DES-LIEUX.md`,
  `chantier-2026-07-26/vignettes-existantes-a-valider.md`, `recette-P9-2026-07-30.md`,
  `docs/decision/validation/inventaire.json` — documents de recette/validation DATÉS, décrivant l'état du
  contenu à un instant passé ; hors périmètre d'édition, signalés pour information seulement (aucune
  contradiction avec le nouveau contenu, ce sont des comptes-rendus historiques).
- `plans/P1/index.md`, `plans/P9/S6.md`, `plans/P10/S5.md`, `plans/P12/index.md`, `plans/P12/S1.md`,
  `plans/P12/S5.md`, `plans/P13/index.md`, `plans/P13/S5.md`, `plans/P13/S6.md`, `plans/P14/S8.md`,
  `plans/P14/index.md`, `plans/P14/S13.md`, `plans/P14/S14.md` — fichiers de PLAN (dont certains
  explicitement listés comme fichiers partagés à ne pas toucher, `plans/P14/index.md` compris) ; hors
  périmètre absolu de cette session.
- `src/features/decision/lib/labels.ts`, `src/features/decision/screens/DecisionNodeScreen.tsx` — traités
  ci-dessus (labels.ts : rien à faire ; DecisionNodeScreen.tsx : seulement des COMMENTAIRES qui nomment
  `antecedent_cv`, pas de code actif — même nature que `esperanceVieDefault.ts` mais sans lecture de
  critère par nom, juste de la doc en commentaire, donc pas un blocage fonctionnel).

Aucune autre occurrence en dehors de ces deux catégories (documentation historique / plans hors périmètre)
n'a été trouvée.

## Fichiers modifiés dans cette session

- `content/decision/noeuds/diabete-type-2/cible-glycemique.yaml`
- `src/features/decision/engine/evaluateNode.cible-glycemique.test.ts`
- `src/features/decision/engine/banc/__snapshots__/caracterisation.cible-glycemique.txt` (régénéré, `-u`)
- `src/features/decision/engine/banc/__snapshots__/caracterisation-indetermine.cible-glycemique.txt`
  (régénéré, `-u`)
- Ce fichier : `plans/P14/S17-arbitrage1-antecedent-cv.md` (créé)

**Non touchés** (conforme au mandat) : `STATUS.md`, `TASKS.md`, `plans/P14/index.md`, `VALIDATION.md`,
`content/decision/noeuds/diabete-type-2/insuline.yaml`, `content/decision/criteres-communs/diabete-type-2.yaml`
(session parallèle en cours), `prescription.yaml`, `statine.yaml`, `cible-glycemique.argumentaire.md`,
`src/features/decision/lib/esperanceVieDefault.ts`, `src/features/decision/lib/labels.ts`.

## Fin de session

Aucun commit, aucun push (`.claude/wave.lock` actif — hook de blocage respecté). N0 vert. Un blocage réel
signalé (`esperanceVieDefault.ts`), non corrigé, à traiter par une session dédiée.
