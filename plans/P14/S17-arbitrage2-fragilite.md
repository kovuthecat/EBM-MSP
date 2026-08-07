# P14 · S17-arbitrage2-fragilite — Décision référent : `fragilite` devient canal de sécurité sur `cible-glycemique` ET `insuline`

> Session ad hoc, hors numérotation du plan P14 (comme `S17-arbitrage1-antecedent-cv.md`, qui traite
> l'arbitrage 1 du même document sur le même nœud `cible-glycemique` — session distincte, déjà exécutée).
> Celle-ci exécute une décision prise EN CONVERSATION par le référent le 2026-08-07, tranchant
> l'arbitrage 2 laissé ouvert par S14 (`docs/decision/validation/criteres-communs-2026-08-06.md` §6).
> Fichier créé par consigne explicite de la conversation qui a lancé cette session — pas de commit ni de
> push (`.claude/wave.lock` actif). Aucun fichier partagé touché (`STATUS.md`, `TASKS.md`,
> `plans/P14/index.md`, `VALIDATION.md`).

- Date : 2026-08-07 · Exécutant : Claude Code (Sonnet)

## Contexte

S14 avait posé sans trancher (arbitrage 2, §6) : `fragilite` est déclarée à l'identique (`partage: true`,
`type: bool`, même absence de `presomption_non`) sur 5 nœuds DT2 — `prescription`, `insuline`,
`cible-glycemique`, `rhd-activite-physique`, `rhd-alimentation`. Elle sert de **canal de sécurité**
(alerte `niveau: attention` ou `exclusions`) sur 3 de ces 5 : `prescription` (alerte incrétine +
dénutrition, `:1382`/`:1451`/`:2646`, exclusion sulfamide `:2430`), `rhd-activite-physique` (alerte
`:549`), `rhd-alimentation` (exclusions `:392`/`:546`). Sur `insuline` et `cible-glycemique`, elle n'était
lue que par des dérivés/`conditions` consommés par des options `role: geste` — jamais un canal explicite.

Le référent a tranché en conversation, le 2026-08-07 : **« passons en sécurité partout »** — harmoniser en
élevant `fragilite` au rang de canal de sécurité sur `insuline` ET `cible-glycemique` aussi. Mandat
explicite : ajouter un CANAL (alerte), ne pas toucher au FAIT (`fragilite` reste `partage: true`,
encodage identique sur les 5 nœuds — I19/I32 doivent rester verts) ; n'exclure aucune option sauf geste
précisément nommé et inapproprié identifié à la lecture (rien de tel trouvé, cf. § « Aucune exclusion
ajoutée » plus bas) ; ne rien inventer (CLAUDE.md invariant 6, STOP si un fait clinique manque de source
dans le nœud).

## Ce qui existait déjà et n'a PAS été touché

- **`cible-glycemique`** : `fragilite` fait déjà partie des `conditions` de « Cible ≤ 8 % »
  (`fragilite == true OR comorbidite_grave == true OR esperance_vie == limitee OR ASCVD_etablie == true`)
  et du garde négatif de « Cible ~6,5 % » (`fragilite == false`). Un patient fragile obtient donc déjà
  mécaniquement une cible assouplie — inchangé.
- **`insuline`** : `fragilite` alimente deux dérivés déjà utilisés par des options `role: geste` :
  `risque_hypoglycemique_eleve` (`fragilite OR esperance_vie == limitee OR age >= 75 OR
  risque_hypoglycemie_schema == eleve OR hypo_severe_recurrente == true`, ne gate plus aujourd'hui QUE la
  `conditions` de « Désintensifier / alléger le schéma », et seulement en situation `basal_bolus` — les
  autres usages historiques notés en commentaire dans le fichier datent d'avant la suppression, le
  2026-08-06, de « Choisir un analogue basal de 2ᵉ génération », et ne sont plus d'actualité) et
  `terrain_cible_assouplie` (`age >= 75 OR fragilite == true OR esperance_vie == limitee`, alerte
  `niveau: info` sur les cibles MCG, seulement si `mcg_disponible == true`). Les deux mécanismes restent
  inchangés.

## Ce qui a été fait

### 1. `content/decision/noeuds/diabete-type-2/cible-glycemique.yaml`

Ce nœud n'avait **aucun champ `alertes`** avant cette session. Ajout d'une section `alertes` (une seule
entrée), insérée juste après le bloc `options` et avant `cadrage` — position conforme à l'ordre observé
sur les autres nœuds du domaine (`options` → `alertes` → `cadrage`).

**Texte exact de l'alerte ajoutée** (`quand: "fragilite == true"`, `niveau: attention`) :

> Fragilité déclarée : elle a mécaniquement assoupli la cible d'HbA1c affichée — au moins
> « Cible ≤ 8 % », voire « Cible < 9 % » si l'espérance de vie est aussi limitée — plutôt que le repli
> par défaut à ≤ 7 %. Chez le sujet fragile, un contrôle glycémique strict n'apporte aucun bénéfice de
> mortalité démontré (1,04, non significatif) et expose à une hypoglycémie sévère multipliée par 2 à
> 2,5 (Boussageon : risque relatif 2,33 ; Turnbull/CONTROL : 2,48) : c'est ce risque de sur-traitement
> que l'assouplissement de la cible cherche à éviter.

**Pourquoi ce texte, pas une simple duplication (R6 — argumentaire situationnel).** La carte affiche déjà
le plafond retenu ; l'alerte explicite le POURQUOI clinique (sur-traitement, hypoglycémie), repris **mot
pour mot, aucun chiffre nouveau**, de deux endroits déjà présents dans ce même fichier :
- `effet_attendu` de l'option « Cible ≤ 8 % » (l. 113-120) : « la mortalité toutes causes n'est pas
  réduite (… 1,04, non significatif) … l'hypoglycémie sévère est multipliée par 2 à 2,5 (Boussageon :
  risque relatif 2,33 ; Turnbull/CONTROL : 2,48) » ;
- `avantages` de la même option (l. 109-110) : « Réduit le risque d'hypoglycémie sévère. » / « Écarte le
  sur-traitement, dont le risque dépasse ici le bénéfice attendu. »

**Pourquoi hedgé entre « ≤ 8 % » et « < 9 % ».** Logique du nœud (`ordered-first-match`, options dans
l'ordre `Cible < 9 %` → `Cible ≤ 8 %` → `Cible ~6,5 %` → repli `≤ 7 %`) : `fragilite == true` seul (sans
`esperance_vie == limitee`) atterrit sur « Cible ≤ 8 % » ; combiné à `esperance_vie == limitee`, il
atterrit sur « Cible < 9 % » (qui gagne car premier dans l'ordre). Une alerte de nœud ne voit jamais ce
que le moteur a retenu (rappel de `GRAMMAIRE-NOEUD.md`, note sur les alertes d'option) : dans les DEUX
cas, la cible est **au moins** assouplie à ≤ 8 % — l'affirmation est donc vraie sans exception, jamais en
porte-à-faux avec la carte réellement affichée.

**Pourquoi `quand: "fragilite == true"` seul.** C'est exactement le fait que l'arbitrage demande d'élever.
`comorbidite_grave`, `esperance_vie == limitee` et `ASCVD_etablie`, les trois autres branches du même OR,
restent silencieuses — hors mandat explicite de cette session (portée strictement à `fragilite`).

**`meta.version`** : `2.18` → `2.19`. **`changelog`** : nouvelle entrée en tête, datée 2026-08-07, décrite
comme décision référent (arbitrage 2 de S14), détaillant le mécanisme et l'absence de chiffre nouveau.

### 2. `content/decision/noeuds/diabete-type-2/insuline.yaml`

Insertion d'une nouvelle alerte de nœud dans la section `alertes` **existante**, juste après l'alerte
`hypo_severe_recurrente == true` (même registre, signal voisin) et avant l'alerte sulfamide/glinide.

**Texte exact de l'alerte ajoutée** (`quand: "fragilite == true"`, `niveau: attention`) :

> Sujet fragile sous insulinothérapie : risque hypoglycémique majoré, quel que soit le schéma en cours
> et la situation clinique. Préférer un analogue basal de 2ᵉ génération (glargine U300 ou dégludec) à
> glargine U100, détémir ou NPH, titrer prudemment, et réévaluer la perception des hypoglycémies — même
> conduite que devant un antécédent d'hypoglycémie sévère récurrente (ci-dessus). En basal-bolus, ce
> terrain ouvre aussi l'allègement du schéma (« Désintensifier / alléger le schéma ») ; si une mesure
> continue du glucose est en place, il applique déjà des cibles de temps dans la cible assouplies
> (alerte ci-dessous).

**Rien d'inventé — chaque clause a une source déjà présente dans ce fichier :**
- « préférer un analogue basal de 2ᵉ génération … » : recopié (reformulé, pas de chiffre changé) du
  dernier item de `posologie_detail` de l'option « Initier une insuline basale » (l. 936) — « Choix de la
  MOLÉCULE, piloté par le risque hypoglycémique — fragilité, espérance de vie limitée, âge ≥ 75 ans,
  schéma à risque hypoglycémique élevé, ou antécédent d'hypoglycémie sévère récurrente : préférer un
  analogue basal de 2ᵉ génération (glargine U300 ou dégludec) à glargine U100, détémir, a fortiori à la
  NPH (SFD 2025, Avis 18 bis). » — `fragilité` y est nommée explicitement, texte déjà validé ;
- « titrer prudemment … réévaluer la perception des hypoglycémies » : repris de l'alerte
  `hypo_severe_recurrente` voisine ;
- « ce terrain ouvre aussi l'allègement du schéma (« Désintensifier / alléger le schéma ») » : mécanisme
  déjà existant, `risque_hypoglycemique_eleve` (qui inclut `fragilite`) gate cette `conditions`, en
  situation `basal_bolus` (l. 1698) ;
- « des cibles de temps dans la cible assouplies » : mécanisme déjà existant, alerte `niveau: info`
  `terrain_cible_assouplie == true` (qui inclut `fragilite`), l. 2022-2027.

**Choix : `fragilite == true` seul, PAS `risque_hypoglycemique_eleve` ni `terrain_cible_assouplie` —
justification.** Les deux dérivés ont été considérés et écartés :
- `risque_hypoglycemique_eleve` agrège aussi `age >= 75`, `esperance_vie == limitee`,
  `risque_hypoglycemie_schema == eleve` et `hypo_severe_recurrente == true`. L'utiliser aurait (a) dilué
  le signal fragilité précis que l'arbitrage demande d'élever dans quatre autres faits, et (b) fait
  doublonner cette nouvelle alerte avec l'alerte `hypo_severe_recurrente` juste au-dessus — puisque
  `hypo_severe_recurrente` est l'un des OR de ce même dérivé, un patient qui la déclare aurait reçu DEUX
  alertes quasi identiques côte à côte pour un seul fait cité deux fois sous deux formes.
- `terrain_cible_assouplie` sert un objet différent (repère de cible MCG, `niveau: info`, cadrage — pas un
  signal de vigilance clinique `niveau: attention`) et n'est de toute façon actif que si
  `mcg_disponible == true`, ce qui aurait laissé sans aucun signal un patient fragile sans capteur.
- `fragilite == true` seul isole exactement le fait visé, sur le même principe que les 4 alertes
  `fragilite` déjà existantes de `prescription.yaml` (toutes conditionnées sur `fragilite == true` seul,
  jamais sur un dérivé agrégé) — cohérence de registre entre nœuds du même domaine.

**Effet secondaire positif, non recherché mais vérifié.** Avant cette session, `fragilite` sur `insuline`
n'avait un effet visible QUE via `risque_hypoglycemique_eleve`, lui-même limité à la seule situation
`basal_bolus` (`Désintensifier / alléger le schéma`) — pour un patient fragile en situation `naif`,
`basale_seule` ou `basale_plus_bolus`, sans mesure continue du glucose, `fragilite` n'avait strictement
AUCUN effet visible à l'écran. L'invariant I14 du banc (`invariants-contenu.test.ts`, cf. § N0) avait
d'ailleurs déjà attrapé ce trou et posé la question au référent en commentaire — cf. § suivant. La nouvelle
alerte, sans garde de situation (même principe que `hypo_severe_recurrente`), corrige ce trou pour les
trois situations où `fragilite` était jusqu'ici invisible.

**`meta.version`** : `0.57` → `0.58`. **`changelog`** : nouvelle entrée en tête, datée 2026-08-07, décrite
comme décision référent (arbitrage 2 de S14), détaillant le mécanisme, le choix de `fragilite == true`
seul et l'absence de chiffre nouveau.

### 3. `src/features/decision/engine/banc/invariants-contenu.test.ts` — invariant I14, dette résorbée

L'ajout de l'alerte sur `insuline` fait échouer I14 (« un drapeau qui n'agit qu'à travers un `derive` n'a
pas de voix propre ») : ce test maintient un registre `DRAPEAUX_SANS_VOIX_PROPRE_CONNUS` qui listait déjà
`insuline.fragilite`, avec un commentaire écrit AVANT cette session posant très exactement la question que
le référent vient de trancher :

> « Trouvé PAR CET INVARIANT, hors recette. `fragilite` n'agit qu'à travers le dérivé de cible assouplie.
> QUESTION AU RÉFÉRENT : l'écran doit-il DIRE que la cible est assouplie PARCE QUE le patient est fragile ?
> Le nœud `prescription`, lui, porte bien une alerte sur ce terrain. »

Puisque `fragilite` a désormais une citation hors `derive` (le `quand` de la nouvelle alerte), elle a une
« voix propre » — l'entrée devient fausse dans le registre et doit disparaître, comme pour les deux entrées
précédentes de ce même registre (`rhd-activite-physique`, `rhd-alimentation`), résorbées par des sessions
antérieures sur le même modèle. Entrée `insuline: { fragilite: … }` retirée, remplacée par un commentaire
« DETTE RÉSORBÉE » narrant la résolution (même format que les deux résorptions précédentes dans ce fichier)
et précisant pourquoi `cible-glycemique` n'apparaissait jamais dans cette dette (elle citait déjà
`fragilite` directement dans des `conditions`, pas seulement via un `derive`).

**Seul fichier de test modifié dans cette session** — modification strictement nécessitée par le contenu
ajouté (le test échouait sinon), pas une extension de périmètre.

## Aucune exclusion ajoutée

Ni `cible-glycemique` ni `insuline` n'ont reçu de nouvelle `exclusions`. Lecture attentive des deux nœuds :
aucun geste PRÉCIS et NOMMÉ n'apparaît comme cliniquement inapproprié chez un patient fragile sans déjà
être couvert par un mécanisme existant :
- sur `cible-glycemique`, il n'y a qu'un choix de cible, pas un geste thérapeutique — rien à exclure ;
- sur `insuline`, la fragilité oriente déjà (choix de molécule à l'initiation, allègement en basal-bolus,
  cibles MCG) sans qu'aucune option ne prescrive un geste identifiable comme dangereux chez le sujet
  fragile en tant que tel (contrairement à `prescription`, où le sulfamide — hypoglycémiant par
  construction — est explicitement exclu sur `fragilite == true`, l. 2430 ; ce nœud-ci ne propose pas de
  sulfamide, il gère l'insuline elle-même, dont l'indication chez un patient fragile n'est pas en soi
  contre-indiquée, seulement à surveiller et à modérer).

Conformément au mandat (« en cas d'hésitation → n'exclus pas, alerte seulement, signale pour arbitrage
ultérieur ») : aucune hésitation méritant signalement n'a été rencontrée — le mandat premier (alerte,
visibilité) suffit intégralement ici, rien n'a semblé nécessiter une exclusion à la limite.

## Diff des snapshots régénérés — relu intégralement, par script, pas à l'œil

`caracterisation.{cible-glycemique,insuline}.txt` et `caracterisation-indetermine.{cible-glycemique,
insuline}.txt` régénérés (`vitest run … caracterisation.test.ts -u`). Relire des centaines de profils à
l'œil est peu fiable (cf. le précédent de S17-arbitrage1) : vérification programmatique à la place — un
script Node retire, de chaque fichier régénéré, EXACTEMENT le texte de la nouvelle alerte (gestion propre
des séparateurs `|` de la liste compacte, item en tête / au milieu / en fin de liste), puis compare
octet à octet au fichier AVANT régénération (sauvegardé avant le `-u`).

**Résultat, sur les 4 fichiers : IDENTIQUE OCTET À OCTET après retrait du seul texte de la nouvelle
alerte.** Aucune carte n'apparaît ni ne disparaît, aucun rang ne change, aucune autre alerte n'est
modifiée, aucun motif d'écartement ne change — le seul delta, sur l'intégralité des 180 + 15 profils
de `cible-glycemique` et des ~450 + profils de `insuline` (détaillés + compacts), est l'apparition de la
nouvelle alerte exactement sur les profils `fragilite == true`. Aucun STOP.

`paires.{cible-glycemique,insuline}.txt` : comparés avant/après le `-u` (ces fichiers n'ont d'ailleurs
PAS été touchés par la régénération, 0 mise à jour rapportée par `vitest`) — **strictement identiques**,
cohérent avec le fait que `paires.test.ts` compare des sélections d'options entre profils voisins, jamais
les alertes.

## N0

- `npm run typecheck` → **vert** (`tsc -b --noEmit`, sortie vide).
- `npm run build` → **vert** (build produit ; seul avertissement = taille de chunk, préexistant, sans
  rapport).
- `npx vitest run src/features/decision/engine/banc/coherence-inter-noeuds.test.ts` → **vert**, 42/42 —
  I19/I32 confirment `fragilite` toujours encodée à l'identique sur les 5 nœuds (définition non touchée).
- `npx vitest run src/features/decision/engine/banc/invariants-contenu.test.ts` → **vert**, 66 passés | 1
  échec attendu (`it.fails` préexistant, S16, sans rapport avec cette session) sur 67 — nécessitait la
  résorption de la dette I14 documentée ci-dessus (sinon rouge, cf. § 3).
- `npx vitest run … evaluateNode.cible-glycemique.test.ts … evaluateNode.insuline.test.ts … paires.test.ts
  … caracterisation.test.ts` → **vert**, 64/64.
- `npx vitest run` (suite complète) → **vert**, 64 fichiers passés | 1 skippé (65) ; 1255 tests passés | 1
  échec attendu | 11 skippés (1267) — aucune régression ailleurs dans le dépôt.
- Snapshots régénérés (`-u`) → diff relu intégralement et vérifié par script (§ précédente), verdict :
  seule la nouvelle alerte apparaît, rien d'autre.

## N1 — à vérifier par un humain (pas de navigateur utilisé)

- Sur l'écran « Déterminer la cible d'HbA1c » : cocher `fragilite`, vérifier que l'alerte « Fragilité
  déclarée : … » s'affiche au niveau visuel `attention` (couleur/icône distincte du `niveau: info`), et
  qu'elle reste cohérente avec la carte réellement affichée (« Cible ≤ 8 % » ou « Cible < 9 % » selon les
  autres critères).
- Sur l'écran « Initier ou optimiser une insulinothérapie », dans chacune des 4 situations
  (`naif`/`basale_seule`/`basale_plus_bolus`/`basal_bolus`) : cocher `fragilite`, vérifier que l'alerte
  « Sujet fragile sous insulinothérapie : … » s'affiche au niveau `attention`, à un rang cohérent parmi
  les autres alertes du nœud (juste après l'alerte antécédent d'hypoglycémie sévère si les deux sont
  actives), et qu'elle ne masque ni ne contredit aucune carte.
- Vérifier l'absence de régression visuelle sur un profil fragile qui déclenche PLUSIEURS alertes à la
  fois (ex. `fragilite == true` + `hypo_severe_recurrente == true` sur `insuline`) : les deux alertes
  doivent s'afficher l'une après l'autre, sans doublon visuel ni texte tronqué.

## Fichiers modifiés dans cette session

- `content/decision/noeuds/diabete-type-2/cible-glycemique.yaml` (ajout `alertes`, version 2.18 → 2.19,
  changelog)
- `content/decision/noeuds/diabete-type-2/insuline.yaml` (nouvelle alerte dans `alertes` existant, version
  0.57 → 0.58, changelog)
- `src/features/decision/engine/banc/invariants-contenu.test.ts` (résorption de la dette I14
  `insuline.fragilite`, seule modification nécessitée par le contenu ajouté)
- `src/features/decision/engine/banc/__snapshots__/caracterisation.cible-glycemique.txt` (régénéré, `-u`)
- `src/features/decision/engine/banc/__snapshots__/caracterisation-indetermine.cible-glycemique.txt`
  (régénéré, `-u`)
- `src/features/decision/engine/banc/__snapshots__/caracterisation.insuline.txt` (régénéré, `-u`)
- `src/features/decision/engine/banc/__snapshots__/caracterisation-indetermine.insuline.txt` (régénéré,
  `-u`)
- Ce fichier : `plans/P14/S17-arbitrage2-fragilite.md` (créé)

**Non touchés** (conforme au mandat) : `STATUS.md`, `TASKS.md`, `plans/P14/index.md`, `VALIDATION.md`,
`prescription.yaml`, `rhd-activite-physique.yaml`, `rhd-alimentation.yaml` (les 3 nœuds où `fragilite`
sert déjà de canal, hors mandat), la déclaration de `fragilite` elle-même sur les 5 nœuds (fait inchangé,
seul le canal a été ajouté), `paires.*.txt` (non affectés, vérifié § précédente).

## Fin de session

Aucun commit, aucun push (`.claude/wave.lock` actif — hook de blocage respecté). N0 vert dans son
intégralité, y compris la suite complète du dépôt. Aucun STOP rencontré : chaque clause des deux nouvelles
alertes est sourcée par du texte déjà présent et validé dans le nœud concerné, aucun chiffre ni conduite
inventés. Aucune exclusion ajoutée (mandat premier — alerte — jugé suffisant après lecture, sans hésitation
méritant signalement). Un seul fichier de test touché, strictement nécessité par le contenu ajouté
(résorption de la dette I14 sur `insuline.fragilite`, qui posait déjà exactement la question tranchée
aujourd'hui).
