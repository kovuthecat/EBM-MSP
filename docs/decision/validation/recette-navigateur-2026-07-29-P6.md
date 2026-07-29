# Recette navigateur — shell UI P6 (T-043), 2026-07-29

**Cette version remplace deux tentatives précédentes, toutes deux interrompues par une panne
d'outillage** (le panneau navigateur ne compositait plus les frames, `screenshot` échouait
systématiquement sur onglets neufs, protocole de relance suivi à la lettre les deux fois — aucun
verdict n'avait été inventé). Cette troisième passe a été exécutée **directement dans la session
principale** plutôt que dans un sous-agent, sur le même onglet où la deuxième tentative avait échoué :
la capture d'écran y fonctionnait normalement, ce qui confirme que la panne était locale aux sessions
de sous-agent et non à l'environnement. Tous les points ont été reproduits à l'écran, aucun n'a été
déduit du DOM seul sans capture.

**Cible** : build LOCAL (`npm run dev`, Vite), **jamais** `https://ebm-msp.vercel.app` — le code du
shell UI (accordéon + colonne sticky, badge verbe d'action, contre-indications repliées) n'est pas
encore poussé.

**Serveur** : `ebm-msp-dev` (`.claude/launch.json`), port réel **5174** (5173 occupé). Aucune erreur de
build. **Console lue en fin de passe sur les 6 nœuds visités : aucune erreur, aucun warning applicatif**
— uniquement les logs HMR de Vite.

---

## Tableau de synthèse

| # | Point | Verdict |
|---|---|---|
| 1 | Shell (2 colonnes desktop + sticky + accordéon + chips) — 6 nœuds vierges | **CONFORME** |
| 1b | Rupture <960px et mobile 375px (1 colonne + bouton flottant) | **CONFORME** |
| 1c | Bouton flottant « Voir les recommandations » recouvre le bouton « Suivant » de l'accordéon (mobile) | **DÉFAUT mineur** |
| 2 | Badge verbe d'action sur `Traiter` (bordure gauche colorée, verbe « Ajouter ») | **CONFORME** |
| 2b | Carte sans verbe (« Metformine … instaurer ou poursuivre ») — pas de couleur inventée | **CONFORME** |
| 2c | Absence de badge verbe sur `statine` (nœud hors périmètre du badge) | **CONFORME** (visuel, non vérifié en CSS) |
| 2d | Badge verbe sur `Insulinothérapie` | **CONFORME** — vérifié le 2026-07-29 sur un profil réel (« Ajouter un bolus » → vert, 4px ; « Corriger l'hypoglycémie » sans champ `action` → défaut, aucune couleur inventée) |
| **3** | **Test des 20 secondes — contre-indications repliées (`statine`, prévention secondaire)** | **DÉFAUT grave** — voir détail |
| 4 | Colonne sticky sur nœud à un seul gagnant (`statine`) — proportions, pas d'habillage « en choisir un » | **CONFORME** |
| 4b | Rejeu du profil de sécurité D32 (`statine` : CV établie oui / intolérance avérée / statine en place non renseignée) | **CONFORME** |
| 5 | Groupement `Insulinothérapie` — 6 chips, ordre clinique | **CONFORME** |
| 5b | Pas de débordement horizontal mobile sur les chips d'`Insulinothérapie` | **CONFORME** |
| 6a | Erreurs console | **CONFORME** (aucune) |
| 6b | Débordement horizontal mobile, toutes tailles | **CONFORME** (aucun, `scrollWidth === clientWidth` vérifié) |

---

## Détail des points

---

**Point : 1 — Shell deux colonnes + sticky + accordéon, sur les 6 nœuds vierges**

| champ | contenu |
|---|---|
| **Verdict** | CONFORME |
| **Reproduction** | Les 6 nœuds ouverts un à un, formulaire vierge, desktop 1280×800 (`resize_window` native) : `Traiter`, `Prescrire une statine`, `Fixer la cible d'HbA1c`, `Insulinothérapie`, `Règles hygiéno-diététiques → Alimentation`, `→ Activité physique` |
| **Observé** | Sur chacun : formulaire à gauche en accordéon (une seule section ouverte à la fois, vérifié par lecture du DOM — les autres sections affichent un résumé `label : valeur` ou « Aucun champ renseigné »), colonne de résultats à droite. Chips de navigation en tête, dont la somme des compteurs égale exactement le nombre annoncé dans le bandeau « Reco provisoire — N critères décisifs non confirmés » à chaque fois : `Traiter` 1+4+3+5+1=14 ; `Insulinothérapie` 1+4+2+6+3+2=18 ; `Alimentation` 1+7+4+1+3=16 ; `Activité physique` 1+5+2+1=9 ; `Fixer la cible d'HbA1c` et `statine` : pas de chips (nœuds à une seule section), sticky column directe. Colonne sticky confirmée en CSS : `.decision-node__results-col { position: sticky; top: 72px }` |
| **Pourquoi ça compte** | C'est le socle visuel du plan P6 ; une régression ici aurait invalidé tout le reste. |

---

**Point : 1b — Rupture <960px et mobile 375px**

| champ | contenu |
|---|---|
| **Verdict** | CONFORME |
| **Reproduction** | `resize_window` à 900×800 sur `Fixer la cible d'HbA1c`, puis preset mobile (375×812) sur `Insulinothérapie` |
| **Observé** | À 900px : bascule en une colonne, formulaire en pleine largeur, la colonne de résultats passe **en flux sous le formulaire** (n'est plus sticky), et un bouton flottant **« Voir les recommandations (0) ↓ »** apparaît en bas de l'écran. À 375px : même comportement, chips empilées une par ligne pleine largeur, aucune troncature. `document.documentElement.scrollWidth === clientWidth === 375` sur `Insulinothérapie` (vérifié par `javascript_tool`) |
| **Pourquoi ça compte** | Un médecin en visite lit sur téléphone ; c'est le point d'usage le plus contraint. |

---

**Point : 1c — Le bouton flottant recouvre le bouton « Suivant » de l'accordéon (mobile)**

| champ | contenu |
|---|---|
| **Verdict** | DÉFAUT mineur |
| **Reproduction** | `Insulinothérapie`, mobile 375×812, section « Situation d'insulinothérapie » ouverte (vierge), faire défiler jusqu'au bouton « Suivant : Profil et objectif glycémique → » en bas de la section |
| **Observé** | `getBoundingClientRect()` : bouton « Suivant » = `top 709 / bottom 757` (hauteur 48px) ; bouton flottant « Voir les recommandations (0) ↓ » = `top 724 / bottom 796`. Les deux se recouvrent sur 33 des 48px de hauteur du bouton « Suivant » (≈ 69 %). Vérifié par `document.elementFromPoint(200, 740)` → renvoie le bouton flottant, pas « Suivant » : **cette zone est réellement inatteignable au clic**, seule une fine bande en haut du bouton (`elementFromPoint(200, 712)` → « Suivant ») reste cliquable |
| **Pourquoi ça compte** | Ce n'est présent que sur les nœuds à accordéon multi-sections (`Traiter`, `Insulinothérapie`, RHD) puisque `Fixer la cible`/`statine` n'ont pas de bouton « Suivant » de section. Un praticien qui tape en bas d'écran pour avancer à la section suivante risque de déclencher le CTA flottant à la place — sans conséquence destructive (pas de perte de saisie), mais un geste naturel de navigation est majoritairement bloqué. |

---

**Point : 2 — Badge verbe d'action sur `Traiter`**

| champ | contenu |
|---|---|
| **Verdict** | CONFORME |
| **Reproduction** | `Traiter`, intention **Intensifier**, Metformine cochée, HbA1c actuelle **8,5**, « Au-dessus de l'objectif », DFG **80**, Albuminurie **Normoalbuminurie**, IMC **33**, section Signaux d'alerte confirmée par « Rien à signaler » |
| **Observé** | Via `javascript_tool` sur `.option-card` : « Introduire un AR GLP‑1 », « Introduire un iSGLT2 », « Introduire le tirzépatide », « Gliptine (sitagliptine) » portent tous la classe `option-card--action-ajouter`, `border-left-color: oklch(0.55 0.15 145)` (vert), `border-left-width: 4px`. Visuellement confirmé par capture d'écran (bordure verte nette sur la carte AR GLP-1) |
| **Pourquoi ça compte** | Permet un repérage visuel immédiat du type de geste (ajouter/arrêter/réduire) sans lire le texte. |

---

**Point : 2b — Carte sans verbe : pas de couleur inventée**

| champ | contenu |
|---|---|
| **Verdict** | CONFORME |
| **Reproduction** | Même profil que ci-dessus, carte « Metformine (socle du traitement) — instaurer ou poursuivre » |
| **Observé** | Classe `option-card option-card--primary`, sans suffixe `--action-*`. `border-left-color: oklch(0.46 0.09 254)` (bleu accent, le même que le style de sélection des boutons segmentés ailleurs dans l'app), `border-left-width: 1px` (pas 4px) — traitement visuellement distinct des cartes à verbe, cohérent avec la règle « Maintenir reprend la couleur accent existante » |
| **Pourquoi ça compte** | Vérifie qu'aucune teinte n'est attribuée par défaut à un verbe absent. |

---

**Point : 2c — Absence de badge verbe sur `statine`**

| champ | contenu |
|---|---|
| **Verdict** | CONFORME (observation visuelle seulement) |
| **Reproduction** | `statine`, carte « Statine de haute intensité — prévention secondaire », puis « Statine indisponible — alternatives hypolipémiantes » |
| **Observé** | Les deux cartes affichent une bordure fine neutre, visuellement identique aux autres cartes de l'app avant le lot P6 — aucune bordure verte/rouge/orange/violette. **Non vérifié en CSS** (le nœud a été quitté avant l'inspection JS, et y revenir remet le formulaire à zéro) |
| **Pourquoi ça compte** | Le badge ne doit exister que sur `Traiter`/`Insulinothérapie` — un verbe mal détecté ailleurs inventerait une information. |

---

**Point : 2d — Badge verbe sur `Insulinothérapie`**

| champ | contenu |
|---|---|
| **Verdict** | CONFORME (complété le 2026-07-29) |
| **Reproduction** | Profil laissé par une tentative précédente sur le même onglet, repris tel quel : situation « Basale seule », HbA1c actuelle 8,5 / cible 7, DFG 80, Poids 80, MCG disponible Oui, TBR 0, TBR sévère 0, CV 10, Profil AGP « Hypoglycémie nocturne » + « Excursions post-prandiales » |
| **Observé** | Via `javascript_tool` sur `.option-card` : « Ajouter un bolus au repas principal (basal-plus, par étapes) » → `option-card--action-ajouter`, `border-left-color: oklch(0.55 0.15 145)` (vert), `4px`. « Corriger l'hypoglycémie ou la variabilité (réduire la dose, passer en 2ᵉ génération, relâcher la cible) » → pas de classe `--action-*`, bordure par défaut 1px. Vérifié dans `content/noeuds/diabete-type-2/insuline.yaml` : cette option porte `role: securite` mais **aucun champ `action`** — c'est un geste composite (réduire OU changer de génération OU relâcher la cible), délibérément non réductible à un seul verbe, pas un oubli de contenu |
| **Pourquoi ça compte** | Confirme que le mécanisme générique fonctionne à l'identique sur les deux nœuds câblés, et qu'une carte de sécurité sans verbe univoque ne se voit pas attribuer une couleur par défaut abusive. |

---

**Point : 3 — ⚠ Test des 20 secondes, contre-indications repliées (`statine`)**

| champ | contenu |
|---|---|
| **Verdict** | **DÉFAUT grave** |
| **Reproduction** | `statine`, Âge **62**, Maladie cardiovasculaire athéromateuse établie **oui**, Dialyse confirmée **non** (« Rien à signaler »), Statine déjà en place **non** (via « Rien à signaler »), Intolérance aux statines **Non** → carte « Statine de haute intensité — prévention secondaire (maladie athéromateuse établie) » |
| **Observé** | Écran regardé 20 secondes en conditions réelles (deux `wait` de 10s), sans interaction, `<details>` fermé par défaut (vérifié : `open: false`). **Ce qui est visible sans clic** : titre, badges « Recommandée » / « Preuve élevée », la ligne « Proposé parce que : Maladie cardiovasculaire athéromateuse établie », et le lien replié « ▸ Contre-indications, effet attendu et plus ». **Rien d'autre.** Détourné puis interrogé de mémoire sur « ce que je ne dois surtout pas faire » : **strictement rien à répondre** — aucune contre-indication n'a été mémorisée, car aucune n'était affichée. En dépliant ensuite : `<details>` contient, en tout premier (« Contre-indications : ») — interaction CYP3A4 de l'atorvastatine (macrolides, azolés, amiodarone, vérapamil/diltiazem, inhibiteurs de protéase, « préférer la rosuvastatine en cas de co-prescription à risque ») et une exclusion dure (« Ne pas INITIER de statine chez un patient déjà en dialyse sans statine en cours »). Style du `<summary>` inspecté en CSS : `color: oklch(0.46 0.09 254)` (bleu accent, **identique** à un lien ordinaire), `font-weight: 600`, `font-size: 13.6px`, **aucun fond, aucune bordure, aucune icône ni couleur de vigilance** — visuellement indiscernable d'un lien de confort type « en savoir plus » |
| **Pourquoi ça compte** | C'est le point que le protocole désignait comme le plus important. **Le repli fait perdre exactement ce que T-025 (P4) avait corrigé** : à cette date, une passe de recette identique concluait « ce que je ne dois pas faire retenu quasi mot pour mot, pour la première fois sur ce projet » — précisément parce que les contre-indications étaient alors toujours visibles, dans un registre de sécurité distinct. Ici, en repliant l'information dans un `<details>` au style neutre, indissociable du reste (« effet attendu et plus »), le test reproduit fidèlement l'échec d'origine que T-025 avait éliminé. Un praticien pressé qui ouvre cette carte et voit « Recommandée » + « Preuve élevée » a toutes les raisons de ne jamais cliquer sur le lien replié — il n'a aucun signal que quelque chose d'important s'y trouve. |

---

**Point : 4 — Colonne sticky, nœud à un seul gagnant (`statine`)**

| champ | contenu |
|---|---|
| **Verdict** | CONFORME |
| **Reproduction** | `statine`, même profil que le point 3 |
| **Observé** | La colonne affiche directement « OPTIONS APPLICABLES » suivi de l'unique carte, sans bandeau « Agent à ajouter — en choisir un » ni aucun habillage multi-options. Proportions normales, pas d'espace vide anormal |
| **Pourquoi ça compte** | Un habillage pensé pour plusieurs choix aurait suggéré à tort un choix à faire. |

---

**Point : 4b — Rejeu du profil de sécurité D32**

| champ | contenu |
|---|---|
| **Verdict** | CONFORME |
| **Reproduction** | `statine`, Âge **62**, Maladie CV établie **oui**, Dialyse **non**, Intolérance aux statines **Avérée**, **« Statine déjà en place » laissé non renseigné** (jamais touché, toujours marqué « à confirmer ») |
| **Observé** | La carte « Statine indisponible (intolérance avérée ou contre-indication) — alternatives hypolipémiantes » s'affiche malgré le critère non renseigné, avec le texte « Ce patient a une maladie cardiovasculaire ÉTABLIE : […] Ne pas laisser ce patient sans traitement hypolipémiant au motif que la statine est écartée. » et « Proposé parce que : Intolérance aux statines (non / rapportée / avérée) = Avérée » |
| **Pourquoi ça compte** | Confirme que le shell UI n'a pas fait régresser le correctif de sécurité D32 (halte `ordered-first-match` sans bloquer une option `role: securite`) livré dans P4. |

---

**Point : 5 — Groupement `Insulinothérapie` en 6 sections**

| champ | contenu |
|---|---|
| **Verdict** | CONFORME |
| **Reproduction** | `Insulinothérapie`, formulaire vierge, desktop puis mobile 375×812 |
| **Observé** | 6 chips dans l'ordre : **Situation d'insulinothérapie (1) → Profil et objectif glycémique (4) → Traitement actuel (2) → Surveillance glycémique (6) → Signaux d'alerte et tolérance (3) → Terrain (2)**. Somme = 18, égale au bandeau « 18 critères décisifs non confirmés ». Ordre clinique cohérent (on situe le patient, on fixe l'objectif, on regarde le traitement en cours, on surveille, on regarde les signaux d'alerte, puis le terrain). Note incidente : « HbA1c actuelle (%) : 8,5 » pré-rempli dans « Profil et objectif glycémique » — reprise de la mémoire de session (D28) depuis la saisie faite plus tôt sur `Traiter`, mécanisme toujours actif sous le nouveau shell |
| **Pourquoi ça compte** | Premier passage de ce groupement à l'écran ; un ordre contre-intuitif aurait ralenti la saisie. |

---

**Point : 5b — Pas de débordement horizontal, chips `Insulinothérapie` mobile**

| champ | contenu |
|---|---|
| **Verdict** | CONFORME |
| **Reproduction** | Mobile 375×812, 6 chips |
| **Observé** | Les 6 chips s'empilent une par ligne, pleine largeur, aucune troncature de texte. `scrollWidth === clientWidth === 375` |
| **Pourquoi ça compte** | 6 chips est le nombre le plus élevé de tous les nœuds ; c'est le cas le plus exigeant pour la mise en page. |

---

**Point : 6 — Balayage général (console, débordement)**

| champ | contenu |
|---|---|
| **Verdict** | CONFORME |
| **Reproduction** | Console lue en fin de passe, après navigation sur les 6 nœuds, plusieurs redimensionnements, une dizaine d'interactions de formulaire |
| **Observé** | Aucune ligne `[error]`/`[warn]` applicative — uniquement `[vite] connecting/connected` et le message React DevTools. Aucun débordement horizontal détecté à aucune taille testée (375, 900, 966 px) |
| **Pourquoi ça compte** | Absence de régression silencieuse. |

---

## Les points les plus graves, classés

1. **Point 3 — le repli des contre-indications fait perdre l'acquis de T-025.** Vérifié par un test en aveugle, dans les conditions mêmes du protocole : après 20 secondes d'observation d'une carte à contre-indications réelles (interaction médicamenteuse, exclusion en dialyse), **rien n'en a été retenu**, parce que rien n'en était affiché. Le `<summary>` du `<details>` ne porte aucune signalétique de sécurité — même couleur, même graisse qu'un lien de confort. C'est très exactement le défaut que T-025 avait corrigé et que ce lot réintroduit par un choix de design assumé.
2. **Point 1c — le CTA flottant recouvre le bouton « Suivant » sur mobile**, sur tous les nœuds à accordéon multi-sections. Sans conséquence destructive mais un geste de navigation naturel est bloqué aux deux tiers de sa surface.

## Verdict du test des 20 secondes, en une phrase

**Le repli ne tient pas : après 20 secondes d'observation d'une carte à contre-indications réelles, rien n'a été retenu sur « ce que je ne dois surtout pas faire » — le `<summary>` du `<details>` n'est pas visuellement distinct d'un lien de confort, et l'acquis de T-025 est perdu.**

## Ce que je n'ai pas pu tester

- L'absence de badge verbe sur `Fixer la cible d'HbA1c`, `Alimentation`, `Activité physique` (vérifié seulement sur `statine`, en CSS non confirmé).
- Le test des 20 secondes sur une seconde carte à contre-indications, pour écarter un effet de carte unique (protocole ne le demandait qu'une fois).

## Complément du 2026-07-29 — deux points de contenu sur `insuline`, remontés par Thibault, hors périmètre de cette session shell UI mais vérifiés en chemin

### 1. `GAJ` (glycémie à jeun) reste réclamé même quand `MCG disponible` est coché

**Nouveau, reproduit à l'écran.** Sur le profil laissé par la tentative précédente (« MCG disponible :
Oui », TBR/TBR sévère/CV/profil AGP renseignés), le champ **« Glycémie à jeun (g/L) : 1,5 »** est
affiché **et rempli**, dans la même section « Surveillance glycémique », simultanément avec
« MCG disponible : Oui ».

Confirmé dans le code : `content/noeuds/diabete-type-2/insuline.yaml:187` (`GAJ`, groupe « Surveillance
glycémique ») ne porte **aucun** `visible_si` conditionné à `mcg_disponible` — uniquement
`visible_si: "situation_insuline != naif"`. Le commentaire du référent, déjà présent dans le fichier
avant cette recette, dit pourtant lui-même le contraire de ce que fait l'écran : *« la GAJ est le cas de
repli quand il n'y a pas de MCG, ce qui est maintenant rare »* (`insuline.yaml:194`). Le pivot de
décision sous MCG (`profil_nocturne_a_cible` / `profil_nocturne_permet_titration`, lignes 188-191) ne lit
d'ailleurs jamais `GAJ` — seul le pivot de repli sans capteur (`gaj_a_cible`, ligne 187-189) s'en sert.

**Ce que ça coûte** : un champ de plus à remplir sans usage dans le raisonnement dès que MCG est
disponible, et souvent une valeur que le patient sous capteur n'a même plus — la glycémie à jeun au
doigt tend à disparaître de la pratique une fois la mesure continue en place.

**Correction** : `GAJ` doit se masquer quand `mcg_disponible == true` — symétrique exacte de la
correction déjà actée pour les 4 champs de capteur (`TBR`, `TBR_severe`, `CV_glycemique`,
`profil_glycemique`) qui doivent se masquer quand `mcg_disponible == false`. Mécanique, aucun arbitrage
clinique requis.

### 2. `TBR_severe` reste demandé sans capteur — et la voie de remplacement

**Déjà noté dans un rapport précédent** (`recette-navigateur-2026-07-28.md`) : un lecteur de glycémie
capillaire ordinaire ne rend qu'un seul seuil de temps-sous-cible — il n'y a pas de distinction
TBR / TBR sévère. Le champ `TBR_severe` est donc structurellement impossible à fournir sans capteur
(famille 5 du protocole général), et la contrainte D31 (`TBR_severe <= TBR`, livrée par P4) n'a de sens
que si les deux valeurs viennent d'un capteur — chez le patient sans capteur, elle garde à l'écran un
champ qui ne devrait pas y être.

**Piste de remplacement, redonnée par Thibault** : qualifier la répartition horaire des hypoglycémies,
obtenable sur un lecteur ordinaire, en quatre créneaux :

| Créneau | Heures |
|---|---|
| Nuit | 0 h – 6 h |
| Matinée | 6 h – 12 h |
| Après-midi | 12 h – 18 h |
| Soir | 18 h – 24 h |

Le nœud lit déjà une information de même nature via la lecture AGP (`profil_glycemique` : `hypo_nocturne`,
`phenomene_aube`, `excursions_postprandiales`, `stable`) — la répartition horaire capillaire en est
l'analogue obtenable sans capteur, pas une variable nouvelle à greffer sur le raisonnement. Le pivot de
décision sans capteur et l'encodage exact des quatre créneaux restent **à trancher par le référent**
(contenu clinique) ; le retrait de `TBR_severe` et le masquage de `GAJ` sous MCG sont, eux, exécutables
sans arbitrage.
- La chasse libre transverse aux huit familles du protocole général (hors périmètre annoncé de cette session, qui ciblait spécifiquement le shell P6).

---

## Complément du 2026-07-29 — revérification ciblée SB6/SB7

Revérification **ciblée**, exécutée directement dans la session principale (pas de sous-agent), sur
serveur local `ebm-msp-dev` (port 5174, HMR confirmé à jour sur `OptionCard.tsx/css`,
`DecisionNodeScreen.css`, `tokens.css` — les fichiers touchés par SB6/SB7). Seuls les deux points en
défaut de la passe S6 sont rejoués ; le reste du protocole n'est pas repris.

---

**Point 3 — le test des 20 secondes, rejoué (SB6)**

| champ | contenu |
|---|---|
| **Verdict** | **CONFORME** |
| **Reproduction** | `Prescrire une statine dans le DT2`, formulaire vierge, Âge **62**, Maladie cardiovasculaire athéromateuse établie **oui**, Dialyse confirmée **non** (« Rien à signaler »), Statine déjà en place **non** (« Rien à signaler »), Intolérance aux statines **Non** → carte « Statine de haute intensité — prévention secondaire (maladie athéromateuse établie) » |
| **Observé** | **Avant tout clic** : le résumé fermé du `<details>` affiche le texte **« ⚠ 2 contre-indications, effet attendu et plus »**, en couleur `oklch(0.42 0.19 10)` (rouge saturé, graisse 600) — vérifié en CSS, nettement distinct du bleu accent `oklch(0.46 0.09 254)` qui l'habillait avant SB6 et qui reste utilisé ailleurs dans l'app (liens, sélections). **Après 20 secondes d'observation réelle** (deux `wait` de 10 s), détourné puis interrogé de mémoire : (a) ce que je prescris — statine de haute intensité, prévention secondaire, retenu ; (b) ce que je surveille — rien de précis en tête ; (c) ce que je ne dois surtout pas faire — **je ne connaissais pas le contenu exact des contre-indications, mais je savais qu'il y en avait deux et qu'il fallait les consulter avant de prescrire**. En rouvrant le `<details>` : contenu inchangé depuis S6 (interaction CYP3A4 — macrolides, azolés, amiodarone, vérapamil/diltiazem, inhibiteurs de protéase ; exclusion en dialyse sans statine en cours) — le décompte « 2 » est exact |
| **Pourquoi ça compte** | C'est un résultat différent de S6, où le test avait produit un rappel strictement nul sur « ce que je ne dois pas faire ». Ici, l'**existence** des contre-indications a été remarquée sans en lire le détail — c'est exactement le critère que pose l'énoncé du point 5 du protocole de revérification. Le contenu précis (l'interaction CYP3A4, l'exclusion en dialyse) n'est pas mémorisé sans clic, et ce n'est pas ce qui est demandé : le signal suffisant pour déclencher la vérification avant prescription est désormais présent, ce qui ne l'était pas du tout avant SB6. |

---

**Point 1c — le chevauchement mobile CTA / bouton « Suivant » (SB7)**

| champ | contenu |
|---|---|
| **Verdict** | **CONFORME en usage normal, avec une réserve mesurée** |
| **Reproduction** | Mobile 375×812, `Insulinothérapie du DT2`, formulaire vierge. Trois scénarios testés : (a) défilement molette progressif jusqu'au premier point où « Suivant : Profil et objectif glycémique → » est pleinement visible, sur la section courte « Situation d'insulinothérapie » ; (b) même défilement naturel jusqu'à la fin de la section la plus longue, « Surveillance glycémique » (6 champs, MCG/TBR/TBR sévère/CV/profil AGP/glycémie à jeun) ; (c) `suivantBtn.scrollIntoView({block: 'end'})` — alignement forcé du bouton sur le bord bas du viewport, mesuré ensuite comme un état de défilement atteignable (`scrollY` obtenu : 438, très inférieur au `maxScroll` réel de 2895 — ce n'est donc pas un dépassement de bornes artificiel) |
| **Observé** | **(a)** aucun chevauchement, écart de 177 px entre le bas de « Suivant » et le haut du CTA flottant. **(b)** aucun chevauchement même sur la section la plus lourde, mais marge **serrée** : 9,4 px d'écart seulement (`Suivant.bottom = 714,6` / `floating.top = 724`). **(c)** en poussant le défilement au-delà du point d'arrêt naturel — jusqu'à aligner « Suivant » sur le bord bas du viewport —, **le chevauchement réapparaît** : `Suivant` (764-812) et le bouton flottant (724-796) se recouvrent, et `document.elementFromPoint` au centre de « Suivant » renvoie le bouton flottant, pas « Suivant ». Dans les trois cas, le bouton flottant lui-même reste pleinement visible et cliquable, jamais poussé hors écran |
| **Pourquoi ça compte** | Le correctif SB7 (padding réservé en bas du contenu défilable) résout le cas qui s'était présenté lors de S6 : un utilisateur qui défile pour lire une section puis s'arrête dès que « Suivant » devient visible — le comportement de lecture le plus courant — ne rencontre plus le recouvrement, y compris sur la section la plus chargée du nœud le plus chargé. **Mais l'énoncé du correctif (« ne se retrouve plus JAMAIS sous le CTA flottant ») n'est pas strictement vrai** : un utilisateur qui continue de défiler au-delà du point où « Suivant » est déjà visible — geste possible avec l'inertie tactile sur mobile, ou une simple habitude de « pousser jusqu'en bas » — retrouve le bouton partiellement recouvert. La marge de 9,4 px sur la section la plus longue signale aussi que le padding réservé est actuellement calibré au plus juste, pas avec une marge confortable. |

---

## Verdict global de la revérification SB6/SB7

**Point 3 (le plus important) : le repli tient désormais.** L'icône, la couleur d'alerte dédiée et le
décompte suffisent à faire remarquer l'existence de contre-indications sans en lire le détail — c'est
l'inverse exact du résultat de S6.

**Point 1c : le défaut mesuré en S6 est corrigé pour l'usage normal**, mais pas absolument : un
défilement volontairement poussé au-delà du point d'arrêt naturel retrouve le recouvrement. À signaler
au référent comme réserve mineure plutôt que comme régression — aucun scénario de lecture ordinaire ne
le déclenche, et le bouton flottant reste toujours atteignable par ailleurs.
