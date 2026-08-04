# Recette « praticien naïf » — passe du 2026-08-04 (serveur de dev local, banc élargi à 26 vignettes)

> Banc témoin : [`vignettes-praticien-naif-2026-08-04.md`](vignettes-praticien-naif-2026-08-04.md)
> (26 vignettes : N1→N15 reprises du 2026-07-30, **N16→N26 nouvelles**, dont sept intolérances).
> Banc d'origine : [`vignettes-praticien-naif-2026-07-30.md`](vignettes-praticien-naif-2026-07-30.md).
> Passe précédente comparée : [`recette-praticien-naif-2026-08-02.md`](recette-praticien-naif-2026-08-02.md).

| | |
| --- | --- |
| **URL** | `http://localhost:49741`, puis `60891`, puis `5174` (dev Vite ; ports réattribués par autoPort, et deux relances en cours de journée — cf. limites d'outillage) |
| **Commit** | `c903e18` — *docs(plan) : P12 clos* (2026-08-03 14:46 +0200), branche `main`, **arbre SALE** : 52 fichiers modifiés + 1 nouveau (`docs/commun/decisions/2026-08-04-d48-…`), soit **la refonte D48 de l'argumentaire, non commitée**. C'est elle que cette passe regarde en premier. |
| **Heure** | 2026-08-04, passe complète en deux temps (vignettes nouvelles, puis non-régression de l'ancien banc) |
| **Fenêtre** | **1600 × 1000, deux colonnes** (`decision-node__body` mesuré : `grid-template-columns: 752,5 px 752,5 px`, `main` = 1585 px). Une seule largeur : cette passe ne fait **pas** le mobile. |
| **Auteur** | médecin généraliste, cabinet de groupe urbain, ~25 patients/jour, 15 min/consultation, pas de diabétologue à moins de 4 mois |
| **Console** | **aucune erreur ni avertissement** sur toute la passe (`[vite] connected` + invitation React DevTools, rien d'autre). |

## Couverture : 26 vignettes sur 26

**Jouées : N1 → N12, N13b, N14 → N26.**
**N13a** (M. Vasseur — metformine 1000 × 2 non supportée, diarrhées, DFG 89) **n'a pas été jouée
séparément** : elle est strictement recouverte par **N16** (même intolérance digestive à la metformine,
avec en plus un DFG contraignant). C'est la seule vignette du banc à ne pas avoir son écran propre.

La passe s'est déroulée en deux temps, et le rapport les fusionne :

1. **Les onze vignettes nouvelles (N16 → N26) + N14**, écrites pour élargir le banc aux intolérances.
2. **La non-régression de l'ancien banc (N1 → N13, N15)**, après la refonte D48 qui touche les six nœuds.

---

## Note de méthode — trois limites d'outillage, et un faux défaut qu'elles ont failli produire

**1. Le panneau navigateur rend l'écran à une échelle de 3,3125.** Les clics par référence (`ref_N`) et les
captures sont désynchronisés des coordonnées réelles. J'ai calibré le facteur par sonde
(`clic écran (400,300)` → `clientX/Y (1325,993)`), puis piloté le formulaire par **clics réels recalculés**
pour les deux premières vignettes, et par **clics programmatiques `element.click()`** ensuite. Comme le
2026-08-02 : cela ne change ni les comptages (je compte les gestes qu'un praticien ferait) ni les mesures
(géométrie, couleurs, textes lus dans le DOM rendu).

**2. Les captures d'écran ont cessé de fonctionner** à partir de la seconde moitié de la passe
(« *Screenshot timed out : the Browser pane is not displayed* »). Conséquence à retenir : **tout jugement
de hiérarchie visuelle, de saillance et de couleur porté dans ce rapport repose sur l'unique capture
exploitable de la première moitié** (celle de N14) et sur des mesures DOM. Les vignettes N1→N13 et N15
n'ont fait l'objet d'**aucun** jugement visuel.

**3. Un piège de React confirmé, rapporté ici parce qu'il invalide une méthode.** Grouper plusieurs
saisies dans un même appel de script **perd des valeurs** : en enchaînant `DFG · Albuminurie · Poids ·
Taille` dans un seul tick, seule l'albuminurie a été perdue silencieusement — le formulaire affichait
`DFG 58 · Poids 80 · Taille 1,65`, sans albuminurie, alors que le clic avait « réussi ». Les **suites de
champs numériques** passent sans perte (vérifié : 96 / 88 / 1,76) ; **tout clic sur un bouton segmenté a
donc été isolé**, et **l'état complet du formulaire relu avant chaque conclusion** — les résumés de
sections repliées sont le meilleur outil de contrôle du produit.

**4. ⚠ Le faux défaut évité — à lire, il concerne la lecture des rapports précédents.** J'ai cru, pendant
la moitié de la première session, que **« Nouveau patient » ne vidait plus rien** : après un clic, les
valeurs du patient précédent (M. Bouchard) étaient toujours là sur le nœud suivant. Vérifié à trois
reprises (clic réel aux coordonnées contrôlées dans le bouton, double-clic, `.click()` programmatique),
sans erreur console. **C'était faux, et c'était mon outillage.** Le bouton passe par un état
« Confirmer ? / Annuler » qui **expire au bout de ~2,6 s** — soit moins qu'un aller-retour de mes outils :
j'observais systématiquement l'état revenu au repos. Reproduit correctement avec un `MutationObserver`
armé avant le clic :

> `["… | Confirmer ? | Annuler | ?Invité", "… | Nouveau patient | ?Invité"]`

puis séquence complète (clic → 300 ms → clic sur « Confirmer ? ») :

> `avant: Session : 2 valeurs` → `etat2: Confirmer ?` → `apres: (compteur absent)`

**« Nouveau patient » fonctionne : CONFORME.** Ce paragraphe est ici parce que sans la règle « ne valide
jamais un point sans l'avoir reproduit », ce rapport ouvrait sur une régression grave inexistante.

**5. Le panneau s'est fermé en plein milieu de N11**, effaçant la session. N11 a été **rejouée
intégralement** depuis le premier clic ; aucun résultat partiel n'a été conservé.

---

# ⚠ À LIRE D'ABORD

## Le correctif qui domine la journée : la cible d'HbA1c ne change plus toute seule (N4)

**Le défaut le plus grave du 2026-08-02 est fermé.** Ce jour-là, sur M. Kervarec, revenir sur « Fixer la
cible » après avoir rempli « Traiter » faisait **revenir « Antécédent cardiovasculaire » décoché**,
recalculait l'espérance de vie en « Longue » et affichait **« Cible ≤ 7 % » badgée `Recommandée`** — chez
un coronarien pontagé dont la cible venait d'être fixée à ≤ 8 %, sans un mot.

**Reproduction exacte, aujourd'hui :** Fixer la cible (Âge 67 · Ancienneté 13 · ☑ Antécédent
cardiovasculaire · Rien à signaler) → `Cible ≤ 8 %` ; puis Traiter en entier ; puis retour sur Fixer la
cible → « Reprendre les valeurs de ce patient ». Résultat, verbatim :

> CRITÈRES DU PATIENT — **2 à confirmer**
> Âge · *repris de votre saisie* · Ancienneté du diabète (ans) · *repris de votre saisie*
> **Espérance de vie · à confirmer** · **Fragilité · à confirmer**
>
> **EN ATTENTE — CRITÈRE À RENSEIGNER POUR TRANCHER**
> **À renseigner pour trancher : Espérance de vie, Fragilité.**

**Aucune carte. Aucune cible annoncée.** L'outil ne se prononce plus sur un dossier amputé : il déclare ce
qui lui manque. Corrigé de la bonne manière — non pas en faisant circuler davantage de valeurs, mais en
refusant de conclure sans elles.

**Ce qui subsiste** (inchangé, mais sans conséquence sur la réponse) : l'antécédent cardiovasculaire reste
**deux critères distincts pour un seul fait clinique** — « Antécédent cardiovasculaire » (nœud cible) et
« Maladie cardiovasculaire athéromateuse établie » (nœud Traiter). Le coût est passé d'une réponse fausse à
**une troisième saisie**.

## 1. ⚠⚠ Le patient le plus urgent du banc reçoit une réponse fausse, et l'option qui le sauve disparaît de l'écran

**Vignette N25 — M. Bienvenu, 44 ans. HbA1c 11,4 %, glycémie 3,42 g/L, cétonurie ++, −8 kg, polyuro-polydipsie.**

Sur le nœud **Traiter**, intention *Initier*, avec **Symptômes de glucotoxicité = Oui** et
**Cétonémie = Oui** déclarés, l'écran affiche, verbatim :

> **Contrôler la cétonémie capillaire (β-hydroxybutyrate) : décompensation catabolique possible malgré une
> HbA1c non franchement élevée. ≥ 0,6 mmol/L → insuline d'initiation ; ≥ 3 mmol/L → urgence (insuline +
> hospitalisation).**
>
> **OPTIONS APPLICABLES · 1 option**
> **Socle du traitement — gestes cumulables**
> `Recommandation officielle (France)` **Ajouter · Metformine** `Preuve faible`
>
> **EN ATTENTE — CRITÈRES À RENSEIGNER POUR TRANCHER**
> À renseigner pour trancher : **Traitements en cours**.

Trois défauts se superposent :

- **L'alerte prescrit l'insuline, la seule carte prescrit la metformine.** L'écran dit deux choses
  contraires à 4 cm d'écart, et c'est la carte qui porte le badge.
- **L'option « Insuline d'initiation » n'est nulle part.** Vérifié par recherche sur le texte complet de
  la page : `document.body.textContent.includes("Insuline d'initiation")` → **`false`**. Elle n'est ni
  dans les options applicables, ni dans « Pourquoi pas d'autres options ? » (où elle figure pourtant chez
  d'autres patients, avec son motif — vu en N1 et N19). Elle ne se lit ni comme retenue, ni comme
  écartée : **elle s'évapore**.
- **Le critère qui bloque tout est INTROUVABLE dans le formulaire.** « À renseigner pour trancher :
  Traitements en cours » — or choisir l'intention *Initier* **supprime la section TRAITEMENT du
  formulaire**. Les sections affichées sont : JE SOUHAITE · TOLÉRANCE ET PRÉFÉRENCES · ÉQUILIBRE · CE QUI
  ORIENTE LE CHOIX · SIGNAUX D'ALERTE · TERRAIN. Le cartouche d'ouverture le réclame pourtant
  explicitement : « **Commencez par : Traitements en cours, DFG (mL/min/1,73 m²), Poids (kg)** ».

**Ce que ça coûte.** Ce patient, je le vois quatre fois par an. Si je suis l'écran, je lui donne de la
metformine et je le renvoie chez lui avec une cétonurie ++. Et je ne peux pas débloquer l'outil, puisque
le champ qu'il réclame n'existe plus.

**En contrepoint, et c'est ce qui rend le défaut réparable** : le nœud **Insulinothérapie** répond
parfaitement au même patient (`Naïf d'insuline`, HbA1c 11,4, cible 7, DFG 88, poids 83, glucotoxicité oui) :

> `Recommandée` **Ajouter · Initier une insuline basale** `Preuve modérée`
> Posologie : **Doses indicatives : Dose initiale (0,1 U/kg) ≈ 8 U/j · Dose initiale (0,2 U/kg) ≈ 17 U/j**
> `Recommandée` **Ajouter · Envisager un GLP-1 avant ou avec l'insuline** `Preuve modérée`
> — *Priorité EBM : épargner l'insuline tant qu'un GLP-1 est possible*

La bonne réponse, chiffrée sur le poids réel, existe **à un nœud de distance**. Rien sur l'écran `Traiter`
ne m'y envoie.

## 2. ⚠⚠ « Metformine écarté : Traitements en cours comprend Metformine et DFG ≥ 45 et DFG < 60 et Dose de metformine > 2000 ou … »

**Reproduit sur trois patients différents (N16 M. Bouchard, N18 M. Delaunay, N5 M. Traoré).** Sous les
cartes, en clair, sans rien déplier, le nœud `prescription` affiche **verbatim** :

> **Metformine écarté : Traitements en cours comprend Metformine et DFG (mL/min/1,73 m²) ≥ 45 et DFG
> (mL/min/1,73 m²) < 60 et Dose de metformine (mg/j) > 2000 ou Traitements en cours comprend Metformine et
> DFG (mL/min/1,73 m²) ≥ 30 et DFG (mL/min/1,73 m²) < 45 et Dose de metformine (mg/j) > 1000 ou
> Traitements en cours comprend Metformine et Intention thérapeutique (« je souhaite… ») ≠ Initier et
> Intolérance à un traitement en cours et Nature de l'intolérance comprend Digestive**

C'est **l'expression logique brute**, la famille de défaut n° 8, celle que P10 était censé avoir fermée.
Trois aggravants :

1. **Une seule des trois branches est vraie** chez ces patients. La règle « n'afficher que ce qui est vrai
   pour ce patient » n'est pas appliquée ici.
2. **Le mot « écarté » contredit la carte du dessus.** Sur le même écran, en tête, en zone « À faire
   d'emblée — sécurité » : `Mesure de sécurité` **Réduire · Metformine** `Preuve faible`. **« Metformine
   écarté » se lit « arrêtez la metformine ».**
3. Le motif cite « **Dose de metformine (mg/j)** », un critère que le cartouche « en attente » ne m'avait
   jamais nommé (il me disait « Commencez par : DFG, Poids, Taille »).

**Le défaut est circonscrit, et c'est ce qui rend le correctif court.** Les lignes d'écartement dont la
condition est **simple** sont parfaitement rendues, dans les mêmes écrans :

| Vignette | Ligne d'écartement affichée |
| --- | --- |
| N6 | « **Metformine écarté : DFG (mL/min/1,73 m²) < 30** » · « **iSGLT2 écarté : DFG (mL/min/1,73 m²) < 20** » |
| N7 | « **AR GLP‑1 écarté : IMC (kg/m²) < 22 et Dénutrition / carence** » |
| N14 | « **Statine de haute intensité — prévention secondaire écarté : Intolérance aux statines = Avérée** » |
| N15 | « **Metformine écarté : DFG < 30** » · « **Sulfamide écarté : DFG < 30** » |

Et le panneau « Pourquoi pas d'autres options ? » rend **la même option metformine** en français lisible :
« *Metformine — ne s'applique pas : ni Dose de metformine excessive pour ce DFG (45-59), ni Dose de
metformine excessive pour ce DFG (30-44), ni Intolérance digestive* ».

**Le défaut porte donc uniquement sur les conditions en disjonction de conjonctions, dans la ligne
d'écartement en place.** Une seule option du corpus est concernée (« réduire la posologie de la
metformine »), mais elle s'affiche chez **tout patient sous metformine avec une intolérance digestive ou
un DFG < 60** — soit une large part de la patientèle.

## 3. ⚠ « D'après : , DT2 prévention primaire) — composite HR 0,63 » : D48 rend visible un défaut de contenu vieux de deux semaines

La refonte D48 affiche pour la première fois `Option.references` à l'écran. Sur le nœud **statine**, ça
donne, verbatim (N26, carte « Statine — prévention primaire ») :

> **D'après : , DT2 prévention primaire) — composite HR 0,63 ; mortalité NS (p=0,059) (2004) · (simvastatine
> 40 mg) : −22 % ; sous-groupe prévention primaire −33 % (2003) · , sous-groupe diabète (18 686 diabétiques) :
> RR 0,79 par mmol/L (2008) · , DT2) — composite HR 0,90 NS ; prévention primaire HR 0,97 (nul) (2006) ·
> (treat-to-target vs dose fixe haute intensité) : NON-INFÉRIORITÉ (2023) · cardiovasculaire (méta, 27 essais) :
> bénéfice absolu petit à bas risque (2012)**

**Le nom de l'essai manque** — CARDS, HPS, CTT, ASPEN, LODESTAR — laissant des virgules et des parenthèses
fermantes orphelines. Source confirmée dans le contenu (`statine.yaml`, `sources.references_primaires`) :

```yaml
    - id: cards
      titre: ", DT2 prévention primaire) — composite HR 0,63 ; mortalité NS (p=0,059)"
    - id: hps
      titre: " (simvastatine 40 mg) : −22 % ; sous-groupe prévention primaire −33 %"
```

**19 titres sur 33 sont amputés, et seulement sur `statine.yaml`** (compté sur les six nœuds :
`cible-glycemique` 0/9, `insuline` 0/35, `prescription` 0/29, `rhd-*` 0/7 et 0/11). Le défaut **préexiste à
l'arbre de travail** (déjà présent à `cd776b9`, P10) — l'arbre sale n'en introduit aucun. Il était
simplement **invisible**, faute de rendu. C'est exactement le genre de dette que D48 devait faire sortir :
elle est sortie.

---

# Partie 1 — Défauts et non-régressions

## Défauts et doutes

| # | Verdict | Nœud / vignette | Le point en une ligne |
| --- | --- | --- | --- |
| **D1** | **DÉFAUT GRAVE** | prescription — N25 | « Insuline d'initiation » disparaît de l'écran chez un patient à cétonémie ; la seule carte est la metformine |
| **D2** | **DÉFAUT GRAVE** | prescription — N25 | Critère bloquant (« Traitements en cours ») réclamé alors que sa section est supprimée par l'intention *Initier* |
| **D3** | **DÉFAUT** | prescription — N16, N18, N5 | Ligne d'écartement en expression logique brute, et « Metformine écarté » sous une carte « Réduire Metformine » |
| **D4** | **DÉFAUT** | statine — N20, N26 | 19 titres d'essais amputés (« D'après : , DT2 prévention primaire) ») — rendu neuf D48, dette ancienne |
| **D5** | **DÉFAUT** | prescription — N19 | Un antécédent d'acidocétose sous iSGLT2 ne se déclare nulle part ; l'iSGLT2 reste `Recommandée · Preuve élevée` |
| **D6** | **DÉFAUT** | statine — N20 (CK > 50 N) | Le titre de la seule carte contredit son propre encart de sécurité |
| **D7** | **DÉFAUT** | rhd-activite-physique — N23 | Motif d'écartement générique nommant quatre signes possibles sans dire lequel s'applique |
| **D8** | **DÉFAUT** | prescription — N17 | Légende d'action affichant « Ajouter » alors qu'aucune carte de l'écran ne porte ce verbe |
| **D9** | **DÉFAUT** | cible-glycemique / prescription — N21 | Les hypoglycémies sévères récurrentes n'existent que sur `insuline` : cible ≤ 7 % à un chauffeur PL qui a fait deux malaises |
| **D10** | **DÉFAUT** | prescription — N21 | « Réduire · Sulfamide » `Recommandée` replié derrière « Autres pistes possibles (1) » chez ce même patient |
| **D11** | **DÉFAUT** | rhd-activite-physique — N23 | Rétinopathie proliférante déclarée : aucune alerte, aucun mot (la neuropathie, elle, en a une excellente) |
| **D12** | **DOUTE** | prescription — N21 | Le pré-remplissage « Par rapport à l'objectif » ne se fait plus : la cible fixée au nœud voisin n'arrive pas |
| **D13** | **DOUTE** | tous — N16, N20 | Le résumé de section n'énumère pas tous les drapeaux répondus par « Rien à signaler » |
| **D14** | **DOUTE** | prescription — N18 | Pastille « Posologie » sans posologie sur la carte « Réduire · AR GLP-1 » |
| **D15** | **QUESTION CLINIQUE** | prescription — N17 | Aucune conduite proposée quand l'agent intolérant est aussi l'agent indiqué |
| **D16** | **QUESTION CLINIQUE** | statine — N26 | Aucune option d'arrêt en prévention primaire chez la très âgée : la seule carte est `Recommandée` |
| **D17** | **DÉFAUT (nouveau)** | cible / prescription — N3, N4 | La suggestion automatique d'espérance de vie ne se déclenche **jamais** sur des valeurs entièrement héritées de la session |
| **D18** | **DÉFAUT (nouveau)** | insuline — N10 | Le « **: non** » d'une citation négative persiste sur le nœud `insuline` — le correctif de N3 n'a pas été propagé |
| **D19** | **DOUTE (nouveau)** | insuline — N11 | Un motif cite deux fois la même condition dans la même phrase |
| **D20** | **DÉFAUT (structurel)** | prescription — N15 | Une carte et une ligne « écarté » portent le même intitulé sur le même écran, indépendamment du rendu du motif |

## Points restés ouverts, sans changement

| Vignette | Le point | Statut |
| --- | --- | --- |
| N12 | Aucune mise en garde sur la fiabilité de l'HbA1c (anémie, hémoglobinopathie, transfusion) | **INCHANGÉ — non livré** (P7/SA2, conforme à `STATUS.md`) |
| N8 | Aucun chiffre de perte de poids ; rien sur la chirurgie bariatrique | **INCHANGÉ** |
| N1 | « Mesures hygiéno-diététiques seules » reste la dernière ligne d'un panneau replié de 3 096 caractères ; aucun lien vers le module RHD | **INCHANGÉ** |
| N4 | « Antécédent cardiovasculaire » vs « Maladie cardiovasculaire athéromateuse établie » : deux noms, un fait | **INCHANGÉ** (mais sans conséquence sur la réponse, cf. supra) |
| N7 | La carte metformine « Maintenir » affiche une posologie d'**instauration** chez une patiente qu'on déprescrit | **INCHANGÉ** |
| N22 | « Refus des injections : préférer le sémaglutide oral » (mention Rybelsus trompeuse, trouvée par P10/S7) | **INCHANGÉ — non corrigé** |
| N9 | Aucun objectif chiffré d'activité physique | **CHOIX ASSUMÉ ET ÉCRIT** (voir N9) |

## Non-régressions et correctifs vérifiés

| # | Vignette | Le point | Verdict |
| --- | --- | --- | --- |
| **C1** | — | « Nouveau patient » : confirmation en deux temps + purge réelle (`Session : 2 valeurs` → absent) | **CONFORME** |
| **C2** | N20 | Bandes de CK : les quatre paliers s'excluent proprement, l'alerte rénale **disparaît** au profit de la rhabdomyolyse | **CONFORME** |
| **C3** | N14 | Intolérance **avérée** en prévention secondaire : « Statine indisponible » + alternatives, aucune contradiction | **CONFORME** |
| **C4** | N24 | Signes d'appel de TCA : les deux cartes d'orientation apparaissent, **visibles, non repliées** | **CONFORME** |
| **C5** | N25 | « Naïf d'insuline » réduit le nœud de 8 à 4 sections ; capteur/TBR disparaissent | **CONFORME** |
| **C6** | N23/N24 | La contradiction du 2026-08-02 sur l'étanchéité des deux axes RHD est corrigée | **CONFORME** |
| **C7** | N3, N4 | Le garde-fou de ré-entrée a changé de titre : « Des valeurs de cette consultation pré-remplissent cet écran » | **CONFORME** |
| **C8** | N4 | La cible ne se recalcule plus à tort au retour sur le nœud (constat n° 2 du 02/08) | **CORRIGÉ** |
| **C9** | N10 | « MCG disponible : Non » **fait disparaître** TBR, coefficient de variation et la section « Profil glycémique nocturne » | **CORRIGÉ** |
| **C10** | N10 | L'écran dit ce qu'il ne peut pas conclure faute de capteur, et propose d'en poser un | **CORRIGÉ** |
| **C11** | N7 | « Indisponible » sur Albuminurie lève le blocage « reco provisoire » | **CORRIGÉ** |
| **C12** | N7 | Les cartes d'allègement portent enfin des chiffres (insuline, sulfamide) | **CORRIGÉ** |
| **C13** | N11 | La sécurité passe devant le chiffre d'HbA1c : « Réduire la basale » en tête à HbA1c 7,0 % | **CONFORME** |
| **C14** | N3 | « … (sur-contrôle) **: non** » → « … et **Pas de sur-contrôle glycémique** » | **CORRIGÉ** |
| **C15** | N3, N4 | « Agent à ajouter — en choisir un » → « **Le choix de l'agent** — en choisir un » | **CORRIGÉ** |
| **C16** | N4 | Le sulfamide ne figure plus dans le groupe de choix chez le coronarien | **CORRIGÉ** |
| **C17** | N1 | Les notes de travail du projet ont disparu de l'argumentaire (8 marqueurs cherchés, 0 trouvé) | **CORRIGÉ** |
| **C18** | N2 | L'argument EBM est revenu **en clair sur la carte**, hors du chevron | **CORRIGÉ** |
| **C19** | N5, N16 | La carte « Réduire · Metformine » porte une pastille « Posologie » | **CORRIGÉ** |
| **C20** | N9 | « Durée d'une séance » disparaît après « Séances : Jamais » | **CONFORME** |
| **C21** | N13b | Aucune carte d'optimisation chez une patiente sans aucun traitement | **CONFORME** |
| **C22** | N6 | Les seuils rénaux qui se croisent, posés côte à côte, écartements en français net | **CONFORME** |
| **C23** | N8, N15 | Le cadrage déclare nommément les faits que le nœud n'a pas regardés | **CORRIGÉ** |

## Le détail des points qui comptent

### D5 — L'acidocétose euglycémique n'a aucune case, et la classe reste `Preuve élevée`

| | |
| --- | --- |
| **Verdict** | **DÉFAUT** (famille 3 — fait de sécurité sans pouvoir de retrait ; famille 5 — impossible à fournir) |
| **Reproduction** | N19, nœud `Traiter`. Optimiser · Metformine + Sulfamide · dose 2000 · intolérance Non · HbA1c 8 / Au-dessus · **Insuffisance cardiaque Oui** · DFG 52 · Microalbuminurie · 76 kg / 1,64 m · signaux « Rien à signaler » · Âge 63 · Risque hypo Élevé. |
| **Observé** | `Recommandée` **Ajouter · iSGLT2** `Preuve élevée`. Pastille *Contre-indications* : « **2 contre-indications : Infections génito-urinaires récidivantes ; antécédent de gangrène de Fournier.** · En cas d'IC avec saxagliptine en cours : … ». L'acidocétose n'apparaît qu'au 3ᵉ niveau de dépli (Argumentaire complet → Inconvénients) et **de façon générique** : « risque d'acidocétose (suspendre si jeûne, chirurgie, sepsis) ». |
| **Pourquoi ça compte** | Cette patiente a passé 4 jours en réanimation sous empagliflozine il y a 8 mois, avec imputabilité formelle. Le formulaire ne me laisse **aucun endroit** pour l'écrire (les 22 champs du nœud ont été parcourus ; « Cétonémie » est une mesure du jour, pas un antécédent). L'outil me repropose donc la classe, badgée `Preuve élevée`, en tête du groupe « Le choix de l'agent ». |
| **Nuance importante** | Le contenu **connaît** parfaitement le sujet : N7 affiche une alerte de 8 lignes sur l'acidocétose euglycémique du dénutri, avec les délais de suspension péri-opératoires. Ce qui manque n'est pas le savoir, c'est **le critère qui permettrait de le recueillir comme antécédent**. |

### D6 — À 60 fois la normale, le titre de la carte dit encore « interrompre 4 à 6 semaines »

| | |
| --- | --- |
| **Verdict** | **DÉFAUT** (famille 3, atténué : le texte est au bon endroit, c'est le titre qui ment) |
| **Reproduction** | N20, nœud `Statine`. Âge 61 · ASCVD Oui · ancienneté 9 · autres FDR 2 · Dialyse Non · statine en place Oui · intolérance **Rapportée** · **borne haute du labo 200** · CK successives **450 → 1 240 → 4 000 → 12 000 UI/L**. |
| **Observé** | À 12 000 UI/L, dérivé affiché « **CK, en multiples de la normale 60,0 · calculé** ». Carte unique, mesurée `cardTop 509` : `Mesure de sécurité` **Interrompre la statine 4 à 6 semaines et réévaluer** `Preuve faible`, et **dans la carte elle-même** (`alertTop 586`) : « **CK au-dessus de 50 fois la normale : arrêter la statine et évoquer une RHABDOMYOLYSE. Avis spécialisé URGENT et évaluation hospitalière — ne pas attendre le dosage de la myoglobinurie pour réhydrater. Ce n'est plus la séquence d'interruption-réintroduction décrite ci-dessus.** » |
| **Pourquoi ça compte** | Le test des 20 secondes retient le titre. Ici le titre est le seul énoncé faux de la carte, et l'encart qui le dément est écrit en petit dessous. La carte devrait changer de nom, pas se corriger elle-même. |

**Ce qui est CONFORME et mérite d'être noté (C2)** : les quatre paliers se comportent exactement comme le
cadrage l'exige. 450 (2,25 N) → « Statine de haute intensité — prévention secondaire », **aucun champ CK
superflu, aucune alerte**. 1 240 (6,2 N) → bascule sur « Interrompre… », **la carte haute intensité
disparaît** (pas d'empilement). 4 000 (20 N) → apparition de « CK entre 10 et 50 fois la normale : vérifier
la FONCTION RÉNALE avant tout… ». 12 000 (60 N) → **l'alerte rénale disparaît** et cède la place à la
rhabdomyolyse. Les deux ne coexistent jamais.

**Et le meilleur correctif d'ergonomie de la passe est ici** : les CK se saisissent en **UI/L**, avec un
champ « **Borne haute de la normale du laboratoire (UI/L)** » et l'aide « *Indiquée sur le compte-rendu du
laboratoire, à côté de la valeur mesurée.* ». Je recopie deux nombres de la feuille de labo et l'outil
calcule le multiple. Je n'ai plus à faire la division de tête, ni à deviner quelle « normale » l'outil a en
tête. **C'est exactement ce qu'il fallait faire.**

### D7 et D11 — Le nœud « Activité physique », ses deux contre-indications, et son silence

| | |
| --- | --- |
| **Verdict** | **DÉFAUT** ×2 |
| **Reproduction** | N23, `Activité physique`. Fragilité Non · **Insuline/sulfamide/glinide en cours Oui** · séances **Jamais** · trajets à pied · assis **4 à 8 h** · n'interrompt pas · limitation Non · **Rétinopathie non stabilisée ou proliférante Oui** · **Neuropathie ou mal perforant plantaire Oui**. |
| **Observé (D7)** | Ligne d'écartement, visible sans dépli : « *Envisager un programme d'activité physique adaptée (endurance et renforcement), avec l'accompagnement d'un professionnel* **écarté : Signe imposant un avis avant la pratique structurée (limitation, ischémie d'effort, rétinopathie, pied)** ». Quatre signes énumérés, **deux vrais chez lui**, aucun moyen de savoir lesquels. |
| **Observé (D11)** | Une alerte, remarquable, pour la neuropathie : « *Neuropathie périphérique ou mal perforant plantaire : la source HAS restreint la limitation aux activités en CHARGE des membres inférieurs… L'outil retire ici la famille « pratique structurée » dans son ensemble, faute de recueillir de quoi distinguer les pistes par segment corporel : orienter vers une pratique adaptée plutôt que de conclure à l'absence d'activité possible.* » **Aucune alerte, aucun mot, pour la rétinopathie proliférante.** Rien sur le Valsalva, rien sur le caractère temporaire de la restriction pendant la PPR. |
| **Pourquoi ça compte** | Je repars avec cinq cartes « Recommandée » sur le mouvement et une ligne qui me dit qu'un « avis » est requis, sans savoir de quel spécialiste il s'agit ni pour combien de temps. Or l'ophtalmologiste le revoit dans trois semaines : c'est une restriction datée, pas un interdit. |

**À porter au crédit du nœud** : l'alerte neuropathie ci-dessus est **le meilleur texte de tout le
produit**. Elle dit ce que la source autorise, ce que l'outil retire, **et pourquoi il le retire plus
largement que la source** — une auto-critique explicite dans un écran clinique, je n'ai jamais vu ça
ailleurs.

### D9 et D10 — Le chauffeur poids lourd, ses deux malaises, et la cible à 7 %

| | |
| --- | --- |
| **Verdict** | **DÉFAUT** |
| **Reproduction** | N21. Nœud `Fixer la cible` : Âge 57 · Ancienneté 13 · « Rien à signaler ». Puis `Traiter` (« Reprendre les valeurs de ce patient ») : Optimiser · Metformine + Sulfamide · dose 2000 · intolérance Non · HbA1c 7,2 / **À l'objectif** · DFG 66 · Normoalbuminurie · 88 kg / 1,75 m · **Hypoglycémie récente Oui** · Âge 57 · Risque hypoglycémique **Élevé**. |
| **Observé (D9)** | Nœud cible : `Recommandée` **Cible ≤ 7 %** `Preuve faible`. **Le nœud n'a que six champs** — Âge, Ancienneté, Espérance de vie, Fragilité, Antécédent cardiovasculaire, Comorbidité grave — et **aucun ne parle d'hypoglycémie**. Le champ existe pourtant dans le produit : « **Hypoglycémies sévères récurrentes / non-perception** » est présent sur le nœud `Insulinothérapie`, section *Signaux d'alerte et tolérance*. Il n'est ni sur `cible-glycemique`, ni sur `prescription`. |
| **Observé (D10)** | Sur `Traiter`, les cartes visibles sont : **Maintenir · Metformine** (socle), **Remplacer · Sulfamide** `Recommandée`, **Ajouter · iSGLT2** / **AR GLP-1**, **Désintensifier** `Recommandée`. Et **derrière « Autres pistes possibles (1) » : « Réduire · Sulfamide » `Recommandée`.** Aucune carte n'est en zone « À faire d'emblée — sécurité ». |
| **Pourquoi ça compte** | Cet homme conduit 40 tonnes et a été resucré par les pompiers à 0,38 g/L. L'outil lui fixe la cible la plus stricte de sa palette et range le geste le plus immédiatement protecteur (baisser le glimépiride ce soir) derrière un pli. Le fait clinique existe dans l'outil ; il n'est simplement pas recueilli là où la décision se prend. **C'est le pendant, côté écran, de la dette « `terrain_fragile` déclaré deux fois avec des définitions différentes » listée dans `STATUS.md`.** |

### D12 — La cible que je viens de fixer ne sert pas à l'écran suivant

| | |
| --- | --- |
| **Verdict** | **DOUTE** (régression apparente de D-06/K6, ou retrait délibéré non documenté) |
| **Reproduction** | N21, enchaînement `Fixer la cible` (→ « Cible ≤ 7 % ») puis `Traiter`, HbA1c actuelle 7,2. |
| **Observé** | Le nœud `Traiter` **n'a plus de champ « HbA1c cible »**. Le champ « **Par rapport à l'objectif fixé pour ce patient** » reste marqué « · à confirmer », aucun segment `aria-pressed="true"`, **aucune mention « · calculé, à vérifier »**. Je dois déclarer à la main où se situe le patient par rapport à une cible que l'outil vient de calculer deux clics plus tôt. Le champ « HbA1c cible (%) » existe toujours, lui, sur `Insulinothérapie`. |
| **Pourquoi ça compte** | Le pré-remplissage calculé était le mécanisme phare de juillet (P0-d). Sous cette forme, il ne peut plus fonctionner : ni les deux HbA1c ne cohabitent sur `Traiter`, ni la conclusion du nœud cible n'y arrive. Et l'asymétrie entre `Traiter` (pas de cible) et `Insulinothérapie` (cible) n'est pas explicable au praticien. |

### D13 — Ce que « Rien à signaler » vient de répondre, on ne le sait pas

| | |
| --- | --- |
| **Verdict** | **DOUTE** (famille 9) |
| **Reproduction** | N16, `Traiter`, section SIGNAUX D'ALERTE (5 drapeaux) → un clic sur « Rien à signaler ». |
| **Observé** | Le compteur « à confirmer » de la section tombe à zéro, mais le résumé replié n'affiche que **trois** des cinq : « *Symptômes de glucotoxicité … : Non · Cétonémie : Non · Dénutrition / carence … : Non* ». « Hypoglycémie récente » et « Infections génito-urinaires récidivantes » n'y figurent pas. Même observation sur `Statine` : « Diabète compliqué » disparaît du résumé. Ce ne sont pas « les seuls vrais » qui manquent : en N17, « Infections génito-urinaires récidivantes : **Oui** » est bien listée. |
| **Pourquoi ça compte** | Le résumé replié est **le seul contrôle** dont je dispose sur ce que j'ai déclaré (c'est d'ailleurs celui que j'ai utilisé toute la passe). S'il n'est pas exhaustif, un geste global comme « Rien à signaler » devient invérifiable. |

### D15 — L'agent qu'elle ne supporte plus est celui qui protège son rein

| | |
| --- | --- |
| **Verdict** | **QUESTION CLINIQUE** (le moteur est cohérent ; c'est le contenu qui ne couvre pas le cas) |
| **Reproduction** | N17. Optimiser · **Metformine + iSGLT2** · dose 2000 · intolérance **Oui / Génito-urinaire** · HbA1c 7,4 / Au-dessus · DFG 58 · **Macroalbuminurie** · 80 kg / 1,65 m · **Infections génito-urinaires récidivantes Oui** · Âge 59. |
| **Observé** | Alerte de nœud, excellente : « *iSGLT2 (en cours ou indiqué par la comorbidité) + infections génito-urinaires récidivantes : réévaluer l'indication (ne pas initier / envisager l'arrêt) ; risque de gangrène de Fournier.* **Préférer une autre classe si une protection est requise.** » Puis, en tout et pour tout : **2 options** — `Maintenir · Metformine` et `Optimiser l'agent mal toléré`. **Aucune carte ne nomme la classe de remplacement.** Dans « Pourquoi pas d'autres options ? » : « **Reconsidérer un agent protecteur hors indication — ne s'applique pas : il faudrait iSGLT2 en cours SANS indication cardio-rénale, avec infections génito-urinaires récidivantes** ». |
| **Pourquoi ça compte** | Une option existe pour ce problème — mais elle est réservée au cas **facile** (gliflozine sans indication : on l'arrête, point). Le cas **difficile** (gliflozine intolérable ET indiquée, macroalbuminurie à 320 mg/g) est précisément celui où j'ai besoin d'aide, et c'est celui qui reçoit un écran vide de conduite. L'alerte me dit « préférer une autre classe » ; l'écran n'en propose aucune. |

### D16 — La statine chez la femme de 86 ans en EHPAD

| | |
| --- | --- |
| **Verdict** | **QUESTION CLINIQUE** (périmètre) |
| **Reproduction** | N26, `Statine`. Âge 86 · ASCVD **Non** · Ancienneté 22 · Autres FDR 0 · Diabète compliqué Non · Dialyse Non · Statine déjà en place **Oui** · Intolérance Non. |
| **Observé** | Alerte de nœud, très bonne : « *Prévention primaire après 75 ans : preuve plus faible et moins directe… Individualiser selon l'espérance de vie, la fragilité et les préférences : le seuil de 2,5 ans avancé par la reco SFE/SFD/NSFA/SFC 2026 est **extrapolé** d'une méta-analyse portant sur des sujets de 50 à 75 ans, faute de donnée directe après cet âge — **à utiliser comme repère, pas comme mesure**.* » Puis, seule carte : `Recommandée` **Statine — prévention primaire** `Preuve modérée`. |
| **Pourquoi ça compte** | Ma question est « est-ce que j'arrête ? ». La réponse affichée est « Recommandée ». Aucune option de déprescription n'existe sur ce nœud, et **le nœud ne recueille ni l'espérance de vie ni la fragilité** — les deux critères que sa propre alerte me demande d'individualiser. Un écran qui dirait « ce nœud ne traite pas l'arrêt d'une statine en cours » me rendrait service ; celui-ci me pousse à la maintenir. |

### D17 — L'espérance de vie ne se calcule pas sur ce qu'on lui donne

| | |
| --- | --- |
| **Verdict** | **DÉFAUT** (nouveau, non signalé le 02/08 ; touche le parcours le plus fréquent) |
| **Reproduction** | N3, M. Abadie. « Fixer la cible » : Âge **64** · Ancienneté 11 · « Rien à signaler » → `Cible ≤ 7 %`. Puis « Traiter » → « **Reprendre les valeurs de ce patient** » → parcours complet. |
| **Observé** | Section TERRAIN : « **Âge · repris de votre saisie** », « **Fragilité · repris de votre saisie** », et « **Espérance de vie · à confirmer** » — **aucun segment `aria-pressed="true"`** (relevé : `Longue|false, Intermédiaire|false, Limitée|false`), bandeau « **Reco provisoire — 2 critères décisifs non confirmés** ». |
| **Isolement de la cause** | Je retape la **même** valeur 64 dans le champ Âge : rien ne change (pas de changement d'état, donc pas de recalcul). Je passe l'âge à **65** : la mention « · repris de votre saisie » disparaît **et**, dans le même mouvement, le champ devient « **Espérance de vie · calculé, à vérifier** » avec « **Longue** » pressé. |
| **Contre-exemple qui confirme** | N4 (M. Kervarec) : Âge repris **mais Fragilité répondue localement** → « Espérance de vie · **calculé, à vérifier** ». Le calcul se déclenche dès qu'**un** de ses ingrédients est touché dans le nœud. |
| **Pourquoi ça compte** | Sur l'enchaînement normal « Fixer la cible → Traiter », quand la mémoire de session fournit **tout** ce dont dépend le calcul, la suggestion ne se produit pas et la recommandation reste « PROVISOIRE » — sans que rien n'indique au praticien qu'il lui suffirait de valider un segment. Le mécanisme K6/D-06 se retourne : il ne s'applique qu'aux valeurs tapées à la main, c'est-à-dire précisément celles pour lesquelles on n'a pas besoin de lui. |

### D18 — Le « : non » a survécu sur le nœud `insuline`

| | |
| --- | --- |
| **Verdict** | **DÉFAUT** (famille 8) |
| **Reproduction** | N10, `Insulinothérapie`, MCG = Non, puis « Pourquoi pas d'autres options ? ». |
| **Observé** | « *Corriger l'hypoglycémie ou la variabilité — ne s'applique pas : … **ni MCG disponible : non et Glycémie à jeun sous la cible (< 0,70 g/L)*** » et « *Ne pas sur-titrer la basale — … **ni MCG disponible : non et Glycémie à jeun à la cible**, …* ». |
| **Pourquoi ça compte** | C'est le défaut n° 2 de N3 du 02/08 (« *… HbA1c < 6,5 % (sur-contrôle) **: non*** »), corrigé sur `prescription` — « *Pas de sur-contrôle glycémique* » — et **non propagé** à `insuline`. Le « : non » accolé à un libellé positif se lit à l'envers du sens voulu. |

### D20 — Deux options homonymes sur le même écran, indépendamment du motif

N15 le montre à l'état pur, avec des motifs pourtant impeccables :

> **À faire d'emblée — sécurité** — `Mesure de sécurité` **Arrêter · Sulfamide (DFG < 30)** `Preuve faible`
> …
> **Sulfamide écarté : DFG (mL/min/1,73 m²) < 30**

Le même mot, « Sulfamide », porte simultanément un geste de sécurité recommandé et une mention « écarté ».
Ici le lecteur s'en sort (le motif est identique et lisible) ; en N16/N18/N5, où le motif est brut, il ne
s'en sort pas. **La cause est le raccourcissement des intitulés en noms de classe** : la ligne
d'écartement, qui ne porte pas de chip de verbe, n'a plus de quoi se distinguer de la carte.

---

# Partie 2 — Les vignettes, une à une

## N1 — Le diabète tout neuf, sans rien autour (M. Ferreira, 46 ans)

**Saisie : 15 actions, 1 écran, ~2 min.** Initier · (pas de section Traitement) · HbA1c 7,3 / Au-dessus ·
DFG 96 · Normoalbuminurie · 88 kg / 1,76 m · Rien à signaler · Âge 46.

**Une option** : `Recommandation officielle (France)` **Ajouter · Metformine** `Preuve faible`, avec
« *Pas de bénéfice sur critère dur démontré vs placebo (Griffin 2017, Boussageon 2012 NS). Socle par
tolérance / sécurité / coût / recul.* » en clair sous la carte.

**C17 — les consignes au rédacteur ont disparu.** Recherche sur le texte complet de la page, argumentaire
et options écartées dépliés, de huit marqueurs relevés le 02/08 : `ne pas afficher` · `6ᵉ série` ·
`red-team` · `ÉTAT DES TROIS RÉSIDUELS` · `a été retiré du nœud` · `VÉRIFIÉ par le référent` · `nœud E` ·
`rétabli le`. **Zéro occurrence.** Les défauts n° 3 et n° 4 de N1 sont fermés.

**La posologie est même plus concrète qu'avant :**

> **Posologie : instauration : paliers de 15 j jusqu'à dose cible (ex. 2 g/j en 1 mois), 2-3 prises au
> repas** — *En INSTAURATION : définir une dose de départ puis l'augmenter par palier d'1 semaine à
> 15 jours selon la tolérance digestive jusqu'à la dose cible, en 2 à 3 prises en milieu ou fin de repas —
> exemple du mémo pour une cible de 2 g/j (Glucophage 1000 mg) : ½ cp matin + ½ cp soir pendant…*

**Inchangé** : ma question « RHD seules 3 mois ? » est répondue par « *Mesures hygiéno‑diététiques seules —
réévaluer — ne s'applique pas : il faudrait HbA1c à la cible* » — **dernière ligne d'un panneau replié de
3 096 caractères**. Et toujours **aucun lien vers le module RHD** (vérifié : 0 occurrence de « Règles
hygiéno-diététiques » sur la page).

**En vraie consultation ?** Oui, plus d'une fois : le rythme de titration est ce que je n'ai pas en tête.

## N2 — La cible, et rien que la cible (Mme Lantier, 59 ans)

**Saisie : 5 actions, 1 écran, ~35 secondes. Le nœud le plus rentable du produit.**

**C18 — l'argument que j'avais perdu est revenu.** Le 02/08 j'écrivais : « *je n'ai rien retenu de
l'argument EBM… parce que cette phrase est passée derrière le chevron.* » Aujourd'hui, sur la carte,
**sans rien déplier** :

> `Recommandée` **Cible ≤ 7 %** `Preuve faible`
> **Réduction de l'IDM non fatal (méta-analyses), pas de la mortalité ; bénéfice absolu modeste.**

Et le motif, d'un clic : « *ni fragilité, ni comorbidité grave, ni antécédent cardiovasculaire, ni
espérance de vie limitée : situation intermédiaire, en dehors des critères qui feraient basculer vers une
cible plus prudente (< 9 % ou ≤ 8 %) ou plus stricte (~6,5 %)* ».

## N3 — Pile sur la cible : est-ce que je touche à quelque chose ? (M. Abadie, 64 ans)

**Saisie : 24 actions, 2 écrans, ~4 min.** Cible → `Cible ≤ 7 %` (3 actions). Traiter → 5 options.

**C14 — le motif brut est corrigé.** Relevé des six « Proposé parce que » de l'écran :

> *Socle maintenu par la recommandation officielle, quelles que soient les comorbidités.*
> *Sulfamide déjà en cours et **Pas de sur-contrôle glycémique*** ← (02/08 : « *…HbA1c < 6,5 % (sur-contrôle) : non* »)
> *Agent sans bénéfice dur déjà en cours (sulfamide, gliptine ou glinide)* ×2
> *Hypoglycémie récente, schéma à risque hypoglycémique élevé et Sulfamide déjà en cours*
> *Sulfamide déjà en cours et Hypoglycémie récente*

**C15** — le groupe s'appelle maintenant « **Le choix de l'agent — en choisir un** » et non plus « Agent à
ajouter », ce qui lève l'ambiguïté signalée le 02/08 (des options de remplacement sous un titre
« ajouter »).

**C'est ici que sort D17** (l'espérance de vie non calculée sur valeurs héritées) — voir Partie 1.

## N4 — Coronarien pontagé : la consultation qui traverse trois écrans (M. Kervarec, 67 ans)

**Saisie : 34 actions, 3 écrans, ~6 min.** Cible 5 · navigation + garde-fous 3 · Traiter 17 ·
navigation + garde-fou 3 · Statine 6.

**Le correctif majeur de la journée est ici** (voir « À lire d'abord »).

**Traiter — 4 options**, et **C16** : le sulfamide **ne figure plus** dans le groupe de choix chez ce
coronarien (le 02/08, « Sulfamide (gliclazide MR ou glimépiride) — option glycémique de bas rang »
s'affichait dans le même cadre visuel que l'iSGLT2 à preuve élevée).

> **Socle** — `Recommandation officielle (France)` **Maintenir · Metformine** `Preuve faible`
> **Traitement à corriger ou remplacer** — `Recommandée` **Remplacer · Gliptine** `Preuve modérée`
> **Le choix de l'agent — en choisir un** — `Recommandée` **Ajouter · iSGLT2** `Preuve élevée` · **Ajouter · AR GLP‑1** `Preuve modérée`

**Statine — inchangé et excellent** : `Recommandée` **Statine de haute intensité — prévention secondaire**
`Preuve élevée`, motif « *Maladie cardiovasculaire athéromateuse établie* », et derrière la pastille
**Posologie** : « **atorvastatine 40-80 mg / rosuvastatine 10-20 mg** ». Trois champs repris depuis les
nœuds précédents (Âge, Maladie CV athéromateuse, Ancienneté).

## N5 — Insuffisance rénale modérée (M. Traoré, 71 ans)

**Saisie : 20 actions, 1 écran, ~3 min.** Optimiser · Metformine + Sulfamide · dose 2000 · HbA1c 7,7 /
Au-dessus · DFG **31** · Macroalbuminurie · 68 kg / 1,62 m · Âge 71.

> `Mesure de sécurité` **Réduire · Metformine** `Preuve faible` — *À faire d'emblée — sécurité*
> `Recommandée` **Remplacer · Sulfamide** `Preuve modérée`
> `Recommandée` **Ajouter · iSGLT2** `Preuve élevée` · **Ajouter · AR GLP‑1** `Preuve modérée`
> Alerte : *Metformine : dose maximale 1 000 mg/j, initiation ≤ 500 mg si DFG 30‑44 (RCP ANSM).*

**C19 — la carte « Réduire » porte enfin une pastille « Posologie »** (défaut n° 5 du 02/08 : « la carte
dont le titre est un changement de dose est la seule à ne pas donner de dose »). **Corrigé.**

**D3, 3ᵉ occurrence** : la ligne « Metformine écarté : … » en expression brute.

## N6 — Insuffisance rénale sévère (Mme Nowak, 79 ans)

**Saisie : 18 actions, 1 écran, ~3 min. Inchangé et excellent.**

> `Mesure de sécurité` **Arrêter · Metformine (DFG < 30)** `Preuve faible`
> `Recommandée` **Remplacer · Gliptine** · `Recommandée` **Ajouter · AR GLP‑1**
> **Metformine écarté : DFG (mL/min/1,73 m²) < 30** · **iSGLT2 écarté : DFG (mL/min/1,73 m²) < 20**

Trois alertes, dont : « *Metformine CONTRE‑INDIQUÉE si DFG < 30 (RCP ANSM) : arrêter ; sulfamide aussi. Un
iSGLT2 reste initiable jusqu'à DFG ≥ 20 (indication rénale). Ces limites portent sur l'ÉLIMINATION RÉNALE
des agents, pas sur leur efficacité glycémique : l'AR GLP‑1 et l'insuline n'ont pas de contre‑indication
liée au DFG et restent utilisables en dessous de 20.* » et le signal clair demandé sur l'AR GLP‑1 en DFG
< 15 (« *Le recul manque, pas l'autorisation* »).

**Les options écartées avec leur motif en une ligne restent la meilleure trouvaille de lisibilité du
produit — et la preuve que le rendu sait faire (cf. D3).**

## N7 — La désescalade chez la très âgée (Mme Chevallier, 88 ans)

**Saisie : 24 actions, 2 écrans, ~4 min.** Cible → **Cible < 9 %**, espérance « Limitée · calculé ».
Traiter : Déprescrire · Metformine + Sulfamide + Insuline basale · dose 1000 · HbA1c **6,2** / **En
dessous** · DFG 38 · **Albuminurie : Indisponible** · 49 kg / 1,54 m · Hypoglycémie récente **Oui** ·
Dénutrition **Oui** · Fragilité (reprise) · Risque hypoglycémique **Élevé**.

**C11 — la friction bloquante est levée.** Le champ Albuminurie, que je n'ai pas dans le dossier de
l'EHPAD, passe de « · à confirmer » à « **· indisponible** », et l'écran répond :

> **Recommandation rendue sans le critère Albuminurie : vous avez indiqué ne pas l'avoir. Il n'a pas été
> évalué, c'est au praticien de le faire.**

Le 02/08 j'écrivais : « *il n'existe aucun moyen de dire « je ne l'ai pas ».* » **Il y en a un.**

**C12 — ma question a enfin une réponse chiffrée.**

> **Réduire · Insuline** — Posologie : « *en relais thérapeutique (introduction d'un autre agent) : **−10 à
> −20 %, ou −20 à −30 % si à l'objectif ou hypoglycémie** — jamais d'arrêt brutal sans relais (avis
> d'experts, AAFP 2026 / JAMA…)* »
> **Réduire · Sulfamide** — Posologie : « *à l'introduction d'un AR GLP‑1 : **arrêt si HbA1c ≤ 7,5 % ·
> −50 % si 7,6-8,5 % · maintien si > 8,5 %** (avis d'experts, JAMA Cardiol 2020) ; en allègement isolé hors
> relais : au jugement clinique.* »

C'était le manque principal de N7 depuis le 30/07 — et le STOP « aucune source française sur le rythme de
désescalade » listé dans `STATUS.md`. **Livré**, avec la mention honnête de ce qui reste au jugement.

**L'ordre est bon** : « Traitement à alléger » en tête (Désintensifier · Réduire l'insuline · Réduire le
sulfamide), puis le socle, puis l'iSGLT2.

**Et l'asymétrie que je pointais est maintenant argumentée à l'écran.** L'iSGLT2 reste proposé chez cette
femme de 49 kg dénutrie, mais sous une alerte de 8 lignes :

> *Chez un patient dénutri, l'acidocétose euglycémique sous iSGLT2 peut s'installer avec une GLYCÉMIE
> RESTÉE PROCHE DE LA NORMALE — c'est ce qui la rend traître… Suspendre l'iSGLT2 en cas de jeûne prolongé
> ou d'apports glucidiques manifestement insuffisants, et par principe au moins 3 jours avant une chirurgie
> programmée (4 jours pour l'ertugliflozine — ACC 2020). **Cette alerte qualifie le geste, elle ne l'écarte
> pas : la dénutrition seule ne fonde aucune exclusion** (à la différence de l'AR GLP‑1, dont l'effet
> anorexigène propre justifie son exclusion de terrain — l'iSGLT2 ne le partage pas).*

**Inchangé, et toujours agaçant** : la carte « Maintenir · Metformine » affiche, chez cette patiente qu'on
déprescrit, une posologie d'**instauration**.

## N8 — L'obésité, la demande porte sur le poids (Mme Sissoko, 41 ans)

**Saisie : 17 actions, 1 écran, ~3 min.** Intensifier · Metformine 2000 · HbA1c 8,6 / Nettement au-dessus ·
DFG 111 · Normoalbuminurie · 109 kg / 1,66 m · Âge 41.

**Six options** : Maintenir Metformine · **Ajouter AR GLP‑1** `Recommandée` · Ajouter iSGLT2 · Ajouter
Tirzépatide · Ajouter Gliptine · Ajouter Sulfamide.

**Inchangé, et c'est ma déception récurrente** : recherche sur le texte complet — **aucun chiffre de perte
de poids**. Les seules mentions sont qualitatives : « *forte efficacité HbA1c et perte de poids* »,
« *perte de poids modeste* ». Et **rien sur la chirurgie bariatrique** (les deux occurrences de
« chirurgie » sur la page concernent la suspension péri-opératoire d'un agent). Je ne peux toujours rien
promettre de chiffré à Mme Sissoko.

**C23 — mais le cadrage déclare maintenant ses trous**, et c'est nouveau :

> … **ni de kaliémie (et les traitements hyperkaliémiants associés), ni d'hémoglobine, ni de poids sec /
> état volémique, ni de refus global de traitement du patient** (au-delà de la préférence vis-à-vis de
> l'injectable) : **une option « Recommandée » ne les a pas évalués, c'est au praticien de le faire.**

## N9 — Le patient motivé qui veut « faire du sport » (M. Ould-Amara, 53 ans)

**Saisie : 12 actions, 2 écrans, ~2 min.** Fragilité Non · pas d'hypoglycémiant · séances **Jamais** ·
trajets en voiture · assis **> 8 h** · n'interrompt pas · sécurité : rien à signaler.

**C20 — « Durée d'une séance » disparaît** après « Jamais ». Le défaut n° 7 du 30/07 reste corrigé.

**5 options**, dont — contrairement à N23 — la **Pratique structurée** : « *Envisager un programme
d'activité physique adaptée (endurance et renforcement), avec l'accompagnement d'un professionnel* », avec
l'alerte qui répond à ma question (a) :

> **Une évaluation médicale minimale est recommandée avant de commencer ou d'augmenter une activité
> physique d'intensité au moins modérée, en particulier si le patient est actuellement inactif ou porteur
> d'un facteur de risque cardiovasculaire (HAS R.19).** Avant l'effort, une glycémie très élevée (seuil de
> vigilance cité par la HAS : 2,5 g/L) expose à une instabilité glycémique — à vérifier par le patient
> lui-même, pas une donnée à recueillir dans ce nœud (HAS R.28).

**Ma question « quelle durée, quelle fréquence » n'a pas de réponse chiffrée — et c'est un choix assumé,
écrit noir sur blanc** dans l'argumentaire : « *…, seul repère prédictif retenu ici, **jamais un objectif
chiffré (150 min/semaine, 10 000 pas)** ; aucune piste de ce nœud ne revendique de bénéfice
cardiovasculaire dur — aucun essai contrôlé…* ». Je ne le compte pas comme un défaut.

## N10 — Sous insuline basale, mal équilibré, SANS capteur (M. Pereira, 62 ans)

**Saisie : 16 actions, 1 écran, ~3 min.** Basale seule · Âge 62 · HbA1c 9,3 / cible 7 · DFG 68 · 91 kg ·
Metformine + Sulfamide · basale **38 U** · **MCG disponible : Non** · glycémie à jeun habituelle **2,0 g/L**.

**C9 — le point noir du 2026-07-28 est fermé.** Répondre « Non » à « MCG disponible » **fait disparaître**
« TBR — temps sous 70 mg/dL (%) », « Coefficient de variation glycémique (%) » **et la section entière
« Profil glycémique nocturne »**. Ne reste que « **Glycémie à jeun habituelle (g/L)** », avec son aide :
« *Reportez la valeur HABITUELLE des 3 derniers matins, pas la dernière mesure. Une seule glycémie basse
isolée ne justifie pas de réduire la dose ; c'est sa répétition qui compte.* »

**C10 — l'outil dit ce qu'il ne peut pas conclure.**

> Alerte : **Sans MCG : titrer la basale sur la glycémie à jeun (cible ~0,70-1,30 g/L) ; utiliser des
> profils capillaires 6-7 points (avant/après les 3 repas + coucher) pour guider l'intensification
> prandiale.**
>
> `Recommandée` **Envisager d'instaurer une mesure continue du glucose** `Preuve modérée`
> *En l'absence d'urgence, il est légitime de **DIFFÉRER** l'ajustement en attendant des données de mesure
> continue. Si la situation impose de trancher aujourd'hui, les cartes ci-dessous restent valables : elles
> raisonnent sur les glycémies capillaires disponibles, **avec une fiabilité moindre**.*
>
> `Recommandée` **Titrer la basale (augmenter la dose)** — Posologie : **Doses indicatives : Basale après
> +2 U ≈ 40 U/j**

Le témoin écrivait : « *J'attends surtout que l'outil dise ce qu'il ne peut pas conclure faute de données,
au lieu de répondre fermement sur des glycémies que je n'ai pas.* » **C'est fait, mot pour mot.**

**Réserve** : aucune carte AR GLP‑1 chez cet homme de 91 kg — l'option est **explicitement écartée**
(« *il faudrait situation d'insulinothérapie = Naïf d'insuline* »), ce qui vaut mieux qu'un silence, mais
laisse ma question ouverte. **Et c'est ici que sort D18** (le « : non »).

## N11 — Sous insuline AVEC capteur, hypoglycémies nocturnes (Mme Renard, 68 ans)

**Saisie : 18 actions, 1 écran, ~3 min.** Basal-bolus · Âge 68 · HbA1c **7,0** / cible 7 · DFG 63 · 68 kg ·
basale 34 U · MCG **Oui** · **TBR 9 %** · **CV 41 %** · profil nocturne « **Baisse continue de la glycémie
nocturne** » · pas de signal entre les repas · risque hypoglycémique **Élevé**.

> **Ajuster le schéma en place** — `Recommandée` **Réduire · Réduire la basale** `Preuve modérée`
> `Recommandée` **Optimiser la répartition du basal-bolus** `Preuve faible`
> **Alléger le schéma** — `Recommandée` **Réduire · Désintensifier / alléger le schéma** `Preuve faible`

**C13 — la sécurité passe devant le chiffre.** « Réduire la basale » est la **première** carte, chez une
patiente dont l'HbA1c est **exactement à la cible**. Motif : « *…et MCG disponible et Profil glycémique
nocturne = Baisse continue de la glycémie nocturne* ». Posologie : « **Doses indicatives : Basale réduite
(−2 U) ≈ 32 U/j** ».

L'outil **voit** que 9 % et 41 % sont anormaux (le motif de la 2ᵉ carte cite « *TBR > 4* » et
« *Coefficient de variation > 36* »), **et il dit son propre STOP** :

> *Désintensifier / alléger le schéma — Posologie : **réduire au jugement clinique — aucun rythme chiffré
> sourcé pour la déprescription programmée** (voir « Corriger l'hypoglycémie » ou « Réduire la basale » si
> signal actif)*

Enfin, un mécanisme neuf et très utile : « **Doses non calculées : Dose totale quotidienne — à renseigner :
Dose de rapide actuelle (U/j)** ». L'outil nomme le chiffre qui lui manque pour calculer.
**D19** : le motif de cette même carte cite deux fois « et MCG disponible » dans la même phrase.

## N12 — L'HbA1c à laquelle je ne crois pas (Mme Diallo, 57 ans)

| | |
| --- | --- |
| **Verdict** | **INCHANGÉ — non livré** (conforme à ce que `STATUS.md` annonce : P7/SA2 non livrée) |
| **Reproduction** | Optimiser · Metformine 2000 + Gliptine · **HbA1c 6,4** / En dessous · DFG 88 · Normoalbuminurie · 71 kg / 1,63 m · Rien à signaler · Âge 57. **18 actions.** |
| **Observé** | Recherche sur le texte complet de la page, **argumentaire et options non retenues dépliés**, de : `anémie` · `hémoglobinopathie` · `drépanocyt` · `transfusion` · `fructosamine` · `ininterprétable` · `fiabilité de l` · `validité`. → **zéro occurrence.** L'écran rend : `Maintenir · Metformine` · `Remplacer · Gliptine` `Recommandée` · `Ajouter · iSGLT2` · `Ajouter · AR GLP‑1`. La section ÉQUILIBRE ne contient que « HbA1c actuelle » et « Par rapport à l'objectif ». |
| **Pourquoi ça compte** | Cette patiente a 1,90 g/L à jeun et 2,60 g/L après le déjeuner. L'outil raisonne sur 6,4 % et me place « En dessous de l'objectif ». **C'est le seul cas du banc où l'écran m'induirait en erreur sans que rien ne signale le risque.** |

## N13b — La patiente qui n'a rien (Mme Petit, 44 ans)

**Saisie : 14 actions.** Initier · HbA1c 7,1 / Au-dessus · DFG 101 · Normoalbuminurie · 72 kg / 1,66 m ·
Âge 44.

**C21 — le test en négatif passe** : **une seule carte**, « Ajouter · Metformine ». Aucune carte parlant
d'optimiser un traitement existant, aucune ligne d'écartement.

*(N13a — M. Vasseur, intolérance digestive à la metformine — n'a pas d'écran propre : elle est recouverte
par N16, qui joue la même intolérance avec un DFG plus contraignant.)*

## N14 — La statine chez celui qui n'en veut plus (M. Lombard, 58 ans)

**Saisie : 11 actions.** ASCVD Oui · statine en place **Non** · intolérance **Avérée** · CK 180 / borne 200
(« **CK, en multiples de la normale 0,9 · calculé** »).

**C3 — CONFORME, et nettement mieux qu'avant.** Une seule carte, et elle est bonne :

> `Mesure de sécurité` **Statine indisponible** `Preuve modérée`
> **Ce patient a une maladie cardiovasculaire ÉTABLIE : il relève de la prévention SECONDAIRE, où le
> bénéfice de l'abaissement du LDL est le mieux démontré et le NNT le plus bas. L'indisponibilité de la
> statine ne diminue en rien son risque absolu — elle rend seulement plus difficile de le réduire. **Ne pas
> laisser ce patient sans traitement hypolipémiant au motif que la statine est écartée.****

Et la ligne d'écartement est **propre** : « *Statine de haute intensité — prévention secondaire écarté :
Intolérance aux statines (non / rapportée / avérée) = Avérée* ». Une branche, la vraie, en français.

**Deux réserves** : le titre a perdu « — alternatives hypolipémiantes », si bien que les alternatives
(acide bempédoïque, ézétimibe, anti-PCSK9) ne se lisent plus que dans la prose de preuve ; et cette prose
est **écrasante** (voir axe B).

## N15 — Le cas où tout se contredit (Mme Aguilar, 77 ans)

**Saisie : 20 actions, 1 écran, ~3 min.** Optimiser · Sulfamide + Insuline basale + Insuline rapide ·
HbA1c 7,8 / Au-dessus · **Insuffisance cardiaque Oui** · DFG **24** · Macroalbuminurie · 64 kg / 1,57 m ·
Fragilité Oui · Âge 77 · Risque hypoglycémique Élevé.

> `Mesure de sécurité` **Arrêter · Sulfamide (DFG < 30)** `Preuve faible` — *À faire d'emblée — sécurité*
> **Le choix de l'agent — en choisir un** — `Recommandée` **Ajouter · iSGLT2** `Preuve élevée` ·
> **Ajouter · AR GLP‑1** `Preuve modérée`
> *Chez un sujet fragile, surveiller le poids et l'état nutritionnel à l'instauration d'un incrétine
> (risque de sarcopénie / anorexie).*
> **Metformine écarté : DFG < 30** · **Sulfamide écarté : DFG < 30**

- **Ma question (c) est répondue nettement** : le gliclazide s'arrête, en tête d'écran, en mesure de
  sécurité.
- **Ma question (a) — « est-ce que je mets l'iSGLT2 ? » — reçoit un « oui » ferme** (`Recommandée`,
  `Preuve élevée`). Ce n'est pas faux au regard de KDIGO (DFG ≥ 20, IC, albuminurie) ; c'est une question
  clinique, pas un défaut d'écran.
- **Ce que l'outil ne peut pas savoir, il le déclare désormais** : le cadrage (cf. C23) nomme exactement
  les quatre faits qu'elle apporte et qu'il n'a pas regardés — kaliémie 5,3, hémoglobine 9,1, poids sec
  sous ascite, refus global de traitement. Le témoin écrivait : « *je m'attends à ce que l'outil ne sache
  pas répondre — et ce serait acceptable s'il le disait clairement.* » **Il le dit** — dans le cadrage,
  pas au moment où je bute, ce qui est le bon endroit pour un fait de périmètre.
- **D20** sort ici : « Arrêter · Sulfamide (DFG < 30) » et « Sulfamide écarté : DFG < 30 » sur le même
  écran.

## N16 — Deux raisons de baisser la même dose (M. Bouchard, 66 ans)

**Saisie : 21 actions, 1 écran, ~3 min.** Dose de metformine **non renseignée** — le cartouche d'ouverture
me disait « Commencez par : Traitements en cours, Intention, DFG », puis « Commencez par : DFG, Poids,
Taille » ; la dose n'a jamais été nommée, seul un « 1 à confirmer » discret sur la section TRAITEMENT la
signalait. Un praticien pressé la rate — je l'ai ratée.

> `Mesure de sécurité` **Réduire · Metformine** `Preuve faible` — *À faire d'emblée — sécurité*
> `Recommandée` **Remplacer · Gliptine** `Preuve modérée`
> **Le choix de l'agent — en choisir un** : `Recommandée` **Ajouter · iSGLT2** `Preuve élevée` · **Ajouter · AR GLP-1** `Preuve modérée`
> `Recommandée` **Optimiser l'agent mal toléré** `Preuve faible` — *Traitement à alléger*

Derrière les pastilles :

> **Proposé parce que : Metformine déjà en cours et Intolérance digestive**
> **Posologie : dose maximale ajustée au DFG : ≤ 2 000 mg/j si DFG 45-59, ≤ 1 000 mg/j si DFG 30-44 ;
> initiation ≤ 500 mg (KDIGO 2022 / RCP ANSM)**
> *Avantages* • **Réduire quand la dose ACTUELLE dépasse le maximum ajusté au DFG …, OU en cas
> d'intolérance digestive** … **Le praticien ajuste la dose exacte.**

**Ma question était : laquelle des deux raisons commande ?** L'outil répond — mais seulement au 3ᵉ niveau
de dépli. Le motif de la carte dit « et », pas « ou », et ne mentionne même pas le DFG à 41, qui est
pourtant la raison réglementaire.

**Test des 20 secondes :** « *Je descends la metformine, il y a un plafond à 1 g avec ce DFG. Je remplace
la sitagliptine par une gliflozine, preuve élevée. Et il y a une intolérance à traiter.* » — Je n'ai
**pas** retenu que la carte « Metformine écarté » ne parlait pas de la même chose que la carte « Réduire ·
Metformine ». Sur le moment, j'ai lu « on arrête la metformine ».

## N17 — L'agent protecteur qu'elle ne supporte pas (Mme Ferrand, 59 ans)

**Saisie : 27 actions, 1 écran, ~4 min.** Détail en **D15**. Deux points supplémentaires :

- **D8, la légende ment.** L'en-tête de colonne affiche une légende d'action réduite à « **Ajouter** »
  (`decision-node__legende-item` = « Ajouter »), alors que **la seule pastille de verbe présente sur
  l'écran est « Maintenir »** (relevé : `titles: ["Metformine","Optimiser l'agent mal toléré"]`,
  `pastilles: ["Maintenir"]`).
- Tant que la dose de metformine n'était pas saisie, l'écran affichait **1 seule option** et un bandeau
  « Reco provisoire ». Le blocage était **bien signalé** : « À renseigner pour trancher : **Dose de
  metformine (mg/j)** ». C'est le comportement que N25 n'a pas.

**En vraie consultation ?** **Non.** Je repars sans savoir par quoi remplacer la dapagliflozine.

## N18 — Les nausées qui font maigrir, mais trop (M. Delaunay, 48 ans)

**Saisie : 24 actions, 1 écran, ~3 min.**

**Le meilleur contenu de toute la passe est ici**, en alerte de nœud, déclenchée par l'intolérance
digestive chez un patient sous metformine **et** AR GLP‑1 :

> **Intolérance digestive : la metformine ET l'AR GLP‑1 / tirzépatide en sont deux sources. Privilégier
> généralement la réduction / l'arrêt de la METFORMINE (bénéfice le plus faible). L'intolérance ou la
> contre‑indication à la metformine ouvre d'ailleurs le remboursement d'une MONOTHÉRAPIE d'AR GLP‑1
> (dulaglutide/liraglutide) en France — formulaire Assurance Maladie, Art. 61 de la convention médicale,
> arrêté du 10/01/2025 : « en monothérapie, quand l'utilisation de la metformine est considérée comme
> inappropriée en raison d'une intolérance ou de contre‑indications ».**

Ça répond à une question que je n'avais pas posée (le remboursement) et qui est celle qui m'arrête en
pratique. **C'est du contenu que je n'ai nulle part ailleurs.**

**Cartes** : `Mesure de sécurité` **Réduire · Metformine** ; puis, sous la bannière *OPTIONS ÉQUIVALENTES…
L'OUTIL NE LES DÉPARTAGE PAS*, **Optimiser l'agent mal toléré** et **Réduire · AR GLP‑1**, les deux
`Recommandée`. Motif, verbatim : « **Proposé parce que : AR GLP‑1 déjà en cours et Intolérance avec perte
de poids excessive et Intolérance digestive** ».

**D14 — la pastille « Posologie » de la carte « Réduire · AR GLP‑1 » ne contient pas de posologie :**

> **Posologie : données sur l'arrêt complet (pas la réduction) : ~50 % de la baisse d'HbA1c reprise en
> 8-12 sem., ~60 % du poids repris à 52 sem. (EClinicalMedicine 2026) — argument pour réduire plutôt
> qu'arrêter ; surveiller 4-12 semaines après le geste.** · *non chiffrable* · *Avantages* • **Le praticien
> juge la dose.**

C'est honnête, utile, et **ce n'est pas une posologie**. Je clique sur « Posologie » parce que je cherche
« 0,5 mg » ; je reçois des données de rebond.

**Test des 20 secondes :** « *Je baisse la metformine d'abord, c'est elle qui donne le moins. Le
sémaglutide, je réduis plutôt que d'arrêter, sinon il reprend 60 % du poids en un an. Et si je dois arrêter
la metformine, le GLP-1 en monothérapie est remboursé.* » — **Le meilleur score de la passe.**

## N19 — L'acidocétose qui devrait fermer la porte (Mme Kaddour, 63 ans)

**Saisie : 22 actions, 1 écran.** Détail en **D5**. Réponse obtenue :

> **Socle** — `Recommandation officielle (France)` **Maintenir · Metformine** `Preuve faible`
> **Traitement à corriger ou remplacer** — `Recommandée` **Remplacer · Sulfamide** `Preuve modérée`
> **Le choix de l'agent — en choisir un** — `Recommandée` **Ajouter · iSGLT2** `Preuve élevée` · **Ajouter · AR GLP‑1** `Preuve modérée`
>
> Proposé parce que : **Insuffisance cardiaque et DFG < 60 et Albuminurie ≠ Normoalbuminurie et Agent sans
> bénéfice dur déjà en cours** — *Ce rang tient compte de : Insuffisance cardiaque et DFG < 60 et
> Albuminurie ≠ Normoalbuminurie*

Le raisonnement est juste, le classement est juste, la traçabilité du rang est excellente. **Il manque
seulement le seul fait qui compte chez elle**, et il n'a pas de case.

## N20 — Les myalgies avec une CK qui bouge (M. Ravel, 61 ans)

**Saisie : 17 actions + 3 modifications de la CK.** Détail en **D6** et **C2**.

**Ce que l'outil ne me dit à aucun moment : que faire du LDL à 1,38 pendant les 4 à 6 semaines
d'interruption.** Le nœud `statine` **n'a aucun champ LDL**. Chez un coronarien stenté, c'est la moitié de
ma question.

**En vraie consultation ?** **Oui, sans hésiter** — c'est le nœud le plus abouti du produit, et les bandes
de CK m'évitent une erreur que je pourrais faire.

## N21 — Le malaise au volant (M. Guerrero, 57 ans)

**Saisie : 26 actions, 2 écrans, ~5 min.** Détail en **D9**, **D10**, **D12**.

**Test des 20 secondes :** « *Cible 7 %. Je remplace le glimépiride, gliflozine ou GLP-1 au choix. Et je
peux désintensifier.* » — **Je n'ai pas retenu qu'il fallait baisser le sulfamide tout de suite**, parce
que cette carte-là était derrière un pli. Sur ce patient, c'est le seul geste qui compte avant qu'il
reprenne le volant.

**Rien, nulle part, sur l'aptitude à la conduite.** Attendu (hors périmètre) — mais le cadrage du nœud ne
le dit pas non plus.

## N22 — Quand il ne reste plus rien à piquer (Mme Nguyen, 70 ans)

**Saisie : 22 actions, 1 écran.**

**Pas de sortie muette : 5 options.** Socle metformine · Remplacer sulfamide · **Ajouter iSGLT2**
`Preuve élevée` · puis, sous « **Option de repli — à défaut de mieux** » : Gliptine et AR GLP‑1.

**Le refus de l'injectable est bien pris en compte — et de la bonne manière** : il ne retire pas l'option,
il la **déclasse**, et il le dit : « **Ce rang tient compte de : Préférence vis-à-vis de l'injectable =
Refuse** ». C'est exactement la bonne granularité (une préférence n'est pas une contre-indication).

**Trois réserves :**
- **La gastroparésie n'a pas de champ**, et n'apparaît dans aucune contre-indication de l'AR GLP‑1
  (« *2 contre-indications : Antécédent de pancréatite ; antécédent personnel/familial de cancer médullaire
  de la thyroïde ou NEM2* »).
- **La mention Rybelsus est toujours là**, mot pour mot : « **Refus des injections : préférer le
  sémaglutide oral ou une autre classe.** » Point trouvé par P10/S7, listé comme ouvert dans `STATUS.md`,
  **toujours non corrigé** — et il tombe exactement sur la patiente qui refuse les injections.
- Un iSGLT2 `Preuve élevée` chez une femme de 70 ans, IMC 24, sans indication cardio-rénale, avec des
  vomissements postprandiaux récurrents : c'est le terrain d'acidocétose euglycémique de N19. Rien ne le
  signale. **Les deux vignettes convergent sur le même trou.**

## N23 — Il veut courir, et son fond d'œil dit non (M. Sadi, 61 ans)

**Saisie : 14 actions, 2 écrans, ~2 min 30.** Détail en **D7** et **D11**.

**Alerte hypoglycémie à l'effort, verbatim, et elle est juste de ton :**

> **Sous insuline, sulfamide ou glinide, toute augmentation de la dépense énergétique majore le risque
> d'hypoglycémie À L'EFFORT : signaler le risque au patient (resucrage à disposition, autosurveillance
> autour de l'effort). Ce risque se prévient, il ne justifie pas de renoncer à bouger : aucune piste n'est
> bloquée.**

La dernière phrase désamorce exactement le réflexe qu'un généraliste a (« il est sous insuline, je
freine »). **Très bien écrit.**

## N24 — L'hyperphagie qu'on n'ose pas nommer (Mme Roussel, 34 ans)

**Saisie : 10 actions, 2 écrans.** Formulaire volontairement partiel (4 des 15 champs) : c'est ce qu'un
généraliste fait en 15 minutes, et l'outil rend quand même 5 options.

**C4 — le point le plus coûteux du protocole est CONFORME.** En cochant « **Signes d'appel d'un trouble du
comportement alimentaire** », le groupe **Orientation** apparaît, **en clair, sans repli** :

> **Orientation — gestes cumulables** · `Recommandée` — *OPTIONS ÉQUIVALENTES…*
> **Orienter vers le diététicien de la structure** `Preuve faible`
> **Proposer aussi un avis spécialisé en trouble du comportement alimentaire** `Preuve faible`

Et le libellé du champ porte sa définition et sa limite : « *Au moins un de ces trois signes (HAS, guide
parcours surpoids-obésité de l'adulte, encadré 11 p. 43)… **Le rôle du médecin généraliste s'arrête au
repérage et à l'orientation — ni le diagnostic ni le traitement ne se posent ici.*** »

**Une observation, probablement une intention et non un défaut, mais qui relève de la famille 10 :** ce
même clic **retire deux cartes de la liste visible** — « Ne pas remplacer une boisson sucrée par des
édulcorants intenses » et « Repérer un moment de grignotage récurrent » basculent dans « **Autres pistes
possibles (2)** ». Le comportement est probablement voulu (ne pas donner de consigne restrictive à une
patiente qui a un TCA) — **mais rien ne le dit**, et deux cartes disparaissent sans un mot.

## N25 — L'hyperglycémie inaugurale qui ne peut pas attendre (M. Bienvenu, 44 ans)

Détail en **constat n° 1**. Comptages : **`Traiter` = 17 actions** pour une réponse fausse ;
**`Insulinothérapie` = 16 actions** pour la bonne. Le point d'entrée n'est signalé nulle part.

Rien, sur aucun des deux écrans, sur la **recherche d'un diabète de type 1 de l'adulte** (anticorps,
peptide C) chez un homme de 44 ans qui perd 8 kg avec une cétonurie. Le cadrage des deux nœuds exclut bien
« hors DT1 », mais aucun ne me dit **comment savoir** que je suis hors DT1.

## N26 — La statine qu'on n'ose pas arrêter (Mme Vidal, 86 ans)

**Saisie : 8 actions, 1 écran, ~1 min.** Détail en **D16** et **D4**.

---

# Partie 3 — Les trois axes de consultation

## Axe A — Ergonomie de saisie

| Vignette | Nœud(s) | Écrans | Actions | Champs du nœud | Temps |
| --- | --- | --- | --- | --- | --- |
| N1 — Ferreira 46 | Traiter | 1 | **15** | 22 | ~2 min |
| N2 — Lantier 59 | Cible | 1 | **5** | 6 | ~35 s |
| N3 — Abadie 64 | Cible + Traiter | 2 | **24** | 6 + 22 | ~4 min |
| N4 — Kervarec 67 | Cible + Traiter + Statine | 3 | **34** | 6 + 22 + 10 | ~6 min |
| N5 — Traoré 71 | Traiter | 1 | **20** | 22 | ~3 min |
| N6 — Nowak 79 | Traiter | 1 | **18** | 22 | ~3 min |
| N7 — Chevallier 88 | Cible + Traiter | 2 | **24** | 6 + 22 | ~4 min |
| N8 — Sissoko 41 | Traiter | 1 | **17** | 22 | ~3 min |
| N9 — Ould-Amara 53 | RHD activité physique | 2 | **12** | 12 | ~2 min |
| N10 — Pereira 62 | Insulinothérapie | 1 | **16** | 18 → **13 sans capteur** | ~3 min |
| N11 — Renard 68 | Insulinothérapie | 1 | **18** | 18 | ~3 min |
| N12 — Diallo 57 | Traiter | 1 | **18** | 22 | ~3 min |
| N13b — Petit 44 | Traiter | 1 | **14** | 22 | ~2 min |
| N14 — Lombard 58 | Statine | 1 | **11** | 10 | ~1 min 30 |
| N15 — Aguilar 77 | Traiter | 1 | **20** | 22 | ~3 min |
| N16 — Bouchard 66 | Traiter | 1 | **21** | 22 | ~3 min |
| N17 — Ferrand 59 | Traiter | 1 | **27** | 22 | ~4 min |
| N18 — Delaunay 48 | Traiter | 1 | **24** | 22 | ~3 min |
| N19 — Kaddour 63 | Traiter | 1 | **22** | 22 | ~3 min |
| N20 — Ravel 61 | Statine | 1 | **17** | 10 | ~2 min |
| N21 — Guerrero 57 | Cible + Traiter | 2 | **26** | 6 + 22 | ~5 min |
| N22 — Nguyen 70 | Traiter | 1 | **22** | 22 | ~3 min |
| N23 — Sadi 61 | RHD activité physique | 2 | **14** | 12 | ~2 min 30 |
| N24 — Roussel 34 | RHD alimentation | 2 | **10** (partiel) | 15 | ~2 min |
| N25 — Bienvenu 44 | Traiter + Insulinothérapie | 2 | **17 + 16** | 22 / 18 | ~5 min |
| N26 — Vidal 86 | Statine | 1 | **8** | 10 | ~1 min |

**Le gain structurel de cette passe : l'accordéon.** Le formulaire n'expose plus qu'**une section à la
fois**, avec un bouton « Suivant : <section> → » et un résumé en une ligne des sections repliées. Trois
conséquences mesurées :

1. **`Insulinothérapie` n'écrase plus.** Le 02/08, le nœud « déclare une trentaine de champs » à
   l'ouverture. Ici, il ouvre sur **une seule question** (« Situation d'insulinothérapie · détermine la
   suite ») et s'adapte ensuite à ce que le patient permet de recueillir : **4 sections** chez le naïf
   (N25), **5 sections sans aucune donnée de capteur** chez le patient sans MCG (N10), **7 sections** en
   basal-bolus avec capteur (N11).
2. **Aucun défilement n'a été nécessaire** sur aucun nœud à 1000 px de haut. Toute la saisie tient dans le
   premier écran, colonne de gauche.
3. **Le formulaire se rétracte aussi selon l'intention** : *Initier* supprime la section TRAITEMENT — ce
   qui est élégant (je n'ai pas à déclarer « aucun traitement ») **et** ce qui produit D2.

**Le tri des valeurs demandées** (mesure la plus utile de l'axe), sur le nœud `Traiter` :

| Sous les yeux (dossier ouvert) | À aller chercher | Que je n'ai pas |
| --- | --- | --- |
| Traitements en cours, Dose de metformine, HbA1c actuelle, DFG, Albuminurie, Âge, antécédents CV/IC | Poids et Taille (si le patient n'a pas été pesé aujourd'hui) | **Par rapport à l'objectif** (jugement — et plus pré-rempli, cf. D12) · **Risque hypoglycémique du schéma** (jugement, mais bien défini) · **Espérance de vie** (calculée, à valider — sauf D17) |

**Le calcul dérivé est un vrai gain** : poids + taille → IMC ; CK + borne haute du labo → multiple de la
normale (« CK, en multiples de la normale 6,2 · calculé ») ; poids → doses d'insuline (« 0,1 U/kg ≈ 8 U/j ·
0,2 U/kg ≈ 17 U/j ») ; dose actuelle → dose cible (« Basale après +2 U ≈ 40 U/j », « Basale réduite (−2 U)
≈ 32 U/j »). **Quatre calculs que je faisais de tête et mal.**

**Le droit à l'erreur** : chaque champ chiffré et chaque drapeau porte un bouton « **Indisponible** » —
c'est-à-dire qu'on peut enfin déclarer « je ne l'ai pas », ce qui manquait cruellement à N7 le 02/08, et
l'écran en tire la bonne conséquence (C11). En revanche, cf. **D13**, « Rien à signaler » ne dit toujours
pas exactement ce qu'il vient de répondre.

**Conclusion carrée.** En consultation de 15 minutes : `Fixer la cible` (5 actions) et `Statine`
(8-17 actions) sont remplissables sans y penser. `Traiter` reste à **14-27 actions** — hors budget si je
dois aussi examiner le patient, mais l'accordéon rend l'effort **prévisible**, ce qu'il n'était pas.
Le champ où je décroche n'est plus un champ : c'est le moment où je découvre qu'il fallait aussi remplir la
**dose de metformine** que rien ne m'avait nommée.

## Axe B — Lisibilité et compréhension de la réponse

> ⚠ **Une seule capture d'écran exploitable sur toute la journée** (limite d'outillage n° 2). Les mesures
> ci-dessous sont des mesures DOM prises sur la carte de N14 ; aucune vignette de la seconde moitié
> (N1→N13, N15) n'a été jugée visuellement.

**Mesures sur la carte « Statine indisponible » (N14), à 1600 px :**

| Bloc | Hauteur | Part de la carte | Mots |
| --- | --- | --- | --- |
| Carte entière | **564 px** | 100 % | — |
| Rangée titre + badges | 48 px | **8,5 %** | 5 |
| Effet attendu (actionnable) | 75 px | 13 % | **76** |
| Délai du bénéfice | 14 px | 2,5 % | 4 |
| **Liste des essais (« D'après : … »)** | **249 px** | **44 %** | **275** |

**Le bloc le plus grand de la carte est celui qui ne se lit pas en consultation.** 44 % de la surface et
275 mots pour l'énumération des essais, contre 13 % et 76 mots pour ce que je dois faire. Sur la capture,
la masse bleutée de la bibliographie domine la colonne de droite, et la phrase qui compte (« *Ne pas
laisser ce patient sans traitement hypolipémiant…* ») est un petit paragraphe au-dessus.

Ce n'est pas un argument pour retirer les essais — c'est **la valeur propre de ce produit**, et la qualité
du texte est remarquable (« *ODYSSEY OUTCOMES — … Aucun HR propre à la strate diabète n'est publié — **ne
pas en inventer un**.* » ; « *le seul NNT réellement publié du dossier est 43* »). C'est un argument pour
que **cette masse soit derrière un dépli**, comme l'est déjà l'argumentaire complet.

**La carte compacte : le défaut n° 1 du 02/08 est corrigé, et le prix est payé ailleurs.** Les intitulés
sont désormais des noms de classe — relevé brut : `["Metformine","Gliptine","iSGLT2","AR GLP‑1","Optimiser
l'agent mal toléré"]` — et la carte tient sur une ligne. **Mais** :

- le titre ne dit plus **pourquoi** (« Réduire la posologie de la metformine *(fonction rénale altérée ou
  intolérance digestive)* » est devenu « Metformine ») ;
- **deux options portent le même titre sur le même écran** : `Remplacer · Sulfamide` et `Réduire ·
  Sulfamide` (N21) ; `Arrêter · Sulfamide (DFG < 30)` et « Sulfamide écarté » (N15) ; `Réduire ·
  Metformine` et « Metformine écarté » (N16, N18, N5). C'est **D20**, et la cause directe du constat n° 2.

**Test des 20 secondes, résultat brut par vignette :**

| Vignette | Ce que j'ai retenu | Ce que j'ai manqué |
| --- | --- | --- |
| N1 | metformine, paliers de 15 j, 2 g/j | rien d'important |
| N2 | cible 7 %, IDM non fatal mais pas la mortalité | rien (regagné depuis le 02/08) |
| N16 | dose plafond, remplacer la gliptine, gliflozine | j'ai lu « Metformine écarté » comme « arrêter la metformine » |
| N18 | baisser la metformine d'abord ; réduire plutôt qu'arrêter ; remboursement monothérapie | rien d'important |
| N19 | remplacer le sulfamide, ajouter une gliflozine | **que la gliflozine lui a valu une réanimation** (l'écran ne pouvait pas le savoir) |
| N20 | arrêter, rhabdomyolyse, avis urgent | — mais le titre de la carte disait encore « interrompre 4 à 6 semaines » |
| N21 | remplacer le glimépiride | **baisser le sulfamide tout de suite** (replié) |
| N25 | metformine | **l'insuline** (l'alerte la nomme, la carte non) |

**Deux points manqués sont des contre-indications ou des urgences (N21, N25). Ce sont des défauts graves,
pas des remarques de confort.**

**Ce qu'on emporte.** Sur `Traiter`, dicter deux lignes dans le dossier est possible : le motif (« Proposé
parce que : … ») est repris tel quel. Sur `Statine`, non : il faut fabriquer la phrase à partir de 275 mots
d'essais.

## Axe C — Fidélité au raisonnement de consultation

**1. L'ordre des questions.** `Traiter` ouvre toujours sur l'intention, et **le premier choix verrouille
désormais des sections entières**. *Initier* supprime la section TRAITEMENT — d'où **D2**. **Récupérable ?**
Oui, en changeant d'intention et en revenant — mais rien à l'écran ne le suggère, et un praticien naïf ne
le devine pas.

**2. Trancher avant de savoir.** Deux endroits, tous deux sur `Traiter` : « Par rapport à l'objectif fixé
pour ce patient » (**D12** : il n'est plus déduit) et « Risque hypoglycémique du schéma ». Ce dernier reste
le meilleur exemple d'un champ de jugement bien accompagné : « **Un jugement clinique, pas une simple case
du dossier** : « Élevé » si le schéma en cours expose (sécrétagogue…) ou si le terrain exposerait un futur
traitement même sans hypoglycémiant actuel… ». **Inchangé et excellent.**

**3. Le coût du découpage en nœuds — chiffré.**

| Enchaînement | Valeurs reprises automatiquement | Valeurs à ressaisir à l'identique |
| --- | --- | --- |
| `Fixer la cible` → `Traiter` (N3, N4, N7, N21) | **Âge**, parfois **Fragilité** | HbA1c cible (n'existe plus sur `Traiter`) ; la position par rapport à l'objectif ; **l'antécédent cardiovasculaire, qui change de nom** |
| `Traiter` → `Statine` (N4) | **Âge, Maladie CV athéromateuse, Ancienneté** | autres FDR, diabète compliqué, dialyse |
| `RHD activité physique` → `RHD alimentation` (N23→N24) | **Fragilité** | le reste |
| `Traiter` → `Insulinothérapie` (N25) | — (passé par « Repartir de zéro ») | HbA1c actuelle, HbA1c cible, DFG, poids, âge, glucotoxicité = **6 valeurs** |
| Retour sur `Fixer la cible` en fin de consultation (N4) | Âge, Ancienneté | **Antécédent cardiovasculaire et Fragilité — et l'écran refuse désormais de conclure sans** (C8) |

Le compteur « **Session : N valeurs** » de la barre du haut rend ce partage visible et vérifiable — c'est
lui, et non le libellé du bouton, qui m'a permis de prouver que « Nouveau patient » purge bien. **Il
devrait être plus visible : c'est le seul témoin fiable de l'état de la session.**

**4. Le point d'entrée.** La liste des cinq nœuds parle la langue de la consultation. Mais **N25 montre la
limite** : mon patient relève d'un nœud (`Insulinothérapie`) que son titre ne me désigne pas — je ne veux
pas « faire de l'insulinothérapie », je veux savoir quoi faire d'une cétonurie. Et l'écran `Traiter`, où
j'entre naturellement, ne me renvoie pas vers lui.

**5. Le périmètre, dit au bon moment.** **C'est le progrès le plus net de la journée.** Le cadrage de
`prescription` nomme désormais les faits qu'il n'a pas regardés (kaliémie, hémoglobine, poids sec, refus
global — C23) ; `statine` déclare la fragilité de la preuve après 75 ans ; `rhd-activite-physique` déclare
qu'il retire plus que la source ; `insuline` déclare qu'aucun rythme de désescalade n'est sourcé et qu'il
est légitime de différer sans capteur. **Mal fait, en revanche, sur ce qui manque sans être déclaré** :
gastroparésie (N22), antécédent d'acidocétose (N19), hypoglycémies sévères (N21), recherche de DT1 (N25).
Ceux-là sont absents, ce qui est indiscernable, pour moi, d'un oubli de ma part.

**6. La question que je poserais et que je ne peux pas poser :** *« Ce médicament, il ne le supporte pas —
lequel j'arrête et par quoi je le remplace ? »* L'outil sait dire qu'il y a **une** intolérance (booléen) et
**de quelle nature** (digestive, génito-urinaire, perte de poids, cutanée, autre). Il ne sait pas dire **à
quel médicament**. Sur un patient sous trois classes, c'est la moitié de l'information. Sur N18, il s'en
sort par une alerte remarquablement écrite qui raisonne sur les deux sources possibles — mais c'est du
contenu rédigé à la main pour un cas ; ça ne passe pas à l'échelle.

---

# Partie 4 — Familles de défaut candidates (§4bis)

## Famille candidate — « Un fait clinique existe dans l'outil, mais pas sur le nœud où la décision se prend »

Ce n'est pas « un champ manque » (famille 5, connue) : le champ **existe**, ailleurs, correctement défini.

- **Occurrence 1 (N21, `cible-glycemique` + `prescription`)** — « Hypoglycémies sévères récurrentes /
  non-perception » est un champ du nœud `Insulinothérapie`. Il n'existe ni sur `cible-glycemique` ni sur
  `prescription`. Résultat : cible ≤ 7 % et aucune carte de sécurité chez un chauffeur PL resucré à
  0,38 g/L.
- **Occurrence 2 (N25 / N21, `prescription` vs `insuline`)** — « HbA1c cible (%) » est un champ du nœud
  `Insulinothérapie`. Il a disparu de `prescription`, où il ne reste que le jugement « Par rapport à
  l'objectif », qui n'est plus pré-rempli.
- **Occurrence 3 (N19 / N7)** — le fait « acidocétose euglycémique sous iSGLT2 » est parfaitement connu du
  contenu (alerte de 8 lignes sur N7) mais n'existe comme **antécédent déclarable** nulle part.

**La propriété de l'outil qui les produit :** chaque nœud déclare **son propre** vocabulaire de critères, et
le partage inter-nœuds est un mécanisme de **pré-remplissage** (mémoire de session), pas un mécanisme de
**complétude**. Rien, dans le produit ni dans le banc, ne vérifie qu'un fait clinique de sécurité
déclarable quelque part est déclarable **partout où il change une conduite**. C'est le même angle mort que
l'invariant I4 (`terrain_fragile` défini deux fois), noté dans `STATUS.md` comme « vérifié par nœud, donc
aveugle » — mais élargi : ce n'est pas seulement une définition qui diverge, c'est un fait qui manque.

## Famille candidate — « Le correctif n'a pas été propagé au nœud voisin »

- **Occurrence 1 (D18)** — le « **: non** » d'une citation négative, corrigé sur `prescription`
  (« Pas de sur-contrôle glycémique », C14), subsiste tel quel sur `insuline` (« ni MCG disponible : non
  et Glycémie à jeun sous la cible »).
- **Occurrence 2 (D3)** — le rendu qui réduit une condition à sa branche vraie fonctionne sur `statine`,
  sur `rhd`, et sur les conditions simples de `prescription`, mais pas sur la disjonction de
  `prescription`.

**La propriété qui les produit :** les correctifs de rendu sont validés **sur le nœud où le défaut a été
constaté**, et le banc de tests est organisé par nœud. Un invariant transversal (« aucun champ affiché ne
contient `: non` », « aucun motif affiché ne contient `ou` suivi d'une conjonction ») fermerait les deux
d'un coup.

## Occurrences isolées, rapportées comme telles (pas de famille)

- **Le résumé de section n'est pas exhaustif** (D13) : deux occurrences (`prescription`, `statine`), sans
  cause mécanique identifiée.
- **Une pastille dont le nom ne décrit pas le contenu** (D14, « Posologie » sans posologie) : une seule
  occurrence.
- **Un motif qui cite deux fois la même condition** (D19) : une seule occurrence.

---

# Clôture

## Les trois points les plus graves, classés

1. **N25 — la réponse fausse au patient urgent.** L'alerte prescrit l'insuline, la carte prescrit la
   metformine, l'option « Insuline d'initiation » n'est ni retenue ni écartée (absente du DOM), et le
   critère qui bloque tout n'a plus de champ. Quatre défauts au même endroit, sur le seul patient du banc
   qui ne peut pas attendre la prochaine consultation.
2. **D3 / D20 — l'expression logique brute et les deux « Metformine ».** Parce que c'est du langage machine
   dans un écran clinique (famille 8, réputée fermée) **et** parce que le mot « écarté » sous une carte
   « Réduire » se lit comme un ordre d'arrêt. Reproduit sur trois patients — et **circonscrit** à une seule
   option et à un seul mode de rendu, donc court à corriger.
3. **D5 (N19) et N22 — les deux angles morts de sécurité de l'iSGLT2** (antécédent d'acidocétose
   euglycémique, terrain de déshydratation/gastroparésie). Deux vignettes indépendantes tombent dessus, et
   dans les deux cas l'écran badge la classe `Recommandée · Preuve élevée` — alors que le contenu, lui,
   sait parfaitement de quoi il s'agit (cf. l'alerte de N7).

**Puis, juste derrière : D17**, nouveau, discret, et il touche le parcours le plus fréquent du produit
(deux nœuds à la suite). Le correctif est probablement aussi court que celui de D3.

## Ce que la refonte D48 apporte, vu de l'écran

**Le bilan est nettement positif**, et il faut le dire aussi clairement que les défauts :

- **Les motifs sont devenus des phrases de consultation** : « *Proposé parce que : AR GLP‑1 déjà en cours et
  Intolérance avec perte de poids excessive et Intolérance digestive* », « *Ce rang tient compte de :
  Préférence vis-à-vis de l'injectable = Refuse* ». Le rang est traçable, ce qui est neuf.
- **Les alertes de nœud sont le meilleur contenu du produit** et arrivent au bon moment : intolérance
  digestive et remboursement du GLP‑1 en monothérapie (N18), iSGLT2 + infections génito-urinaires (N17),
  neuropathie et segment corporel (N23), prévention primaire après 75 ans (N26), CK par bande (N20),
  acidocétose euglycémique du dénutri (N7), titration sans capteur (N10).
- **L'honnêteté sur la preuve est visible sans dépli** : « *ne pas en inventer un* », « *le seul NNT
  réellement publié* », « *estimations ponctuelles de mortalité DÉFAVORABLES* », « *essai OUVERT,
  comparateur = conseils diététiques* », « *93 % est une proportion d'ÉPISODES, pas de patients* ».
- **Et elle a fait sortir une dette qu'elle n'a pas créée** : les 19 titres d'essais amputés du nœud
  statine dormaient depuis P10, invisibles.

## Ce que je n'ai pas pu tester

- **La largeur mobile (375 px)** : pas faite. Le seuil des deux colonnes (D47, 1200 px) et le CTA flottant
  entre 960 et 1199 px n'ont **pas** été jugés.
- **La dimension visuelle des vignettes N1→N13 et N15** : les captures ont cessé de fonctionner. Seule la
  carte de N14 a été mesurée.
- **Le comportement sous contrainte violée** (P0-c : TBR incohérents sur `insuline`) : le banc n'a pas de
  vignette pour ça, et je ne l'ai pas fabriquée.
- **N13a** : non jouée séparément, recouverte par N16.
- **Le nœud `Alimentation` en entier** (15 champs) : rempli partiellement en N24 seulement.
- **Le chevauchement bulle/panneau de pastille** signalé le 02/08 : **NON REPRODUIT** — le pilotage
  programmatique ne déclenche pas le survol, et les mesures de rectangles sont revenues à zéro.

## Mon impression d'ensemble, en praticien

Le produit a changé de nature entre le 2 et le 4 août. Ce n'est plus un outil qui affiche des
recommandations : c'est un outil qui **dit ce qu'il n'a pas regardé**. Le cadrage nomme les faits qu'il
ignore, les cartes disent quand un chiffre manque pour calculer, les alertes disent quand la source ne
tranche pas, le nœud cible refuse de répondre sur un dossier amputé plutôt que d'inventer une cible, et
l'insulinothérapie se rétracte au format du patient qu'on a devant soi.

**J'ouvrirais cet outil en consultation, et plus souvent qu'il y a deux jours.** Le passage en accordéon a
réglé le problème qui me faisait renoncer (`Insulinothérapie` était illisible, il ne l'est plus), les
calculs dérivés me donnent quatre chiffres que je faisais mal, et les alertes de nœud me disent des choses
que je n'ai nulle part ailleurs — le remboursement du GLP‑1 en monothérapie, les seuils de CK, le rythme de
désescalade de l'insuline, ce que la HAS n'a pas démontré.

C'est précisément ce qui rend les défauts restants **d'autant plus visibles** : là où l'outil se tait
honnêtement partout ailleurs, les trois endroits où il parle encore trop fort — la metformine « écartée »
en langage machine, l'insuline qui disparaît chez le patient à cétonurie, et l'HbA1c à 6,4 % qu'on ne remet
pas en question — détonnent.

**Là où j'ai décroché, précisément :** N25, à la seconde où j'ai lu « **À renseigner pour trancher :
Traitements en cours** » sous un formulaire qui n'a pas de section Traitements. Pas parce que c'était
pénible — parce que **j'ai compris que l'écran pouvait me demander l'impossible et me répondre quand
même**. Sur ce patient-là, l'outil m'a donné une réponse fausse avec un badge, et m'a retiré le moyen de la
corriger. C'est le seul moment des 26 vignettes où j'aurais fermé l'onglet et téléphoné.
