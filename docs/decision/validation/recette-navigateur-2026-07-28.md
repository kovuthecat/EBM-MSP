# Recette navigateur — 2026-07-28

## En-tête

| | |
|---|---|
| **Cible** | `https://ebm-msp.vercel.app` |
| **Date / heure de la passe** | 2026-07-28, passe unique, ~2 h |
| **Bundle servi** | `assets/index-C01dOUSf.js` + `assets/index-CV_pbKY-.css` (200) |
| **Largeurs utilisées** | **1280 × 800** (desktop, nominale) et **459 × 995** (étroite — voir limite ci-dessous) |
| **Erreurs console** | **Aucune.** `read_console_messages` : « No console logs » en début et en fin de passe. Aucune requête réseau autre que le HTML + le JS + le CSS. |

### Sonde de version n° 1 (§2) — libellés RHD → **BUILD À JOUR**

Aide à la décision → Diabète de type 2 → Règles hygiéno-diététiques → Alimentation, formulaire vierge.
Verbatim relevé à l'écran :

> « Boissons sucrées », « Aliments ultra-transformés », « Restauration rapide », « **Matière grasse de cuisson** », « **Régularité des repas** », « Grignotage », « Accès à l'alimentation », « Fruits à coque », « Légumineuses », « Poisson », « Viande rouge et charcuterie », « **Signes d'appel d'un trouble du comportement alimentaire** », « Estimation des portions », « Alimentation émotionnelle », « Consommation de vin ».

Tous accentués, tous rédigés. Aucune trace de « Frequence boissons sucrees » ni de « Retinopathie non stabilisee ». Le nœud *Activité physique* affiche de même « **Rétinopathie non stabilisée ou proliférante** ». → **build ≥ 2026-07-28, la passe est valide.**

### Sonde de version n° 2 (§2) — pré-remplissage calculé → **CODE DÉPLOYÉ, MAIS IL NE PRÉ-REMPLIT RIEN**

*Traiter* → HbA1c actuelle **9**, HbA1c cible **7**. Le libellé du champ de position devient, verbatim :

> « **Par rapport à l'objectif fixé pour ce patient · à confirmer · calculé, à vérifier** »

La mention « **· calculé, à vérifier** » du lot K6/D28 est donc **bien en ligne**. Mais **aucun des quatre boutons n'est sélectionné** — relevé par `javascript_tool` sur les quatre segments : `aria-pressed="false"` pour les quatre, aucune classe `data-on`. Et le bloc de résultats continue de réclamer le critère :

> « Introduire un iSGLT2 … — à renseigner : Intention thérapeutique (« je souhaite… »), **Par rapport à l'objectif fixé pour ce patient**, DFG (mL/min/1,73 m²), Albuminurie »

À titre de comparaison, un clic manuel sur « Nettement au-dessus de l'objectif » produit `aria-pressed="true" data-on="true"` et fait disparaître les deux mentions. Le pré-remplissage n'est donc **ni appliqué au formulaire, ni vu par le moteur** — seule l'étiquette qui l'annonce est déployée.

**Conséquence sur la passe** : je ne marque **pas** P1/P2 en « NON REPRODUIT — build antérieur ». Le lot EST déployé ; c'est le mécanisme qui est cassé. P1 (mémoire de session) est vérifié et conforme, P2 est un `DÉFAUT` (D-06).

### Ce que j'ai pu faire

- Parcourir **les six nœuds** en formulaire vierge et scanner leur texte (identifiants, mots sans accent).
- Jouer **P0-a → P0-f, P1, P2, P3, P4, P5, P6** et une chasse libre P7.
- Jouer **V1 (Traiter)**, **V2 (Insulinothérapie)**, **V3 (Statine)** de bout en bout, avec comptage.
- Mesurer, par `javascript_tool` (mesure seule, aucun scénario monté par script) : hauteurs de document, positions absolues des blocs, nombre de champs, `aria-pressed`, styles calculés, nombre de mots par carte.

### Ce que je n'ai pas pu faire (et pourquoi)

1. **Vider un champ chiffré.** Les touches `BackSpace` / `Delete` ne sont **jamais** parvenues à la page dans cet environnement (test de contrôle : je tape `45` dans DFG, puis `BackSpace` → la valeur reste `45`). Le point « famille 9 : un champ chiffré qu'on ne peut pas re-vider » est donc **NON REPRODUIT — limite d'outil**, ni infirmé ni confirmé. Un humain doit le rejouer.
2. **La largeur 375 px.** Le volet navigateur refuse de descendre sous **459 px** de viewport CSS (`resize_window` à 375 puis 306 renvoie `innerWidth = 459` dans les deux cas). Les chiffres « mobile » de l'axe A/B sont donc donnés **à 459 × 995**, ce qui **sous-estime** le défilement d'un vrai téléphone.
3. **Les captures d'écran ont été intermittentes** (volet non composité la plupart du temps). J'ai obtenu 2 captures exploitables ; pour le reste, la hiérarchie visuelle de l'axe B est mesurée par **styles calculés** (taille, graisse, couleur, fond) et positions absolues, ce qui est plus précis mais ne dit rien du « coup d'œil ».
4. **P0-d, second volet** (« Initier + un traitement déjà coché ») : **impossible par construction** — voir D-12.

---

# Partie 1 — Défauts et non-régressions

## Tableau de synthèse

| # | Point | Nœud | Verdict |
|---|---|---|---|
| **D-01** | Formulaire **entièrement vierge** → 4 cartes « Recommandée » | Activité physique | `DÉFAUT` **grave** |
| **D-02** | Drapeau « à confirmer » lu comme « non » par le moteur | Fixer la cible · Statine · Insulino. | `DÉFAUT` **grave** |
| **D-03** | **Sortie muette** : intolérance avérée sans statine en place → aucune carte | Statine | `DÉFAUT` **grave** |
| **D-04** | Saisie déclarée impossible → 3 cartes « Recommandée » contradictoires | Insulinothérapie | `DÉFAUT` **grave** |
| **D-05** | Titre de carte contredit par l'alerte qu'elle contient (CK 60) | Statine | `DÉFAUT` **grave** |
| **D-06** | « · calculé, à vérifier » affiché, rien de pré-rempli (P2) | Traiter | `DÉFAUT` |
| **D-07** | Expressions booléennes brutes dans « Proposé parce que » et les options écartées | Traiter · Statine · Insulino. · Fixer la cible | `DÉFAUT` |
| **D-08** | « Proposé parce que : Option par défaut : retenue en l'absence de… » | Statine | `DÉFAUT` |
| **D-09** | Identifiants techniques dans le cadrage : `statine_deja_en_place`, `intolerance_statine`, `incertitudes` | Statine | `DÉFAUT` (P0-a) |
| **D-10** | « Ces **1** pistes s'appliquent à ce patient » | Traiter | `DÉFAUT` (mineur) |
| **D-11** | « Rien à signaler » irréversible et muet sur ce qu'il a répondu | tous | `DÉFAUT` (famille 9) |
| **D-12** | Changer d'intention efface silencieusement les traitements en cours | Traiter | `DÉFAUT` (famille 9) |
| **D-13** | Mémoire de session = **contamination inter-patients**, aucun bouton de remise à zéro | Traiter ↔ Insulino. | `DÉFAUT` **grave** |
| **D-14** | Sans capteur : l'écran réclame TBR/CV **et** dit de faire sans ; un garde-fou reste à jamais en attente | Insulinothérapie | `DÉFAUT` (famille 5) |
| **D-15** | Message de contrainte inséré **848 px au-dessus** du champ concerné, décale le formulaire | Insulinothérapie | `DÉFAUT` (familles 10+11) |
| **D-16** | « à renseigner : Espérance de vie » à **2207 px** du champ, sans lien | Traiter | `DÉFAUT` (famille 11) |
| **D-17** | Cocher un critère fait basculer des cartes déjà lues derrière le repli, sans signal | Alimentation | `DÉFAUT` (famille 10) |
| **D-18** | « Autres facteurs de risque cardiovasculaire » : champ numérique sans définition ni unité | Statine | `DOUTE` |
| **D-19** | Deux rendus différents pour « critère non décisif » (marqueur absent vs « sans effet ») | Traiter · Statine | `DOUTE` (mineur) |
| **D-20** | Répondre à une question **augmente** le compteur de critères non confirmés (4 → 5) | Fixer la cible | `DOUTE` (mineur) |
| **D-21** | Intention « Déprescrire » → le bloc « En attente » ne contient que des options d'**ajout** | Traiter | `DOUTE` |
| **P0-a** | Libellés rédigés partout | 5 nœuds sur 6 | `CONFORME` (1 exception = D-09) |
| **P0-b** | « Nature de l'intolérance » n'est plus réclamée sans exister ; apparaît quand on coche | Traiter | `CONFORME` (2 volets) |
| **P0-c** | Champ de détail lié au traitement coché | Traiter | `CONFORME` |
| **P0-d** | Contrainte TBR affichée | Insulinothérapie | `CONFORME` pour l'affichage / voir D-04 pour l'effet |
| **P0-e / P3** | Plafond de 5, orientations et écartées jamais repliées, pas de repli à 2 pistes | Alimentation | `CONFORME` |
| **P0-f** | `aria-pressed` avant/après clic | Traiter | `CONFORME` |
| **P1** | Mémoire de session (2 critères, mention, modification, F5) | Traiter → Insulino. | `CONFORME` (mais voir D-13) |
| **P2-3** | Un choix manuel n'est jamais écrasé par un calcul | Traiter | `CONFORME` |
| **P4** | Bandes de CK (4,5 / 6 / 20 / 60) et intolérance avérée | Statine | `CONFORME` (voir D-05) |
| **P6** | « Pourquoi pas d'autres options » parle du patient | Traiter · Statine | `DÉFAUT` → D-07 |
| — | Vider un champ chiffré (famille 9) | — | **NON REPRODUIT** (limite d'outil) |
| — | P0-d, volet « Initier + traitement coché » | Traiter | **NON REPRODUIT** (impossible par construction, cf. D-12) |

---

## Détail

### D-01 — Un formulaire entièrement vierge affiche quatre cartes « Recommandée »

| champ | contenu |
|---|---|
| **Verdict** | `DÉFAUT` — le plus grave de la passe |
| **Reproduction** | Accueil → Aide à la décision → Diabète de type 2 → **Règles hygiéno-diététiques** → **Activité physique**. **Ne rien saisir.** Contrôle mesuré à l'écran : 0 case cochée, 0 bouton segmenté `aria-pressed="true"`, aucun champ numérique dans ce nœud. |
| **Observé** | En tête du bloc de résultats : « **Reco provisoire — 12 critères décisifs non confirmés dans le formulaire ci-dessus** ». Puis, immédiatement en dessous : <br>« **Rupture de sédentarité — gestes cumulables** <br> **Se lever et bouger quelques minutes à chaque heure de position assise prolongée** / **Recommandée** / Preuve faible / **Proposé parce que : Interrompt habituellement les longues périodes assises : non** » <br>« **À ÉGALITÉ — MÊME NIVEAU DE PRIORITÉ.** » <br>« **S'appuyer sur un repère du quotidien pour penser à se lever (téléphone hors de portée, appel pris en marchant)** / **Recommandée** / Preuve faible / Proposé parce que : Interrompt habituellement les longues périodes assises : non » <br>« **Transformer une pause déjà prise dans la journée en occasion de bouger quelques instants** / **Recommandée** / Preuve faible / Proposé parce que : Interrompt habituellement les longues périodes assises : non » <br>« **Orientation vers une ressource — gestes cumulables** <br> **Orienter vers une structure d'activité physique adaptée pour un bilan et un accompagnement progressif** / **Recommandée** / Preuve faible / **Proposé parce que : Offre d'activité de proximité connue : non** » |
| **Pourquoi ça compte** | C'est exactement le comportement que le §5 du protocole déclare corrigé et non négociable (« un formulaire vierge n'affiche aucune recommandation »). L'écran affirme deux faits sur un patient dont rien n'a été déclaré, et il oriente vers une structure d'APA avant la première question. Le praticien qui ouvre le nœud pour voir ce qu'il contient repart avec quatre gestes « recommandés » qu'aucune donnée ne soutient. |

### D-02 — Le drapeau non répondu vaut « non » pour le moteur, « non confirmé » pour l'écran

| champ | contenu |
|---|---|
| **Verdict** | `DÉFAUT` grave — même cause que D-01, trois autres nœuds |
| **Reproduction n° 1** | *Fixer la cible d'HbA1c* : Espérance de vie **Longue**, Âge **55**, Ancienneté du diabète **3**. **Ne pas toucher** à Fragilité, Antécédent cardiovasculaire, Comorbidité grave. |
| **Observé n° 1** | Formulaire, verbatim : « Fragilité **· à confirmer** », « Antécédent cardiovasculaire **· à confirmer** », « Comorbidité grave **· à confirmer** ». En-tête des résultats : « Reco provisoire — **3 critères décisifs non confirmés** ». Et pourtant, la carte : « **Cible ~6,5 % (6,5–7 %)** / **Recommandée** / Preuve faible / Proposé parce que : Âge < 70 et Ancienneté du diabète (ans) < 5 et Espérance de vie = Longue et **Antécédent cardiovasculaire : non** et **Comorbidité grave : non** et **Fragilité : non** ». |
| **Reproduction n° 2** | *Prescrire une statine* : Âge **62**, Maladie CV établie **cochée**, Intolérance **Rapportée**, CK **4,5**. Laisser « Statine déjà en place » **non répondu**. |
| **Observé n° 2** | Formulaire : « **Statine déjà en place · à confirmer** ». Carte : « Débuter la statine à dose plus faible… / **Recommandée** / Proposé parce que : Intolérance aux statines = Rapportée et CK > 4 et CK ≤ 5 et **Statine déjà en place : non** ». |
| **Reproduction n° 3** | *Insulinothérapie*, V2 : « **MCG disponible · à confirmer** » jamais coché → l'alerte « Sans MCG : titrer la basale sur la glycémie à jeun » s'affiche quand même. |
| **Pourquoi ça compte** | Le moteur n'a pas de troisième état pour un booléen ; le formulaire, lui, en affiche un. L'écran compte le critère parmi les « non confirmés » **dans la même page** où il l'utilise comme un « non » déclaré. Sur *Fixer la cible*, cela produit une cible serrée à 6,5 % chez un patient dont ni la fragilité, ni l'antécédent CV, ni la comorbidité grave n'ont été renseignés — c'est-à-dire chez le patient chez qui il ne faut pas la serrer. |

### D-03 — Sortie muette : intolérance avérée sans statine en place

| champ | contenu |
|---|---|
| **Verdict** | `DÉFAUT` grave (famille 7) — reproduit deux fois |
| **Reproduction** | *Prescrire une statine* : Âge **62** · **Maladie cardiovasculaire athéromateuse établie = cochée** · « Rien à signaler » sur la section « Critères du patient » puis sur « Statine en cours » (donc **Statine déjà en place = non, explicitement répondu**) · Intolérance **Avérée** · CK **6**. Rejoué à l'identique avec CK **0** (« non dosé »). |
| **Observé** | **Zéro carte.** Le bloc entier, verbatim : « OPTIONS APPLICABLES — PROVISOIRE / Reco provisoire — 4 critères décisifs non confirmés… / **EN ATTENTE — CRITÈRE À RENSEIGNER POUR TRANCHER** / *Discuter la statine (décision partagée) — diabète non compliqué à faible risque absolu — à renseigner : Ancienneté du diabète (ans), Autres facteurs de risque cardiovasculaire, Diabète compliqué (…)* / *Statine de haute intensité — prévention secondaire (maladie athéromateuse établie)* **écarté : Intolérance aux statines (non / rapportée / avérée) = Avérée et … ≠ Non et CK > 5 et Statine déjà en place : non** ». |
| **Contradiction interne** | Le cadrage du même nœud, deux écrans plus haut, promet verbatim : « Depuis le 2026-07-27, **une option TERMINALE couvre le patient pour qui la statine n'est pas disponible et l'oriente vers les alternatives hypolipémiantes** : il n'existe plus de profil à qui cet outil propose une statine que le dossier du patient déclare contre-indiquée. » Cette option existe bien — je l'ai obtenue — mais **uniquement si « Statine déjà en place » est coché** : « Interrompre la statine — la classe reste indisponible (intolérance avérée, CK au-dessus de 5 fois la normale) ». Le patient jamais traité, lui, n'obtient rien. |
| **Pourquoi ça compte** | Un patient en prévention **secondaire** avec une intolérance **avérée** est précisément celui pour qui la question « et maintenant, quoi ? » est la plus urgente. L'outil ne répond rien, et la seule ligne qui le concerne est une expression booléenne dans un repli. |

### D-04 — Une saisie que l'outil déclare impossible produit trois cartes « Recommandée » contradictoires

| champ | contenu |
|---|---|
| **Verdict** | `DÉFAUT` grave (familles 1 + 3) ; l'affichage de la contrainte, lui, est `CONFORME` (P0-d) |
| **Reproduction** | *Insulinothérapie* : Situation **Basale seule** · HbA1c actuelle **8,9** · HbA1c cible **7** · **TBR = 1** · **TBR sévère = 95**. |
| **Observé — la contrainte s'affiche bien** | « **Le temps passé sous 54 mg/dL (TBR sévère) est par définition INCLUS dans le temps passé sous 70 mg/dL (TBR) : il ne peut pas lui être supérieur. Vérifier laquelle des deux valeurs est erronée.** » (fond ambre pâle, en tête du formulaire) |
| **Observé — mais elle ne retire rien** | « **Sécurité — à corriger d'abord — gestes cumulables** / **Corriger l'hypoglycémie ou la variabilité (réduire la dose, passer en 2ᵉ génération, relâcher la cible)** / **Recommandée** / Preuve modérée / Doses non calculées : Basale réduite (−20 %) — à renseigner : Dose de basale actuelle (U/j) / Proposé parce que : Situation d'insulinothérapie = Basale seule et **TBR sévère — temps sous 54 mg/dL (%) > 1** » <br>puis, dans la même page : « **Intensifier le traitement — gestes cumulables** / **Ajouter un GLP-1 / une association fixe d'abord (si non encore fait)** / **Recommandée** » et « **Ajouter un bolus au repas principal (basal-plus, par étapes)** / **Recommandée** ». |
| **Pourquoi ça compte** | Sur une saisie que l'outil vient de déclarer impossible, il conclut simultanément « réduire la dose pour hypoglycémie » **et** « ajouter un bolus ». Un praticien qui a scrollé au-delà du bandeau ambre — placé en haut du formulaire, une page et demie plus haut (cf. D-15) — lit trois cartes « Recommandée » et deux gestes opposés. La contrainte est un canal d'affichage, pas un garde-fou. |

### D-05 — Le titre de la carte contredit l'alerte qu'elle contient

| champ | contenu |
|---|---|
| **Verdict** | `DÉFAUT` grave (famille 3) |
| **Reproduction** | *Statine* : Âge **62** · Maladie CV établie **cochée** · **Statine déjà en place cochée** · Intolérance **Rapportée** · **CK = 60**. |
| **Observé** | Titre de la carte (17 px, gras, l'élément le plus saillant) : « **Interrompre la statine 4 à 6 semaines et réévaluer (CK au-dessus de 5 fois la normale)** » · badge « **Recommandée** ». Deux lignes plus bas, dans la même carte : « **CK au-dessus de 50 fois la normale : arrêter la statine et évoquer une RHABDOMYOLYSE. Avis spécialisé URGENT et évaluation hospitalière — ne pas attendre le dosage de la myoglobinurie pour réhydrater. Ce n'est plus la séquence d'interruption-réintroduction décrite ci-dessus.** » |
| **Point conforme associé** | Le basculement des bandes est **correct** : à CK 20 l'alerte est « CK entre 10 et 50 fois la normale : vérifier la FONCTION RÉNALE avant tout… » ; à CK 60 cette alerte **disparaît** (vérifié : plus aucune occurrence de « FONCTION RÉNALE » dans la page) et cède la place à celle de rhabdomyolyse. Les deux ne coexistent jamais. |
| **Pourquoi ça compte** | Le geste affiché en gros (« interrompre 4-6 semaines et réévaluer ») est celui que l'alerte interdit. C'est le cas d'école du §4-3, avec la circonstance aggravante que le titre porte le badge « Recommandée » et l'alerte non. |

### D-06 — « · calculé, à vérifier » s'affiche, mais rien n'est pré-rempli (P2)

| champ | contenu |
|---|---|
| **Verdict** | `DÉFAUT` |
| **Reproduction** | *Traiter*, formulaire neuf. (a) HbA1c actuelle **9**, cible **7**. (b) cible passée à **8,5**. (c) actuelle passée à **6,5**, cible **8,5** (HbA1c **sous** la cible). |
| **Observé (a) et (b)** | Libellé : « Par rapport à l'objectif fixé pour ce patient **· à confirmer · calculé, à vérifier** ». Les quatre segments : `aria-pressed="false"`. Bloc de résultats : « … — à renseigner : … **Par rapport à l'objectif fixé pour ce patient** … » sur cinq options. Aucune bascule entre (a) et (b). |
| **Observé (c)** | La mention « **· calculé, à vérifier** » **reste affichée** alors que l'HbA1c est sous la cible — cas où le §2/P2-4 demande explicitement qu'il n'y ait **rien**. |
| **Point conforme associé (P2-3)** | Choix manuel « À l'objectif » sur HbA1c 8,9 / cible 7, puis HbA1c portée à **11** → le choix reste « À l'objectif » (`aria-pressed="true"`) et les deux mentions disparaissent. **Rien n'écrase la saisie du praticien.** |
| **Pourquoi ça compte** | L'étiquette annonce un calcul que le praticien est invité à « vérifier », alors qu'aucune valeur n'a été posée. Il peut croire le champ rempli et passer à la suite ; cinq options resteront alors en attente sans qu'il comprenne pourquoi. |

### D-07 — Expressions booléennes brutes à l'écran (P6)

| champ | contenu |
|---|---|
| **Verdict** | `DÉFAUT` (famille 8) |
| **Reproduction** | *Traiter* → bouton « **Pourquoi pas d'autres options ?** ». Idem sur *Statine* et *Insulinothérapie*. |
| **Observé — verbatim, non résumé** | « Réduire la posologie de la metformine (fonction rénale altérée ou intolérance digestive) : **DFG (mL/min/1,73 m²) ≥ 45 et DFG (mL/min/1,73 m²) < 60 et Dose de metformine (mg/j) > 2000 ou DFG (mL/min/1,73 m²) ≥ 30 et DFG (mL/min/1,73 m²) < 45 et Dose de metformine (mg/j) > 1000 ou Intolérance à un traitement en cours et Nature de l'intolérance = Digestive** » <br>« Reconsidérer un agent protecteur prescrit hors indication ET posant un risque (ex. iSGLT2 sans terrain + infections uro) : **Traitements en cours comprend iSGLT2 (gliflozine) et Maladie cardiovasculaire athéromateuse établie : non et Insuffisance cardiaque : non et DFG (mL/min/1,73 m²) ≥ 60 et Albuminurie = Normoalbuminurie et Infections génito-urinaires récidivantes** » <br>« Introduire un AR GLP‑1 … : … **ou DFG (mL/min/1,73 m²) > 0 et DFG (mL/min/1,73 m²) < 30 et HbA1c à la cible : non** » <br>Et hors repli, dans les cartes affichées : « Proposé parce que : **Par rapport à l'objectif fixé pour ce patient ≠ En dessous de l'objectif (sur-traitement probable)** » · « Proposé parce que : Situation d'insulinothérapie = Basale seule et **HbA1c à la cible : non** et **Glycémie à jeun à la cible** » · « Ce rang tient compte de : **Maladie cardiovasculaire athéromateuse établie ou IMC (kg/m²) ≥ 30** ». |
| **Pourquoi ça compte** | Aucune de ces lignes ne parle du patient qu'on a devant soi ; elles récitent la règle, avec les opérateurs `≥ < > = ≠`, le sigle `: non`, le verbe `comprend`, et un mélange `et` / `ou` **sans parenthèses** dont la priorité est indevinable. Sur un DFG à 45, la ligne « Arrêter la metformine (DFG < 30) : **DFG (mL/min/1,73 m²) < 30** » ne dit pas au praticien que **son** patient est à 45 — c'est exactement ce que P6 demandait de vérifier. |

### D-08 — Un « proposé parce que » qui parle du moteur

| champ | contenu |
|---|---|
| **Verdict** | `DÉFAUT` (famille 8) |
| **Reproduction** | *Statine*, V3 : Âge **55** · Ancienneté **0** · Autres FdR CV **1** · « Rien à signaler » sur les deux sections · Intolérance **Non**. |
| **Observé** | « **Statine (prévention primaire, intensité modérée — haute si risque très élevé)** / **Recommandée** / Preuve modérée / … / **Proposé parce que : Option par défaut : retenue en l'absence de toute autre option plus spécifique applicable.** » |
| **Pourquoi ça compte** | Seule carte de l'écran, elle justifie une prescription au long cours par une propriété de l'algorithme. Le praticien n'a rien à dire au patient à partir de cette phrase. |

### D-09 — Identifiants techniques dans le cadrage du nœud Statine (P0-a)

| champ | contenu |
|---|---|
| **Verdict** | `DÉFAUT` — unique occurrence sur les six nœuds |
| **Reproduction** | *Prescrire une statine dans le DT2*, premier paragraphe, visible dès l'ouverture, formulaire vierge. |
| **Observé** | « Couvre à la fois l'INITIATION et la POURSUITE d'une statine (**`statine_deja_en_place`**), ainsi que la situation d'intolérance déclarée (**`intolerance_statine`**, désormais à TROIS valeurs : non / rapportée / avérée — décision référent 2026-07-27) … le red-team a demandé de ne pas l'encoder de seconde main (cf. **`incertitudes`**). » |
| **Scan des cinq autres nœuds** | Alimentation, Activité physique, Fixer la cible, Traiter, Insulinothérapie : **zéro** identifiant `snake_case`, **zéro** texte entre accents graves. |
| **Pourquoi ça compte** | Le paragraphe expose aussi le vocabulaire interne du projet (« red-team », « changelog », « ce tier n'a pas d'exclusion structurelle, cf. changelog » — relevé dans une carte). C'est le seul nœud où le lot D29 n'a pas été appliqué au texte de cadrage. |

### D-10 — « Ces 1 pistes s'appliquent à ce patient »

| champ | contenu |
|---|---|
| **Verdict** | `DÉFAUT` (mineur, famille 8) |
| **Reproduction** | *Traiter*, V1 (voir Partie 2) → 6 options applicables → bouton « **Autres pistes possibles (1)** » → déplier. |
| **Observé** | « **Ces 1 pistes s'appliquent à ce patient** : elles ne sont pas écartées. Une consultation ne permet d'en négocier que deux ou trois, l'écran en déplie donc au plus 5 … » |
| **Pourquoi ça compte** | Petit, mais c'est la signature d'un texte fabriqué par gabarit : elle signale au lecteur qu'il lit une machine. |

### D-11 — « Rien à signaler » : irréversible, et muet sur ce qu'il vient de répondre

| champ | contenu |
|---|---|
| **Verdict** | `DÉFAUT` (famille 9) |
| **Reproduction** | *Traiter*, section « **SIGNAUX D'ALERTE ET TOLÉRANCE** » (6 drapeaux : Symptômes de glucotoxicité, Cétonémie, Hypoglycémie récente, Dénutrition / carence, Infections génito-urinaires récidivantes, Intolérance à un traitement en cours). Cliquer « **Rien à signaler** ». |
| **Observé** | Les six mentions « · à confirmer » disparaissent. **Les six cases restent visuellement vides**, exactement comme avant le clic. Le bouton « Rien à signaler » **disparaît** — relevé à l'écran : après le clic, la section ne contient plus **aucun** bouton. Aucun message ne dit *quels* champs viennent d'être répondus. Cocher puis décocher un drapeau ensuite ne restaure ni le bouton ni l'état « non répondu ». |
| **Nuance conforme** | Si l'on coche d'abord un drapeau (ex. « Hypoglycémie récente ») **puis** « Rien à signaler », la coche est **préservée** — le bouton ne répond que pour les champs restés vides. Bon comportement, mais invisible. |
| **Pourquoi ça compte** | Un clic répond à six questions et ne peut plus être défait. Le seul retour en arrière est de sortir du nœud, ce qui efface toute la saisie. En consultation, on clique vite. |

### D-12 — Changer d'intention efface silencieusement les traitements en cours

| champ | contenu |
|---|---|
| **Verdict** | `DÉFAUT` (familles 9 + 10) |
| **Reproduction** | *Traiter* : intention **Optimiser** → cocher **Sulfamide** (vérifié à l'écran : `checked = ["Sulfamide"]`) → cliquer **Initier un traitement** → revenir sur **Optimiser**. |
| **Observé** | Sous « Initier », le champ « Traitements en cours » **disparaît entièrement** du formulaire, ainsi que « Hypoglycémie récente » et « Intolérance à un traitement en cours ». Au retour sur « Optimiser », les neuf cases sont **vides** (`checked = []`). Rien n'a prévenu. Même effet sur « Dose de metformine ». |
| **Effet de bord positif** | Aucun état fantôme : le moteur ne conserve pas la valeur masquée. C'est la bonne moitié du comportement. |
| **Conséquence pour P0-d** | Le second volet de P0-d (« Initier + un traitement déjà coché ») est **NON REPRODUIT — impossible par construction** : sous « Initier », le champ n'existe pas. La combinaison est prévenue, pas signalée. |
| **Pourquoi ça compte** | L'intention est la **première** question du nœud, et c'est précisément celle qu'un médecin révise en cours de raisonnement (cf. axe C). La réviser coûte toute la ligne de traitement, la dose, l'hypoglycémie et l'intolérance — sans un mot. |

### D-13 — La mémoire de session survit au patient, et rien ne permet de la vider

| champ | contenu |
|---|---|
| **Verdict** | `DÉFAUT` grave |
| **Reproduction** | Jouer V1 sur *Traiter* (HbA1c actuelle **8,4**, cible **7** — cible non fournie par la vignette, héritée d'un essai antérieur). Revenir à la liste. Ouvrir *Insulinothérapie* pour **un autre patient** (V2). |
| **Observé** | À l'ouverture du nœud, avant toute saisie : « HbA1c actuelle (%) **· repris de votre saisie** » = **8,4** et « HbA1c cible (%) **· repris de votre saisie** » = **7**. Sur V2, j'ai corrigé l'actuelle à 8,9 mais **pas** la cible : la carte finale se justifie alors par « Proposé parce que : … et **HbA1c à la cible : non** … » — un raisonnement fondé sur une cible fixée pour **Mme R.** J'ai également retrouvé « 7,8 / 7 » (patient P0-b) en rouvrant *Traiter* deux vignettes plus tard. |
| **Absence de sortie** | Aucun bouton « nouveau patient », « effacer », « recommencer » nulle part : la barre de navigation ne contient que « MSP Ménilmontant · Décision · Veille · Méthode · Invité ». Sortir du nœud ne suffit pas (c'est explicitement le contraire pour les deux critères partagés). **Seul un rechargement complet (F5) vide la mémoire** — vérifié : après rechargement, *Traiter* et *Insulinothérapie* sont vierges. Rien à l'écran ne l'indique. |
| **Pourquoi ça compte** | Entre deux patients, la valeur du précédent est reprise, marquée « repris de votre saisie » (donc rassurante), et entre dans le raisonnement affiché. C'est le seul défaut de la passe qui peut faire **prescrire pour le mauvais patient**. Le mécanisme P1 lui-même est conforme ; c'est son absence de fin de vie qui ne l'est pas. |

### D-14 — Sans capteur, l'outil réclame ce qu'il vient de dire de ne pas chercher

| champ | contenu |
|---|---|
| **Verdict** | `DÉFAUT` (famille 5) |
| **Reproduction** | *Insulinothérapie*, V2 : Situation **Basale seule** · Âge **71** · HbA1c **8,9** · DFG **61** · Traitements **Metformine + Insuline basale** · Glycémie à jeun **1,2** · Dose de basale **38**. « MCG disponible » laissé non coché (le patient n'a pas de capteur). |
| **Observé — la bonne moitié** | « **Sans MCG : titrer la basale sur la glycémie à jeun (cible ~0,70-1,20 g/L) ; utiliser des profils capillaires 6-7 points (avant/après les 3 repas + coucher) pour guider l'intensification prandiale.** » |
| **Observé — la mauvaise** | Dans le même formulaire, juste au-dessus : « **À renseigner dans cette section : TBR — temps sous 70 mg/dL (%), TBR sévère — temps sous 54 mg/dL (%), Coefficient de variation glycémique (%), Poids (kg)** ». Et deux options restent **définitivement** en attente : « **Corriger l'hypoglycémie ou la variabilité** … — à renseigner : TBR …, TBR sévère …, Coefficient de variation glycémique (%) » et « **Ne pas sur-titrer la basale — intensifier autrement (GLP-1 puis bolus)** — à renseigner : TBR …, TBR sévère …, Coefficient de variation glycémique (%) ». Pendant ce temps l'écran recommande « **Ajouter un bolus au repas principal** ». |
| **Pourquoi ça compte** | Le garde-fou « ne pas sur-titrer la basale » est inatteignable pour le patient qui n'a pas de capteur — c'est-à-dire pour la majorité des patients de médecine générale, et précisément ceux chez qui la sur-basalisation passe inaperçue. L'écran demande une mesure et, trois lignes plus bas, explique comment s'en passer. |

### D-15 — La contrainte s'affiche à 848 px au-dessus du champ qu'elle concerne, et pousse le formulaire

| champ | contenu |
|---|---|
| **Verdict** | `DÉFAUT` (familles 10 + 11) |
| **Reproduction** | *Insulinothérapie*, saisie de D-04 (TBR 1 / TBR sévère 95). |
| **Observé (mesuré)** | Le bloc `criteria-form__contraintes` est inséré **en tête du formulaire**, à y = 436 px. Le champ « TBR sévère » que l'on est en train de remplir est à y = 1284 px. **Écart : 848 px** — plus d'un écran. Le bloc mesure **60 px** de haut : au moment où il apparaît, **tout le formulaire situé en dessous descend de 60 px sous le curseur**. |
| **Pourquoi ça compte** | Le message est correct et bien écrit ; il est simplement affiché là où personne ne regarde, et son apparition déplace le champ suivant pendant la frappe. |

### D-16 — « à renseigner : Espérance de vie » à 2207 px du champ, sans lien

| champ | contenu |
|---|---|
| **Verdict** | `DÉFAUT` (famille 11) |
| **Reproduction** | *Traiter*, V1 (détail en Partie 2). |
| **Observé (mesuré)** | Ligne « **Désintensifier : alléger / arrêter le sulfamide, le glinide ou réduire l'insuline — à renseigner : Espérance de vie, Risque hypoglycémique du schéma** » à y = 3831 px. Le champ « Espérance de vie » est à y = 1624 px. **Écart : 2207 px ≈ 2,8 écrans de 800 px.** Le nom du critère n'est **pas** cliquable (texte simple dans `decision-node__en-attente-item`). |
| **Pourquoi ça compte** | Pour répondre, il faut remonter de trois écrans, retrouver le champ à l'œil, puis redescendre de trois écrans pour lire le résultat. Sur une option de **désintensification** chez une patiente qui fait des malaises, c'est le geste le plus important de l'écran. |

### D-17 — Cocher un critère fait passer derrière le repli des cartes déjà affichées

| champ | contenu |
|---|---|
| **Verdict** | `DÉFAUT` (famille 10) |
| **Reproduction** | *Alimentation*, profil P3 (boissons sucrées *Quotidien*, ultra-transformés *Quotidien*, restauration rapide *Fréquent*, matière grasse *Beurre*, repas *Irréguliers*, grignotage *Quotidien*, fruits à coque *Jamais*, légumineuses *Jamais*, poisson *Jamais*). Puis cocher **Fragilité**. Puis, séparément, cocher **Signes d'appel d'un trouble du comportement alimentaire**. |
| **Observé** | Avant : 5 cartes dépliées, dont « Ajouter un plat de légumineuses de plus par semaine » et « Ajouter un repas de poisson de plus par semaine » ; repli « **Autres pistes possibles (5)** ». Après **Fragilité** : « Ajouter un repas de poisson… » **a disparu de la liste visible** et se retrouve dans « Autres pistes possibles (**6**) ». Après **Signes d'appel TCA** : « Ajouter un plat de légumineuses… » disparaît à son tour → « Autres pistes possibles (**7**) ». Aucun signal, aucune animation, aucun message. |
| **Ce qui est conforme (P3)** | Les cartes d'**orientation** restent **hors repli** dans les deux cas : « **Orientation — gestes cumulables / Orienter vers le diététicien de la structure / Recommandée** » (Fragilité), puis « **Orienter vers le diététicien de la structure** » **et** « **Proposer aussi un avis spécialisé en trouble du comportement alimentaire** » (TCA). Le texte du repli le promet explicitement : « Les gestes de sécurité et le socle ne sont jamais repliés. » Et avec **2 pistes seulement** (boissons sucrées *Quotidien* seul), **aucun bouton de repli n'apparaît** — conforme. |
| **Pourquoi ça compte** | Le praticien annonce une piste au patient, coche une case, et la piste n'est plus à l'écran. Il ne peut pas savoir qu'elle a été repliée plutôt que retirée. |

### D-18 — « Autres facteurs de risque cardiovasculaire » : un nombre sans définition

| champ | contenu |
|---|---|
| **Verdict** | `DOUTE` |
| **Reproduction** | *Statine*, formulaire vierge. |
| **Observé** | Le champ complet, verbatim : « **Autres facteurs de risque cardiovasculaire · sans effet sur la reco actuelle** » — un champ **numérique**, `placeholder="—"`, sans unité, sans liste, sans aide. |
| **Pourquoi ça compte** | Un fumeur, hypertendu, avec antécédent familial : est-ce 1, 2 ou 3 ? Le décompte pilote la ligne « Discuter la statine (décision partagée) — diabète non compliqué à faible risque absolu ». Deux médecins entreront deux nombres différents pour le même patient. |

### D-19 — Deux rendus différents pour « ce critère n'est plus décisif »

| champ | contenu |
|---|---|
| **Verdict** | `DOUTE` (mineur) |
| **Reproduction** | *Traiter*, intention **Initier**, HbA1c 9/7 : renseigner DFG **80** et IMC **32**. |
| **Observé** | Avant : « Infections génito-urinaires récidivantes **· à confirmer** » et « Préférence vis-à-vis de l'injectable **· sans effet sur la reco actuelle** ». Après : « Infections génito-urinaires récidivantes » (plus **aucune** mention) et « Préférence vis-à-vis de l'injectable **· à confirmer** ». Même chose sur *Statine* : « Statine déjà en place · à confirmer » perd sa mention quand l'intolérance passe à « Non ». |
| **Pourquoi ça compte** | Un champ sans mention se lit comme « renseigné », un champ « sans effet » comme « inutile ». Le même état interne produit les deux, et l'absence de mention est justement celle qui fait croire qu'on a répondu. |

### D-20 — Répondre à une question augmente le nombre de critères manquants

| champ | contenu |
|---|---|
| **Verdict** | `DOUTE` (mineur) |
| **Reproduction** | *Fixer la cible d'HbA1c*, vierge → « Reco provisoire — **4 critères décisifs non confirmés** ». Cliquer « Espérance de vie = **Longue** ». |
| **Observé** | « Reco provisoire — **5 critères décisifs non confirmés** ». (Âge et Ancienneté du diabète, jusque-là « sans effet sur la reco actuelle », deviennent décisifs.) |
| **Pourquoi ça compte** | Le seul indicateur de progression de l'écran recule quand on avance. |

### D-21 — « Déprescrire » ne propose que des ajouts

| champ | contenu |
|---|---|
| **Verdict** | `DOUTE` |
| **Reproduction** | *Traiter* : intention **Déprescrire (alléger ou retirer un traitement)**, HbA1c 11 / cible 7, position « À l'objectif », rien d'autre. |
| **Observé** | « EN ATTENTE — CRITÈRES À RENSEIGNER POUR TRANCHER : *Metformine (socle du traitement) — instaurer ou poursuivre* · *Introduire un iSGLT2…* · *Introduire un AR GLP‑1…* · *Introduire le tirzépatide…* · *Association iSGLT2 + AR GLP‑1…* » — cinq lignes, **cinq ajouts**, zéro allègement. |
| **Pourquoi ça compte** | La seule liste offerte à qui vient déprescrire est une liste de prescriptions. C'est cohérent avec le moteur (rien n'est coché, donc rien à retirer), mais l'écran ne le dit pas. |

---

# Partie 2 — Les trois axes de consultation

## Matériel : ce que les vignettes n'ont pas pu entrer

| Vignette | Nœud | Valeurs de la vignette **sans champ** dans l'outil | Champs de l'outil **sans valeur** dans la vignette |
|---|---|---|---|
| **V1** Mme R., 64 ans | Traiter | HTA traitée ; « malaises en fin de matinée depuis un mois » (traduit de force en la case *Hypoglycémie récente*) ; ancienneté 9 ans | HbA1c **cible** ; Albuminurie ; Espérance de vie ; Risque hypoglycémique du schéma ; Fragilité |
| **V2** M. B., 71 ans | Insulinothérapie | « vit seul » ; « glycémies capillaires entre 1,10 et 1,30 » (un seul nombre acceptable → 1,2) ; ancienneté 2 ans d'insuline | **TBR**, **TBR sévère**, **Coefficient de variation** (pas de capteur), **Profil AGP**, **Poids**, HbA1c cible, Espérance de vie, Hypoglycémies sévères |
| **V3** M. K., 55 ans | Statine | **LDL 1,42 g/L** (aucun champ — parti pris assumé du nœud), tabagisme (→ « Autres FdR = 1 », cf. D-18), IMC 34, HbA1c 7,6 | Dialyse, Diabète compliqué, CK |

## Axe A — Ergonomie de saisie

| Mesure | V1 · Traiter | V2 · Insulinothérapie | V3 · Statine |
|---|---|---|---|
| **Interactions jusqu'à la 1re carte utile** (clics + champs tapés) | **12** (7 clics : Optimiser, Metformine, Sulfamide, « Au-dessus de l'objectif », 2 × « Rien à signaler », Hypoglycémie récente + 5 champs : dose 2000, HbA1c 8,4, DFG 52, IMC 31, âge 64) | **8** (3 clics : Basale seule, Metformine, Insuline basale + 5 champs : âge 71, HbA1c 8,9, DFG 61, glycémie à jeun 1,2, dose basale 38) | **7** (4 clics : maladie CV, 2 × « Rien à signaler », Intolérance = Non + 3 champs : âge 55, ancienneté 0, autres FdR 1) |
| **Champs minimum avant que quelque chose s'affiche** | 6 (dont *intention*, obligatoire) | **4** — situation + HbA1c actuelle + HbA1c cible + glycémie à jeun. ⚠ 2 des 4 étaient **pré-remplies par la session** ; en pratique 2 gestes ont suffi | 4 |
| **Champs au total dans le nœud** | **22** (vierge) | **22** (vierge) → **20** en « Basale seule » → **13** en « Naïf d'insuline » | 9 |
| **Hauteur du formulaire seul** (1280 px) | 1 700 px = **2,1 écrans** | 1 261 px = **1,6 écran** (865 px en « Naïf ») | 1 190 px |
| **Hauteur totale de la page, saisie faite** | **4 135 px = 5,2 écrans** | 2 584 px = 3,2 écrans | ~1 800 px |
| **Position de la 1re carte** | y = **2 354 px** → il faut faire défiler **~2,9 écrans** avant la première recommandation | y = 1 838 px | y ≈ 950 px |
| **Même chose à 459 px de large** (V1) | doc **6 581 px = 6,6 écrans** ; formulaire seul **2 406 px = 2,4 écrans** ; 1re carte à y = **3 765 px (3,8 écrans)** ; **aucun débordement horizontal** | — | — |
| **Mots par carte** (V1) | 29 · 30 · 42 · 66 · **100** · **114** — médiane 54 | — | 87 |
| **Cartes affichées d'un coup, maximum** | **6** (5 dépliées + 1 repliée) | 3 (cf. D-04) | 1 |

**A-3, le tri qui compte.**

- **Sous les yeux** (dossier ouvert / biologie récente) : HbA1c actuelle, DFG, âge, traitements en cours, dose de metformine, maladie CV établie, insuffisance cardiaque, albuminurie, ancienneté du diabète, dialyse, statine déjà en place, glycémie à jeun, dose de basale.
- **À aller chercher** (autre logiciel, rappeler le labo, repeser) : **IMC** et **Poids** (si le patient n'a pas été pesé ce jour), **CK** (rarement dosées d'emblée), **cétonémie**, **albuminurie** si le bilan date.
- **Qu'il n'a tout simplement pas** : **TBR**, **TBR sévère**, **Coefficient de variation glycémique**, **Profil glycémique (lecture AGP)** — quatre champs qui supposent un capteur ; **Espérance de vie** (Longue / Intermédiaire / Limitée) ; **Autres facteurs de risque cardiovasculaire** en tant que **nombre** (D-18) ; **HbA1c cible** quand elle n'a jamais été formalisée avec le patient. Sur V2, cela fait **5 champs sur 20 impossibles à remplir** — dont ceux qui commandent le garde-fou de sur-titration (D-14).

**A-4, le premier champ.** Oui, et c'est bien fait : *Traiter* ouvre sur « Intention thérapeutique (« je souhaite… ») **· détermine la suite** » et *Insulinothérapie* sur « Situation d'insulinothérapie **· détermine la suite** ». La mention est en tête de page, sur le premier champ, dans un ton distinct. On ne la cherche pas. En revanche elle ne **dit pas** ce qu'elle verrouille (D-12).

**A-5, le droit à l'erreur.**
- Bouton segmenté cliqué par erreur : **on ne peut pas revenir à « pas répondu »** — on ne peut que choisir une autre valeur. Vérifié sur « Par rapport à l'objectif » et « Intolérance aux statines » : recliquer le bouton actif le laisse `aria-pressed="true"`.
- Champ chiffré re-vidé : **NON REPRODUIT** (limite d'outil, cf. en-tête).
- « Rien à signaler » : répond « non » à **tous les drapeaux encore vides** de sa section (6 d'un coup sur *Traiter*), **préserve** ceux déjà cochés, **disparaît** après le clic et **ne dit jamais lesquels** il a répondus. Irréversible : D-11.

**A-6, la stabilité sous les doigts.** Trois déplacements notés pendant la saisie : (1) le choix de l'intention retire ou ajoute jusqu'à **3 champs** au milieu du formulaire (D-12) ; (2) « Naïf d'insuline » fait **fondre le formulaire de 1 261 à 865 px** d'un clic ; (3) le bandeau de contrainte s'insère **en tête** et pousse tout de 60 px (D-15). S'y ajoute le repli qui avale des cartes déjà lues (D-17).

**Phrase carrée.** *Statine* et *Fixer la cible* sont remplissables en consultation de 15 minutes sans hésiter. *Traiter* passe, à 12 interactions et 5 écrans, **à condition d'accepter de laisser des trous**. **J'abandonnerais sur *Insulinothérapie*, exactement au champ « TBR — temps sous 70 mg/dL (%) »** : c'est le premier des quatre champs d'affilée que je ne peux pas remplir, et à ce moment-là je suis au deuxième écran, j'ai déjà donné huit valeurs, et je découvre que l'option qui m'intéresse (« ne pas sur-titrer la basale ») ne se débloquera jamais.

## Axe B — Lisibilité et compréhension de la réponse

**Le test des 20 secondes.** Méthode employée, faute de pouvoir « détourner le regard » : j'ai lu **uniquement le premier écran de résultats** (ce qui tient dans 800 px sous le titre « OPTIONS APPLICABLES »), écrit (a)/(b)/(c), puis relu la page entière et comparé.

| | V1 · Traiter | V2 · Insulinothérapie | V3 · Statine |
|---|---|---|---|
| **(a) ce que je prescris** — écrit à chaud | « metformine, ajouter un iSGLT2 » | « ajouter un GLP-1, et un bolus » | « une statine, intensité modérée » |
| **(b) ce que je surveille** | — *rien retenu* | — *rien retenu* | — *rien retenu* |
| **(c) ce que je ne dois surtout pas faire** | — *rien retenu* | — *rien retenu* | — *rien retenu* |
| **Manqué à la relecture** | **« Réduire la posologie du sulfamide (tolérance, hypoglycémie légère) — Recommandée »**, la seule carte qui répond au motif de consultation (les malaises), placée **en 5ᵉ position, sous trois cartes d'ajout** ; l'option de **désintensification** en attente 2 200 px plus bas ; « CONTRE‑INDIQUÉE si DFG < 30 » (DFG = 52, donc non pertinent, mais illisible en diagonale) | Que **« Ajouter un bolus »** et **« Ajouter un GLP-1 »** sont donnés « à égalité » sans départage ; que l'écran **recommande d'intensifier** un patient dont la sur-titration ne peut pas être évaluée | Que la carte dit « **intensité modérée — haute si risque très élevé** » : le choix de l'intensité **m'est renvoyé**, sans critère |
| **Verdict** | (b) et (c) sont **vides** dans les trois cas. L'écran ne produit pas, en un coup d'œil, de conduite à tenir de surveillance ni d'interdit. | | |

**B-1, hiérarchie (mesurée sur les styles calculés + capture).** Ordre réel de saillance dans une carte : ① **titre** 17 px / graisse 700, texte le plus foncé ; ② **badges** 11 px / 700 sur fond coloré plein — « Recommandée » en pastille sombre, « Preuve modérée » en pastille bleu clair ; ③ la ligne bleue cliquable « **Effet attendu, délai, avantages et inconvénients** » (13,6 px / 600, couleur d'accent) ; ④ « **Contre-indications :** » — libellé 13 px / 700 **gris**, suivi d'un paragraphe 13 px / 400 **gris**, sans bordure, sans fond, sans icône ; ⑤ « Proposé parce que » 13 px / 400, la couleur la plus pâle de la carte.
**Le paragraphe de contre-indications est donc le bloc le moins saillant de la carte, après le badge « Recommandée » et après un lien décoratif.** Le paragraphe d'effet attendu (`option-card__effet`, couleur turquoise, graisse 600) est en revanche **plus saillant que les contre-indications** dès qu'on déplie — ce qui est l'inversion exacte visée par la question B-1.

**B-2, le départage.** « **À ÉGALITÉ — MÊME NIVEAU DE PRIORITÉ.** » est un séparateur en petites capitales, **sans aucun autre contenu** : pas de critère, pas de « préférer si… », pas de renvoi. Vu trois fois (Alimentation, Activité physique, Insulinothérapie où il sépare « Ajouter un GLP-1 » de « Ajouter un bolus » — deux gestes de coût et de contrainte très différents). **Ce que fait le praticien à cet instant : il choisit le premier de la liste**, parce que rien d'autre ne lui est offert.

**B-3, les badges.** Sur V1, la carte « Metformine (socle du traitement) » porte simultanément « **Recommandation officielle (France)** » et « **Preuve faible** » ; sur *Activité physique*, quatre cartes portent « **Recommandée** » + « **Preuve faible** ». Les deux badges ont **la même taille, la même graisse et la même forme** ; seul le fond diffère. Un lecteur pressé lit « Recommandée » et ne pondère pas. Aucun glossaire, aucune infobulle sur « Preuve faible / modérée / élevée » n'est accessible depuis la carte.

**B-4, le vocabulaire de la preuve.** Il est **derrière le pli** « Effet attendu, délai, avantages et inconvénients », donc jamais lu en 30 secondes ; une fois déplié, ce sont des puces du type « Pas de bénéfice sur critère dur démontré vs placebo (…) ». Honnêtement : **c'est du texte qu'on saute** en consultation, et c'est probablement le bon endroit pour lui (hors du chemin), à condition que la conduite à tenir, elle, soit ailleurs — ce qui n'est pas le cas (voir B-6).

**B-5, le volume.** V1 : **6 cartes**, 29 à 114 mots chacune, **381 mots de cartes** + **~180 mots** des deux paragraphes de cadrage qui les précèdent (dont un de 118 mots, « Position déclarée AU-DESSUS de l'objectif, avec une intention d'OPTIMISATION : … »). Une carte occupe 150 à 228 px en 1280, **232 à 463 px en 459** — soit, sur écran étroit, **jusqu'à la moitié d'un écran pour une seule carte**.

**B-6, ce qu'on emporte.** Non : il n'y a **aucun résumé, aucune synthèse, aucun bouton de copie**. Pour dicter deux lignes dans le dossier, il faut les fabriquer soi-même à partir de 6 titres de cartes, en écartant les 3 qui sont des variantes d'un même geste. Le pied de page ne propose que « Déplier l'argumentaire ».

**B-7, la distance à l'objet.** Mesurée : **2 207 px** entre « à renseigner : Espérance de vie » et le champ (D-16) ; **848 px** entre la contrainte TBR et le champ TBR sévère (D-15). Aucun de ces renvois n'est cliquable.

## Axe C — Fidélité au raisonnement de consultation

**C-1, l'ordre des questions.** Non, je n'ai **pas** pu répondre à « Intention thérapeutique » avant d'avoir réfléchi au reste, sur V1. Mme R. arrive avec des **malaises** : je ne sais pas encore si je veux *optimiser* (retirer le gliclazide) ou *intensifier* (HbA1c 8,4). J'ai dû **trancher pour pouvoir entrer**, et j'ai choisi « Optimiser » — ce qui a **immédiatement fermé** toute la palette d'intensification, comme l'écran l'explique lui-même dans un paragraphe de 118 mots (« … ne propose donc aucune INTENSIFICATION GLYCÉMIQUE (la palette d'intensification est commandée par l'intention, pas par la position) … »). Ce paragraphe est bien écrit et honnête ; il n'en reste pas moins que **la conclusion est demandée en entrée**. Et se tromper coûte cher : changer d'intention **efface les traitements en cours, la dose et les drapeaux révélés, sans avertissement** (D-12).

**C-2, trancher avant de savoir.** Quatre endroits relevés : ① « Intention thérapeutique » (C-1) ; ② « **Par rapport à l'objectif fixé pour ce patient** », qui suppose qu'une cible a été fixée — alors que le nœud *Fixer la cible d'HbA1c* existe précisément pour ça, et que rien ne relie les deux ; ③ « **Espérance de vie** (Longue / Intermédiaire / Limitée) » — la question la plus lourde du formulaire, posée sans support, avec seulement « Suggestion auto (âge, fragilité, comorbidité grave, antécédent CV) — à valider » ; ④ sur *Statine*, « intensité modérée — **haute si risque très élevé** » : la carte renvoie au praticien l'évaluation du risque, qui est ce qu'il venait chercher.

**C-3, le coût du découpage en six nœuds — chiffré.**

| Trajet | Critères communs aux deux nœuds | Repris automatiquement | **À ressaisir à l'identique** |
|---|---|---|---|
| **V2 : Traiter → Insulinothérapie** | Âge, HbA1c actuelle, HbA1c cible, DFG, Fragilité, Espérance de vie, Risque hypoglycémique du schéma, Symptômes de glucotoxicité, Traitements en cours (9 cases), Préférence vis-à-vis de l'injectable = **10** | 2 (HbA1c actuelle, HbA1c cible) | **8** |
| **V3 : Statine → Alimentation (RHD)** | **0** — les deux nœuds n'ont **aucun** critère en commun (Statine : âge, maladie CV, ancienneté, autres FdR, diabète compliqué, dialyse, statine en place, intolérance, CK ; Alimentation : fragilité, traitements en cours, 15 items d'habitudes) | 0 | **0** |

Le trajet V3 ne coûte donc rien en frappe — mais il ne fait rien gagner non plus : les deux nœuds ne se parlent pas du tout, et le patient doit être redécrit intégralement d'un point de vue à l'autre. Le trajet V2, lui, coûte **8 valeurs retapées**, dont la ligne de traitement complète.

**C-4, le point d'entrée.** La liste parle plutôt la langue de la consultation : « **Traiter : initier, optimiser, intensifier** », « **Fixer la cible d'HbA1c** », « **Prescrire une statine dans le DT2** ». Le module RHD va plus loin et pose explicitement la question du praticien — « **Quel levier travailler avec ce patient aujourd'hui ?** », avec pour chaque axe trois amorces (« Le patient décrit spontanément ce qu'il mange, ou vous demande « quoi manger ». ») : c'est **le meilleur écran d'entrée de l'application**, et le seul construit ainsi. À l'inverse, « **Insulinothérapie du DT2 : Initier, optimiser, intensifier** » est un titre de chapitre, et rien ne dit qu'un patient sous basale relève de *ce* nœud plutôt que de *Traiter*, dont le titre contient les mêmes trois verbes.

**C-5, le périmètre dit au bon moment.** V2 : **à moitié**. L'outil dit la bonne chose (« Sans MCG : titrer la basale sur la glycémie à jeun (cible ~0,70-1,20 g/L) … ») **et** laisse le praticien devant quatre champs de capteur, une ligne « À renseigner dans cette section : TBR…, TBR sévère…, Coefficient de variation… » et deux options gelées à jamais (D-14). Le message arrive **après** le formulaire, pas au moment où l'on bute.

**C-6, l'actionnabilité.** Bonne dans l'ensemble : les cartes nomment les molécules et les doses (« atorvastatine 10-20 mg », « Bolus initial (~10 % de la basale) ≈ **4 U** » — le calcul de dose fonctionne et s'affiche), et signalent ce qui sort du cabinet (« tirzépatide (obésité — **prescription spécialisée** ) », « **Avis spécialisé URGENT et évaluation hospitalière** », « Orienter vers le **diététicien de la structure** »). Deux réserves : le remboursement est daté et conditionné (« REMBOURSEMENT FR de l'acide bempédoïque : effectif depuis le 12/12/2025, à 65 %, dans un périmètre RESTREINT… »), ce qui est précieux mais long ; et « haute si risque très élevé » n'est pas actionnable tel quel.

**C-7, la question qu'un médecin poserait et qu'il ne peut pas poser.** *« Ce patient-là, aujourd'hui : par quoi je commence ? »* L'outil répond option par option, chaque carte plaidant sa propre cause, avec « à égalité » quand il y en a plusieurs et un plafond de 5 quand il y en a trop. Il ne classe jamais **les cartes entre elles** au regard du motif de consultation. Sur V1, la carte qui répond aux malaises de Mme R. est la cinquième, sous trois propositions d'ajout de traitement.

---

# Partie 3 — Familles de défaut candidates (§4bis)

Trois familles, chacune avec au moins deux occurrences observées sur des nœuds différents.

### F-A — « Le drapeau non répondu vaut *non* »

**Occurrences** (quatre, sur quatre nœuds) : ① *Activité physique* vierge → 4 cartes « Recommandée » justifiées par « Interrompt habituellement les longues périodes assises : **non** » et « Offre d'activité de proximité connue : **non** » (D-01). ② *Fixer la cible* → « Cible ~6,5 % » justifiée par « Antécédent cardiovasculaire : **non** et Comorbidité grave : **non** et Fragilité : **non** », les trois portant « · à confirmer » dans le formulaire (D-02). ③ *Statine* → « … et Statine déjà en place : **non** », idem (D-02). ④ *Insulinothérapie* → l'alerte « Sans MCG » se déclenche sur un « MCG disponible · à confirmer » jamais touché.

**La propriété qui les produit** : le moteur ne connaît que deux états pour un critère booléen (présent / absent) et lit l'absence comme une négation, tandis que la couche d'affichage en connaît **trois** et étiquette le même critère « · à confirmer » et « critère décisif non confirmé ». Les deux vues coexistent dans la même page, et c'est la plus affirmative des deux qui alimente les cartes.

### F-B — « La contrainte de sécurité est affichée, jamais opposable »

**Occurrences** (trois, sur deux nœuds) : ① *Insulinothérapie*, TBR 1 / TBR sévère 95 → le message d'impossibilité s'affiche et **trois cartes « Recommandée » subsistent**, dont deux contradictoires entre elles (D-04). ② *Statine*, CK 60 → l'alerte « Ce n'est plus la séquence d'interruption-réintroduction décrite ci-dessus » est logée **à l'intérieur** de la carte dont le titre décrit cette séquence, qui reste « Recommandée » (D-05). ③ *Traiter*, V1 → le paragraphe de cadrage explique que l'outil ne proposera « aucune INTENSIFICATION GLYCÉMIQUE » puis fait suivre trois cartes « Introduire… » que le paragraphe doit lui-même désamorcer sur quatre lignes.

**La propriété qui les produit** : alertes, contraintes et cadrages sont un **canal d'affichage parallèle** à la sélection des options. Rien dans l'architecture ne permet à un fait de sécurité de **retirer** une carte ou d'en réécrire le titre ; il ne peut que s'ajouter à côté, et la carte garde son badge.

### F-C — « L'état de session survit au patient »

**Occurrences** (trois, sur deux nœuds) : ① HbA1c 7,8 / 7 saisies pour le patient de P0-b, retrouvées deux vignettes plus tard en ouvrant *Traiter*. ② HbA1c 8,4 (Mme R.) reprises à l'ouverture d'*Insulinothérapie* pour M. B., marquées « · repris de votre saisie ». ③ La cible 7 de Mme R. entre alors dans le raisonnement affiché pour M. B. : « Proposé parce que : … et **HbA1c à la cible : non** … » (D-13).

**La propriété qui les produit** : la mémoire de session est attachée à **l'onglet**, pas à un épisode de soin, et l'application n'expose **aucun geste de fin de consultation** — pas de « nouveau patient », pas de « effacer ». Sortir d'un nœud remet le formulaire à zéro *sauf* pour les critères partagés ; seule la touche F5, que rien ne mentionne, coupe le fil. Toute donnée déclarée « partagée » à l'avenir héritera du même défaut.

---

# Clôture

## 1. Les trois points les plus graves, classés

**① D-01 + F-A — un formulaire vierge recommande (Activité physique), et trois autres nœuds affirment des faits non déclarés.**
C'est la régression du correctif que le projet présente comme majeur (« l'outil ne se prononce pas sur ce qu'il ignore »). Sur *Activité physique*, il suffit d'ouvrir le nœud pour obtenir quatre gestes « Recommandée » dont une orientation vers une structure d'APA. Sur *Fixer la cible*, le mécanisme produit une **cible serrée à 6,5 %** chez un patient dont la fragilité, l'antécédent cardiovasculaire et la comorbidité grave n'ont pas été renseignés — exactement le patient chez qui la HAS demande de relâcher. Le compteur « 3 critères décisifs non confirmés » est affiché sur la même page que la carte : l'application se contredit à un écran d'intervalle.

**② D-13 + F-C — la mémoire de session traverse les patients et entre dans le raisonnement affiché.**
Deux valeurs seulement circulent, mais ce sont l'HbA1c actuelle et sa cible, et elles pilotent « HbA1c à la cible : non », donc l'intensification. Rien dans l'interface ne permet de repartir à zéro : ni bouton, ni message, ni indication que F5 est le seul moyen. C'est le seul défaut de la passe capable de faire prescrire sur les données d'un autre patient.

**③ D-03, D-04, D-05 + F-B — la sécurité s'affiche mais ne retire jamais rien.**
Une saisie déclarée impossible produit trois cartes « Recommandée » dont « réduire la dose » et « ajouter un bolus » ensemble (D-04). Une carte titrée « Interrompre 4 à 6 semaines et réévaluer / Recommandée » contient l'alerte qui dit que ce n'est plus la conduite (D-05). Et au bout de la chaîne, le seul patient à qui l'outil ne dit **rien du tout** est celui qui en a le plus besoin : prévention secondaire, intolérance avérée (D-03).

## 2. Le verdict du dernier lot — les six lignes de P0

- **P0-a — `CONFORME` à 5 nœuds sur 6.** Les 29 critères RHD sont rédigés et accentués, valeurs de boutons segmentés comprises ; seul le **cadrage du nœud Statine** expose encore trois identifiants entre accents graves (`statine_deja_en_place`, `intolerance_statine`, `incertitudes`) — D-09.
- **P0-b — `CONFORME`, les deux volets.** Sur le profil exact du protocole, le bloc « En attente » ne mentionne plus jamais « Nature de l'intolérance » (il ne réclame que « Dose de metformine (mg/j) ») ; et cocher l'intolérance fait **réellement apparaître** le champ « Nature de l'intolérance · à confirmer » avec ses six valeurs.
- **P0-c — `CONFORME`.** Cocher Metformine fait apparaître « Dose de metformine (mg/j) » ; la décocher le retire **et** retire l'option « Réduire la posologie de la metformine » du bloc en attente — plus rien ne réclame la dose.
- **P0-d — `CONFORME` pour l'affichage, `DÉFAUT` pour l'effet.** Le message de contradiction TBR s'affiche, bien rédigé — mais 848 px au-dessus du champ (D-15), et **sans retirer les trois cartes « Recommandée »** qu'il devrait invalider (D-04). Le second volet (Initier + traitement coché) est **impossible à monter** : le champ disparaît (D-12).
- **P0-e — `CONFORME`.** Le plafond de 5 agit (repli « Autres pistes possibles (N) » à partir de la 6ᵉ, absent à 2 pistes) et **n'attrape jamais** une carte d'orientation ni une carte de sécurité : diététicien et avis spécialisé TCA restent hors repli dans les deux scénarios demandés. Réserve : le repli **avale des cartes déjà affichées** quand on coche un critère (D-17), et le libellé « Ces **1** pistes » est cassé (D-10).
- **P0-f — `CONFORME`.** Vérifié par `javascript_tool` sur le groupe « Par rapport à l'objectif » : les quatre boutons sont `aria-pressed="false"` tant que rien n'a été répondu ; après clic, le bouton choisi passe à `aria-pressed="true"` avec `data-on="true"` et les trois autres restent à `"false"`. Mais le pré-remplissage calculé, lui, n'a **jamais** produit de `true` (D-06) : ce que l'écran annonce n'est pas ce que le moteur croit, et ce n'est pas non plus ce qu'un lecteur d'écran entendrait.

## 3. Ce que je n'ai pas pu tester, et pourquoi

1. **Re-vider un champ chiffré** (famille 9) — `BackSpace`/`Delete` ne parviennent pas à la page dans cet environnement, vérifié par un test de contrôle. **NON REPRODUIT.** À rejouer à la main : c'est un geste de consultation courant.
2. **La largeur 375 px** — le volet plafonne à 459 px de viewport CSS. Mes chiffres « étroit » **sous-estiment** le défilement réel d'un téléphone ; sur un vrai 375 px, V1 dépassera vraisemblablement 8 écrans.
3. **La hiérarchie visuelle au coup d'œil** — deux captures seulement ont pu être prises. Les conclusions de l'axe B-1 reposent sur les styles calculés (taille, graisse, couleur, fond) et sur ces deux captures, pas sur une impression rétinienne.
4. **P0-d, second volet** — impossible par construction (D-12).
5. **L'argumentaire déplié** (« Déplier l'argumentaire ») et le module **Veille** — hors périmètre de cette passe, non ouverts.
6. **Le nœud *Activité physique* joué complètement** — je l'ai ouvert, scanné et constaté D-01, mais je n'ai pas déroulé de vignette complète dessus, faute de temps. Compte tenu de D-01, **c'est le nœud à jouer en priorité à la prochaine passe.**

## 4. Impression d'ensemble, en praticien

Oui, j'ouvrirais *Prescrire une statine* et *Fixer la cible d'HbA1c* en consultation : ils sont courts, honnêtes, et le nœud statine explique mieux l'intolérance rapportée que ce que j'aurais dit de tête. J'ouvrirais *Traiter* en fin de journée, pas entre deux patients. Le module RHD a le meilleur écran d'entrée de toute l'application.

**J'ai décroché sur *Insulinothérapie*, au champ « TBR — temps sous 70 mg/dL (%) », vers la 40ᵉ seconde** : c'est le deuxième écran, j'ai donné huit valeurs, et je tombe sur quatre champs d'affilée qui supposent un capteur que M. B. n'a pas. Le message « Sans MCG : titrer sur la glycémie à jeun » qui me le dit se trouve **plus bas** que la ligne qui me réclame ces mesures — je l'aurais lu après avoir refermé l'onglet.

Et si j'avais dû ne retenir qu'une chose de cette passe : sur *Activité physique*, **je n'ai eu à faire aucun geste** pour obtenir quatre recommandations. Ce n'est pas un défaut d'ergonomie, c'est l'outil qui parle à la place du patient.
