# Nœud RHD — axe activité physique — grille de recueil et bibliothèque de pistes

> Document de conception. **Aucun YAML, aucun code.** Périmètre strict : axe **activité physique**
> (pratique structurée, activité quotidienne/déplacements, sédentarité). L'axe alimentation est traité
> par ailleurs et n'est pas abordé ici.
>
> Répond à `docs/decision/validation/recette-2026-07-25-prescription-intensifier.md`, section
> « Analyse de pertinence du module RHD », §1-8 (diagnostic : le nœud actuel ne collecte qu'un
> booléen — `activite_physique_reguliere` — sur cet axe, et deux patients opposés reçoivent la même
> recommandation mot pour mot). Prend appui sur `docs/decision/noeuds/H-rhd.md` §8 (arbitrages déjà
> tranchés par le référent : `motivation`/`capacite_activite` = modulation d'affichage, jamais de
> gating dur ; §8-4).

## Révisions (2026-07-26)

Mise à jour en place suite à (1) la vérification adversariale `redteam-collectes-rhd.md` (rapport
activité physique jugé « exploitable tel quel », 1 imprécision de page + 1 étiquette généreuse) et (2)
l'intégration de quatre sources nouvelles (référent). Document de travail — pas un livrable figé.

**Corrections red-team**
- **B-1 [BASSE]** — S7 (P1) citait `Lifestyle education...pdf` p. 5/6 ; la phrase est en réalité p. 6/6
  (vérifié par extraction page à page, `pdftotext`). Corrigé.
- **B-2 [MOYENNE]** — piste 4.2 (« Maintenir la pratique actuelle ») ancrait sa provenance sur R.24,
  qui prescrit un programme structuré pour un patient qui en a besoin, pas un principe de maintien
  pour un patient déjà actif. Provenance réécrite : ancrage principal = point EBM directeur ebmfrance
  (§0, grade A) ; R.24 n'est plus retenu que pour la composition du programme en cas de diversification.
- **B-3 [BASSE / point de vigilance, non tranché par le red-team]** — la proposition de faire passer
  l'alerte G3/D15 d'un simple déclenchement à un blocage effectif n'était pas signalée comme un
  changement de nature par rapport à l'arbitrage §8-5 de `H-rhd.md` (alimentation, alerte conservée
  non bloquante). Signalement explicite ajouté (note sous P4, et point 4 des « Points laissés
  ouverts ») ; non tranché ici, à soumettre au référent.
- **Correction proactive hors red-team** : la piste 4.1 affichait un chiffre de programme (« 2 à 3
  séances par semaine, sur 3 mois ») directement dans le geste proposé, ce que la règle structurelle du
  référent formalisée le même jour (`CONCEPTION-module-rhd.md` §0, « mouvement, jamais cible chiffrée »)
  interdit désormais explicitement. Chiffre déplacé en provenance/argumentaire, geste reformulé en
  registre de mouvement (« envisager d'engager… avec l'accompagnement d'un professionnel »).

**Sources intégrées**
1. `HAS activité physique.pdf` (« Guide des connaissances sur l'activité physique et la sédentarité »,
   HAS, juillet 2022, 57 p., lue par aucun agent avant ce jour) — traitée en priorité. Apporte : les
   repères chiffrés OMS/HAS (150-300 min/semaine, pas de volume minimal, fractionnement even < 10 min),
   la citation anti-dogme sur les 10 000 pas (ancrage direct de la nouvelle piste 3.4), la définition
   réglementaire de l'APA, des seuils pratiques chaleur/hydratation et une nuance sur le mal perforant
   plantaire (G5), une nouvelle piste (3.4, comptage de pas progressif) et une entrée « Diabète de type
   2 » dans son Tableau 1 des bénéfices (réduction de mortalité toutes causes/CV) — **vérifiée
   épidémiologique/observationnelle (ACSM 2018 / Physical Activity Guidelines Advisory Committee 2018,
   pas un ECR)**, donc classée recommandation officielle, pas EBM-dur (voir §0, nuance explicite). Ne
   contredit ni ne rehausse le constat « zéro piste EBM-dur » de ce dossier.
2. `4DDK001_400x600_50PC_AFF_reco chaque petit pas compte_E2_VDEF.pdf` (PNNS/Santé publique France) —
   son titre (« Pour un mode de vie plus équilibré, chaque petit pas compte ») repris en §0 comme
   illustration du registre attendu ; ses catégories non chiffrées Augmenter/Réduire citées pour
   l'activité physique et le temps assis.
3. `10_petites_astuces_anti-sédentarité.pdf` (Santé publique France) — source principale de 5 nouvelles
   pistes concrètes (1.2, 2.2, 2.3, 2.4, 3.5), comblant le déficit de gestes concrets signalé sur la
   famille « rupture de sédentarité ».
4. Trois pages `mangerbouger.fr` (récupérées 2026-07-26, citées par URL + extrait) — repères chiffrés
   cap (30 min/j, 2x/semaine renforcement) et citations secondaires pour les pistes 1.2/2.2/2.4 ; la
   page « Rester en forme après 65 ans » corrobore indépendamment les précautions chaleur/hydratation
   ajoutées à G6, et introduit un **troisième seuil de rupture de sédentarité (toutes les 2 heures)**,
   signalé en note S5 sans trancher.

**Bilan chiffré** : 6 pistes ajoutées (1.2 ; 2.2, 2.3, 2.4 ; 3.4, 3.5), toutes étiquetées
**recommandation officielle** — aucune EBM-dur, aucune nouvelle « À SOURCER » (le total reste 1,
piste 5.3, inchangé). Total pistes de la bibliothèque : 10 → 16.

---

## 0. Cadrage et point EBM directeur

Le recadrage demandé : **l'EBM donne la cible, les pistes organisent le rapprochement.** Sur l'axe
activité physique, la cible EBM la mieux étayée n'est **pas** un chiffre de fréquence ou de durée,
mais un principe de prédiction :

> *« Regular physical exercise predicts good long-term results (A), whereas rapid weight loss at the
> beginning does not. »*
> — `sources/Lifestyle education in type 2 diabetes _ ebmfrance.pdf`, p. 4/6, section « 2. Discuss
> the aims » (Duodecim/EBM Guidelines, mise à jour 25/11/2021). **Grade A.**

Vérifié verbatim dans le PDF (pas de paraphrase). Le grade A porte sur l'activité physique
**régulière** comme **prédicteur** de bons résultats à long terme — ce n'est pas un essai contrôlé sur
un critère cardiovasculaire dur (voir la nuance de provenance en P3). C'est cette régularité, plus que
l'intensité ou la perte de poids initiale, que la grille de recueil (P1) et les pistes (P2) doivent
chercher à faire progresser.

**Révision 2026-07-26 — règle structurelle formalisée entre-temps par le référent** (`CONCEPTION-module-rhd.md`,
décision référent 2026-07-26, « RÈGLE STRUCTURELLE — le module propose un MOUVEMENT, jamais une CIBLE
CHIFFRÉE ») : l'objectif est de *« suggérer des recommandations pour se rapprocher de l'objectif
démontré, pas de proposer des cibles à atteindre »*. Cette collecte respectait déjà l'esprit de la
règle (aucun geste de P2 ne comparait le patient à un seuil), à une exception près : la piste 4.1
affichait un chiffre de programme (« 2 à 3 séances par semaine, sur 3 mois ») directement dans le
geste — corrigé en P2 (cf. Révisions en tête de document). Conséquence pour la lecture de la suite :
**les repères chiffrés ci-dessous décrivent le cap, jamais un geste à proposer tel quel au patient.**

### Repères chiffrés officiels (le cap, pas les gestes)

Trois nouvelles sources (référent, 2026-07-26) précisent ce cap, sans changer le niveau de preuve —
voir la nuance ajoutée au « Second repère » ci-dessous :

- **OMS/HAS** — volume hebdomadaire : un « volume de 150 minutes par semaine d'AP d'intensité
  modérée... a été choisi comme recommandation d'AP pour la plupart des adultes en bonne santé », avec
  un palier au-delà duquel les bénéfices supplémentaires s'amenuisent : « chez les patients souffrant
  de comorbidités, au-delà de 300 min par semaine d'AP d'intensité modérée, les effets bénéfiques
  supplémentaires deviennent limités, tandis que les risques sanitaires augmentent » — `HAS activité
  physique.pdf` p. 12 (« Guide des connaissances sur l'activité physique et la sédentarité », HAS,
  validé juillet 2022). **Aucun volume minimal en dessous duquel il n'y a aucun bénéfice** : « il ne
  semble pas qu'il y ait un volume minimal d'AP nécessaire pour avoir des bénéfices pour la santé »
  (idem, p. 12) — et la durée quotidienne recommandée « peut être réalisée de façon continue... ou de
  façon fractionnée », des périodes « même inférieure[s] à 10 minutes » comptant dans le calcul (idem,
  p. 13). Ces deux nuances sont déjà le principe derrière les pistes 3.1/3.2 ; elles gagnent ici une
  source HAS dédiée, en complément d'ebmfrance.
- **mangerbouger.fr** (Santé publique France, page « Augmenter l'activité physique », récupérée
  2026-07-26) : « Au moins 30 minutes d'activités physiques dynamiques par jour » et, pour plus de
  bienfaits, « deux fois par semaine des activités de renforcement musculaire, d'assouplissement et
  d'équilibre » — cohérent avec le repère OMS/HAS ci-dessus (30 min × 5 j ≈ 150 min/semaine), formulé
  pour le grand public plutôt que gradé.
- **Le pas — meilleure illustration du principe « mouvement, pas cible »**, verbatim `HAS activité
  physique.pdf` p. 17-18 : « Cet objectif de 10 000 pas journalier ne doit pas être établi ni imposé
  comme un dogme ; il vaut mieux, dans un souci d'efficacité, proposer au patient d'augmenter son
  nombre de pas progressivement (+ 1 000 à 3 000 pas hebdomadaires) et souligner que **chaque pas en
  plus est bénéfique pour sa santé**. » C'est la HAS elle-même qui formule ici la règle du référent —
  cette citation ancre directement la nouvelle piste 3.4 (P2).

**Le titre de l'affiche PNNS reprise ci-dessous résume mieux que tout le reste ce registre** :

> *« Pour un mode de vie plus équilibré, chaque petit pas compte. »*
> — `4DDK001_400x600_50PC_AFF_reco chaque petit pas compte_E2_VDEF.pdf` (Santé publique France / PNNS,
> affiche 1 page, réf. DT05-177-24A). L'affiche classe chaque geste en trois catégories non chiffrées
> — **Augmenter**, **Aller vers**, **Réduire** — jamais en cible ; sur l'axe de ce document, elle range
> « L'activité physique » sous **Augmenter** et « Le temps passé assis » sous **Réduire**, sans aucun
> chiffre (le reste de l'affiche porte sur l'alimentation, hors mission, non repris ici).

Second repère de cadrage, tiré du dossier de preuve existant (`docs/decision/noeuds/H-rhd.md`, §3
sous-dossier H3) : **« Aucun bénéfice CV dur propre à l'exercice » n'est démontré** dans le corpus déjà
réuni pour ce nœud (le seul bénéfice CV dur des MHD est le régime méditerranéen — axe alimentation,
hors mission). Ce constat est repris en P3 : aucune piste de l'axe activité physique ne porte
l'étiquette « bénéfice EBM sur critère dur ».

**Nuance ajoutée 2026-07-26 — à ne pas lire comme un relèvement de niveau de preuve** (consigne
explicite du référent) : `HAS activité physique.pdf`, Tableau 1, p. 8 et p. 10, classe pour le
« Diabète de type 2 » : « Réduction du risque de mortalité toutes causes confondues en population
générale, incluant les DT2 (20) », « Réduction du risque de mortalité cardio-vasculaire »,
« Amélioration des marqueurs de progression de la maladie : HbA1C, pression artérielle et du profil
lipidique ». La référence (20) pointe vers *ACSM's Guidelines for exercise testing and prescription*
(American College of Sports Medicine, 2018), qui synthétise elle-même la littérature épidémiologique
en « relation dose-réponse » (cohortes prospectives — le même registre que le rapport 2018 du
*Physical Activity Guidelines Advisory Committee*, cité par ailleurs dans ce même guide p. 8, réf.
18) — **pas un essai contrôlé randomisé sur critère dur**. Ce tableau HAS ne contredit donc pas le
constat de `preuve-activite-physique.md` (« aucun ECR d'exercice isolé dans le DT2 établi ne montre de
bénéfice sur critère dur ») : c'est une association épidémiologique de population, portée par une
source officielle — elle reste classée **recommandation officielle**, pas **bénéfice EBM sur critère
dur**.

---

## P1 — Grille de recueil « activité physique »

Trois registres distincts, chacun un levier différent (HAS guide surpoids-obésité,
`sources/guide HAS._parcours_surpoids-obesite_de_ladulte.pdf`, §3.5.1, p. 41 : « les habitudes de
pratique de l'activité physique, les modes de déplacement dans le quotidien... les comportements
sédentaires »).

### Socle court (7 items — visée : moins de 3 minutes en consultation)

| # | Registre | Intitulé tel qu'affiché | Type | Valeurs proposées | Source (fichier · page/section) |
|---|---|---|---|---|---|
| S1 | Pratique structurée | « Au cours d'une semaine habituelle, combien de fois faites-vous une activité physique au point d'être essoufflé(e) et de transpirer ? » | `enum` | jamais / 1×semaine / 2-3×semaine / ≥ 4×semaine | `Lifestyle education in type 2 diabetes _ ebmfrance.pdf`, p. 3/6, §1 « Assess the patient's situation » — verbatim : *« How many times a week does the patient exercise so that he/she becomes short of breath and sweats? »* |
| S2 | Pratique structurée | « Quand vous pratiquez, combien de temps dure en général une séance ? » | `enum` | < 10 min / 10-30 min / > 30 min | idem, même paragraphe — *« How long is an exercise session? »* |
| S3 | Activité quotidienne / déplacements | « Pour vos trajets courts du quotidien (moins de 20-30 minutes), vous déplacez-vous plutôt... ? » | `enum` | à pied ou à vélo / en véhicule motorisé ou transport assis / mixte | `guide HAS._parcours_surpoids-obesite_de_ladulte.pdf`, §3.5.1, p. 41 : « les modes de déplacement dans le quotidien (trajet à pied ou à vélo par exemple) » |
| S4 | Sédentarité | « En dehors du sommeil, environ combien d'heures par jour passez-vous assis(e) ou allongé(e) (travail, écrans, trajets) ? » | `enum` | < 4 h / 4-8 h / > 8 h | idem, p. 41 : « l'évaluation du niveau ... de sédentarité (temps passé au quotidien en position assise ou allongée en dehors des temps de sommeil, le temps consacré aux écrans...) » |
| S5 | Sédentarité | « Lors de longues périodes assises, avez-vous l'habitude de vous lever et de bouger régulièrement ? » | `bool` | oui / non | idem, p. 41 : « les habitudes de rupture de la sédentarité » — repère chiffré en Fiche 5, p. 189 (cf. note ci-dessous, divergence de seuil) |
| S6 | Transverse (aptitude/sécurité) | « Avez-vous une limitation physique connue (articulaire, respiratoire, cardiaque, autre) qui restreint votre activité ? » | `bool` (+ champ libre optionnel) | oui / non | idem, p. 41 : « les aptitudes physiques de la personne, les éventuelles restrictions liées ou non au surpoids ou à l'obésité » — affine la variable déjà existante `capacite_activite` du nœud actuel |
| S7 | Transverse (négociation) | « Y a-t-il une activité physique que vous aimez ou aimeriez pratiquer davantage ? » | `enum`/texte court | ouvert (aide au choix de piste, ne bloque rien) | `Lifestyle education...pdf`, p. 6/6, §3 : *« All forms of exercise that the patient likes and that are feasible for him/her are suitable »* ; `guide HAS...pdf`, p. 41 : « les goûts pour l'activité physique » |

**Note S5 — seuil retenu par le référent (R.16), et panorama des repères voisins (signalés, non
tranchés).** Le référent a tranché le seuil de rupture de sédentarité pour ce nœud : **minimum une
minute par heure (HAS DT2, R.16, grade C)**, retenu comme repère par défaut. Quatre documents donnent
cependant un chiffre différent pour cette même habitude — aucun des trois suivants ne remet en cause
le choix du référent, ils sont rapportés tels quels, conformément à la consigne de signaler plutôt que
trancher :
- `strategie_therapeutique...pdf` (HAS DT2, mai 2024), **R.16**, p. 12, **grade C** — *retenu* : « Il
  est recommandé d'encourager les patients vivant avec un DT2 à rompre les temps prolongés assis en se
  levant et en bougeant **au moins une minute toutes les heures** (grade C). »
- `guide HAS._parcours_surpoids-obesite_de_ladulte.pdf` (guide surpoids-obésité, janv. 2023 — maj
  févr. 2024), Fiche 5, p. 189, **non gradée** : « rompre les temps prolongés assis en se levant pour
  bouger, mobiliser ses articulations, **au moins 4 à 5 minutes toutes les heures et demie**. »
- **[Ajout 2026-07-26]** `HAS activité physique.pdf` (Guide des connaissances sur l'activité physique
  et la sédentarité, HAS, juillet 2022), p. 15, **non gradée**, registre international/général (pas
  spécifique DT2) : « si les périodes de sédentarité sont interrompues par de courtes périodes
  (**minimum : 1 minute, voire 5 minutes**) de position debout ou mieux par une AP d'intensité légère,
  les effets délétères de la sédentarité sont réduits ». Le plancher (1 min) corrobore R.16 ; le
  document ajoute une réserve d'exactitude importante, non présente dans R.16 : « des données récentes
  (18) considèrent que les preuves sont encore insuffisantes pour affirmer que ces ruptures limitent
  les effets délétères de la sédentarité » — à signaler au référent comme nuance d'incertitude sur la
  littérature internationale sous-jacente, sans que cela change le statut gradé (C) de R.16 lui-même.
- **[Ajout 2026-07-26]** `mangerbouger.fr`, page « Réduire le temps passé assis » (Santé publique
  France, récupérée 2026-07-26), **non gradée**, grand public : « Ne restez pas assis trop longtemps,
  prenez le temps de marcher un peu **toutes les 2 heures** » — repris à l'identique sur la page
  « Rester en forme après 65 ans ». C'est le repère le plus lâche des quatre (fréquence divisée par 2
  par rapport à R.16, sans indication de durée minimale) ; cohérent avec sa vocation grand public non
  spécifique DT2.

Ce document retient **R.16 comme repère par défaut** (nœud RHD = DT2, gradé, choix confirmé par le
référent), et rapporte les trois autres comme repères voisins pour information — variante plus
ambitieuse pour le sous-groupe en situation d'obésité (Fiche 5), réserve d'incertitude sur la
littérature internationale (HAS Guide des connaissances), et repère grand public plus lâche
(mangerbouger.fr).

**Écarté du socle (et pourquoi)** :
- Répartition détaillée travail/trajet/loisir de l'activité physique (ebmfrance p. 3) → une question de
  suivi, pas un item de premier passage ; reportée en approfondissement (AA1).
- Sommeil, tabac, alcool (ebmfrance p. 3, même grille « lifestyle assessment ») → hors axe activité
  physique (mission), non repris.
- Instrument structuré (GPAQ, ONAPS) → trop long pour un socle de consultation courante ; reporté en
  approfondissement (AA7), sans reconstitution de ses items (cf. Règles absolues).
- Crainte des moqueries / vécu antérieur négatif (HAS p. 41) → écarté du socle **volontairement**, pas
  par manque de place : poser cette question en 30 secondes en ouverture de consultation risquerait de
  la banaliser ou de sembler intrusif ; elle est mieux amenée en approfondissement, au moment où une
  piste de reprise structurée (famille 4/5) est effectivement envisagée.

### Approfondissement optionnel (10 items)

| # | Intitulé / contenu | Type | Source (fichier · page/section) |
|---|---|---|---|
| AA1 | Répartition de l'activité déjà pratiquée : au travail / dans les trajets / en loisir | `liste` (multi) | `Lifestyle education...pdf`, p. 3/6 : *« Physical exercise at work, exercise during going to and returning from work, exercise during free-time? »* |
| AA2 | Activité physique professionnelle (nature, port de charges) | `bool` + texte libre | `guide HAS...pdf`, §3.5.1, p. 41 : « l'activité physique dans la vie professionnelle (déplacement, port de charges, etc.) » |
| AA3 | Difficultés d'accès ou financières à une pratique régulière | `bool` | idem, p. 41 : « les difficultés d'accès ou financières à une pratique régulière » |
| AA4 | Offre de proximité connue ou déjà utilisée (club, association, abonnement) | `bool` | idem, p. 41 : « l'offre et les équipements dans l'environnement » |
| AA5 | Expériences antérieures et perceptions (plaisir, sentiment de compétence, dégoût, autodépréciation, idées fausses — fatigue, peur de se blesser) | `liste` (multi) ou texte | idem, p. 41, verbatim : « les expériences de pratiques antérieures, les perceptions liées à l'activité physique : plaisir, sentiment de compétence, préférences, dégoût, autodépréciation, idées fausses sur l'activité physique (fatigue, peur de se blesser) » |
| AA6 | Crainte des moqueries / stigmatisation perçue | `bool` — formulation à soigner (non-culpabilisation, cf. P4/garde-fous de voix) | idem, p. 41, verbatim : « la crainte des moqueries, la stigmatisation en tant que facteur pouvant compromettre la pratique de l'activité physique » |
| AA7 | Questionnaire structuré (GPAQ — OMS/PNNS — ou questionnaire ONAPS) | mention d'instrument, **non reconstruit** | idem, p. 41-42 : GPAQ « développé par l'OMS et préconisé par le PNNS » ; note 75 (p. 189) : « Questionnaire ONAPS `https://onaps.fr/wp-content/uploads/2020/10/Questionnaire-Onaps.pdf` » — **URL citée telle quelle par la source, contenu du questionnaire non consulté, aucun item n'est reconstitué de mémoire** (Règles absolues) |
| AA8 | Niveau d'activité physique global (NAP) — durée journalière estimée par un professionnel APA | évaluation professionnelle, hors socle MG | `guide HAS...pdf`, Fiche 5, p. 189 : « déterminer le niveau d'activité physique (NAP) pour estimer la durée journalière des activités physiques et des comportements sédentaires » |
| AA9 | Tolérance à l'effort perçue (essoufflement, douleurs thoraciques/articulaires, transpiration) | `liste`/texte — **recoupe P4** | idem, p. 189 : « la tolérance à l'effort et sa perception : essoufflement, douleurs thoraciques et/ou articulaires, transpiration ou toutes autres sensations limitantes » |
| AA10 | Aptitudes physiques et motrices détaillées (endurance cardiorespiratoire, force et endurance musculaire, souplesse, équilibre) | évaluation professionnelle APA | idem, p. 189 |

Registre couvert : S1/S2/AA1/AA8/AA10 = pratique structurée ; S3/AA2 = activité quotidienne et
déplacements ; S4/S5 = sédentarité ; S6/AA3/AA4/AA5/AA6/AA9 = transverses (aptitude, accès, vécu,
sécurité).

---

## P2 — Bibliothèque de pistes

Seize pistes (10 initiales + 6 ajoutées le 2026-07-26), cinq familles. Chaque piste : déclencheur (réponse P1), geste observable et négociable
(registre P10 Prescrire / ebmfrance — jamais un verdict), écart comblé, provenance (étiquette détaillée
en P3), effort estimé (échelle qualitative faible/modéré/élevé — **jugement de conception, non sourcé**,
au même titre que l'heuristique d'interface déjà signalée ailleurs dans le projet pour
`esperanceVieDefault.ts`).

### Famille 1 — Report modal partiel sur les trajets courts

| Piste 1.1 | Contenu |
|---|---|
| Déclencheur | S3 = « en véhicule motorisé ou transport assis » pour les trajets courts, et S6 = non (pas de restriction) |
| Geste proposé | « Pour un ou deux trajets courts par semaine, remplacer le véhicule par la marche ou le vélo — sans viser l'exhaustivité, un trajet à la fois. » |
| Écart comblé | Rapproche de l'« activité dans les activités quotidiennes normales » recommandée en grade A (ebmfrance, cf. famille 3) sans passer par une pratique structurée |
| Provenance (P3) | **Savoir-faire (non EBM)** — extrapolation raisonnée d'un principe gradé général (ebmfrance p. 6, grade A : augmenter l'activité dans les activités quotidiennes) et d'un item de recueil HAS (modes de déplacement, p. 41), mais **le report modal en tant que tactique spécifique n'est pas lui-même testé** dans le corpus |
| Effort | Faible — un seul trajet, négociable |

**[Ajout 2026-07-26]**

| Piste 1.2 | Contenu |
|---|---|
| Déclencheur | S3 = « en véhicule motorisé ou transport assis » pour les trajets courts, et S6 = non |
| Geste proposé | « Pour les courses, préférer plusieurs petits passages à pied ou à vélo près de chez soi plutôt qu'un seul grand plein en voiture le week-end — chaque sortie de plus est une occasion de bouger. » |
| Écart comblé | Multiplie les occasions de déplacement actif sans en faire une pratique structurée — variante concrète de 1.1 centrée sur les courses |
| Provenance (P3) | **Recommandation officielle** — `10_petites_astuces_anti-sédentarité.pdf` (Santé publique France, astuce #10) : « Pour multiplier les occasions de s'aérer, faites plutôt des petites courses tous les jours à proximité à pied ou à vélo, plutôt qu'un gros plein le weekend ! » ; cohérent avec `mangerbouger.fr`, page « Augmenter l'activité physique » (récupérée 2026-07-26), qui range les trajets « à pied, à vélo, en trottinette, en roller » parmi les activités quotidiennes recommandées |
| Effort | Faible — négociable au rythme du patient |

### Famille 2 — Rupture de sédentarité

| Piste 2.1 | Contenu |
|---|---|
| Déclencheur | S4 ∈ {4-8 h, > 8 h} OU S5 = non |
| Geste proposé | « Se lever et bouger quelques minutes à chaque heure — par exemple à chaque pause, chaque changement de tâche, plutôt qu'un objectif abstrait de "moins s'asseoir". » |
| Écart comblé | Réduction du temps de sédentarité continue |
| Provenance (P3) | **Recommandation officielle** — HAS DT2, R.16, `strategie_therapeutique...pdf`, p. 12, grade C. **Seuil numérique divergent selon la source** — cf. note P1/S5 : R.16 = « au moins une minute toutes les heures » (grade C, DT2) ; guide obésité Fiche 5, p. 189 = « au moins 4 à 5 minutes toutes les heures et demie ». Piste formulée volontairement au seuil bas de R.16 (le plus facilement atteignable, cohérent avec « objectifs plutôt petits que grands », ebmfrance p. 4) ; la variante plus ambitieuse peut être proposée en réévaluation |
| Effort | Faible |

**[Ajout 2026-07-26]** — trois déclinaisons concrètes de la piste 2.1, tirées de
`10_petites_astuces_anti-sédentarité.pdf` (Santé publique France, affiche « Debout, chez vous — 10
astuces anti-sédentarité »). **Note de portée** : la source est explicitement cadrée pour le
télétravail (« Quand on télétravaille, on peut oublier de se lever régulièrement... »). Les gestes
retenus ci-dessous sont ceux qui généralisent au-delà de ce contexte précis (poste assis, bureau,
appels/réunions) ; ceux propres au télétravail au sens strict (visioconférence) sont signalés comme
tels et à proposer seulement si le déclencheur de contexte professionnel s'applique.

| Piste 2.2 | Contenu |
|---|---|
| Déclencheur | S4 ∈ {4-8 h, > 8 h} OU S5 = non, ET activité professionnelle ou domestique en position assise (contexte de bureau/écran — déjà capté par la parenthèse « travail, écrans » de S4, pas de nouvel item de recueil) |
| Geste proposé | « Se donner un repère personnel pour penser à se lever — poser son téléphone hors de portée, ou profiter d'un appel pour marcher en parlant plutôt que de rester assis. » |
| Écart comblé | Donne un déclencheur concret et mémorisable à la rupture de sédentarité, plutôt qu'une intention abstraite |
| Provenance (P3) | **Recommandation officielle** — `10_petites_astuces_anti-sédentarité.pdf`, astuces #6 (« En télétravail, laissez votre téléphone dans une autre pièce ou à l'étage. Une bonne occasion de se lever sans y penser ! ») et #9 (« Certains mails à vos collègues peuvent être remplacés par un call... une bonne occasion... de marcher un peu en téléphonant ! ») ; cohérent avec `mangerbouger.fr`, page « Réduire le temps passé assis » : « Téléphoner debout ou en marchant » |
| Effort | Faible |

| Piste 2.3 | Contenu |
|---|---|
| Déclencheur | S4 ∈ {4-8 h, > 8 h} OU S5 = non |
| Geste proposé | « Transformer une pause déjà prise (café, changement de dossier, sortie entre deux tâches) en occasion de bouger quelques instants — quelques rotations d'épaules, un étirement, ou simplement quelques minutes dehors. » |
| Écart comblé | Rattache la rupture de sédentarité à un moment déjà existant dans la journée plutôt qu'à un nouvel effort |
| Provenance (P3) | **Recommandation officielle** — `10_petites_astuces_anti-sédentarité.pdf`, astuces #3 (« Et si vous preniez l'air 5 min en bas de l'immeuble ou dans le jardin entre 2 dossiers ? C'est bon pour le corps et le moral ! »), #4 (« Étirez-vous plusieurs fois par jour pour soulager le dos et le cou, assis ou même debout c'est encore mieux. ») et #7 (« Faire des pauses actives, c'est bon pour la santé ! Quelques rotations d'épaules et du cou, ça détend le corps et l'esprit ! ») |
| Effort | Faible |

| Piste 2.4 | Contenu |
|---|---|
| Déclencheur | S4 ∈ {4-8 h, > 8 h} OU S5 = non, ET poste de travail à un bureau/ordinateur (variante télétravail-spécifique, à proposer seulement si ce contexte est déclaré par le patient) |
| Geste proposé | « Travailler debout de temps en temps, en surélevant l'ordinateur ou avec un plan de travail plus haut, sans que ce soit systématique. » |
| Écart comblé | Alternative ponctuelle à la position assise prolongée, sans passer par une pause formelle |
| Provenance (P3) | **Recommandation officielle** — `10_petites_astuces_anti-sédentarité.pdf`, astuce #1 (« Surélevez votre ordinateur avec des livres pour travailler debout de temps en temps. ») ; cohérent avec `mangerbouger.fr`, page « Réduire le temps passé assis » : « Surélever l'ordinateur ou utiliser un bureau réglable en hauteur » |
| Effort | Faible — dépend de l'aménagement du poste |

### Famille 3 — Activité quotidienne (hors déplacement)

| Piste 3.1 | Contenu |
|---|---|
| Déclencheur | S1 = jamais ou 1×/semaine, et S6 = non |
| Geste proposé | « Intégrer du mouvement dans les tâches déjà présentes dans la journée (escaliers, ménage, jardinage, porter les courses) — cela contribue autant qu'une séance planifiée. » |
| Écart comblé | Rapproche du volume global d'activité recommandé sans nécessiter une pratique structurée |
| Provenance (P3) | **Recommandation officielle** — `Lifestyle education...pdf`, p. 6/6, section « Increasing physical activity » (grade **A A A**, trois références) : *« Consider how the patient's activity level can be increased during normal daily activities. This will increase energy consumption and facilitates weight reduction and weight management as much as planned exercise. »* **Nuance dur/substitut (invariant 6)** : le grade A porte ici sur la gestion du poids et de la consommation d'énergie — un **substitut**, pas un critère cardiovasculaire dur |
| Effort | Faible |

| Piste 3.2 | Contenu |
|---|---|
| Déclencheur | S2 = « < 10 min » ou patient rapportant un manque de temps |
| Geste proposé | « Répartir l'activité en plusieurs séances courtes dans la journée plutôt qu'une seule longue — l'effet cumulé est presque équivalent. » |
| Écart comblé | Lève l'obstacle « pas le temps » sans exiger une séance longue |
| Provenance (P3) | **Recommandation officielle** — idem source, même section : *« Several shorter periods of exercise give almost the same benefit as one longer period. »* |
| Effort | Faible |

| Piste 3.3 | Contenu |
|---|---|
| Déclencheur | S1 renseigné, patient exprimant une difficulté à maintenir la régularité (S7 vague ou faible motivation) |
| Geste proposé | « Tenir un carnet d'activité simple (date, durée, ressenti) — outil de suivi, pas de contrôle. » |
| Écart comblé | Soutient la **régularité**, exactement le facteur que l'EBM identifie comme le plus prédictif (cf. §0, grade A) |
| Provenance (P3) | **Savoir-faire (non EBM)** — suggestion pratique explicitement mentionnée dans la source (`Lifestyle education...pdf`, p. 6/6 : *« The patient may be motivated to keep on exercising regularly, for example by keeping an exercise diary »*) mais non gradée en tant que telle. **Renforcé [ajout 2026-07-26]** par `HAS activité physique.pdf`, p. 14 : « L'adhésion à l'AP est le garant de son efficacité à long terme » — même principe de régularité que le point EBM directeur (§0), cité ici par une deuxième source institutionnelle |
| Effort | Faible |

**[Ajout 2026-07-26]**

| Piste 3.4 | Contenu |
|---|---|
| Déclencheur | S1 = jamais ou 1×/semaine, et S6 = non (même déclencheur que 3.1 — variante centrée sur le comptage de pas plutôt que sur les tâches quotidiennes) |
| Geste proposé | « Utiliser un podomètre ou son smartphone pour suivre son nombre de pas, et chercher à en faire un peu plus que la semaine précédente — chaque pas de plus compte, sans viser un total précis. » |
| Écart comblé | Rapproche du volume de marche quotidienne recommandé par une progression auto-mesurée, sans fixer de seuil à atteindre |
| Provenance (P3) | **Recommandation officielle** — `HAS activité physique.pdf`, p. 17-18 : « Cet objectif de 10 000 pas journalier ne doit pas être établi ni imposé comme un dogme ; il vaut mieux, dans un souci d'efficacité, proposer au patient d'augmenter son nombre de pas progressivement (+ 1 000 à 3 000 pas hebdomadaires) et souligner que **chaque pas en plus est bénéfique pour sa santé**. » Cette source est la meilleure illustration trouvée dans le corpus du principe « mouvement, pas cible » (`CONCEPTION-module-rhd.md` §0) — c'est la HAS elle-même qui déconseille d'en faire un chiffre-cible |
| Effort | Faible |

| Piste 3.5 | Contenu |
|---|---|
| Déclencheur | S1 = jamais ou 1×/semaine, ou S7 exprimant un manque de temps en journée |
| Geste proposé | « Commencer la journée par une courte marche (par exemple pour aller chercher le pain), ou remplacer un échange écrit avec un collègue/proche par un appel pris en marchant. » |
| Écart comblé | Ajoute de la marche à des moments déjà présents dans la journée, sans créneau dédié |
| Provenance (P3) | **Recommandation officielle** — `10_petites_astuces_anti-sédentarité.pdf`, astuces #5 (« Commencez vos journées par une marche de 10 min, c'est l'occasion d'aller acheter du pain frais pour un bon petit-déjeuner. ») et #9 (« Certains mails à vos collègues peuvent être remplacés par un call, une bonne occasion de prendre de leurs nouvelles et de marcher un peu en téléphonant ! »). La durée de 10 min citée dans l'astuce #5 est un exemple de la source, pas un chiffre à afficher comme cible dans le geste |
| Effort | Faible |

### Famille 4 — Pratique structurée (endurance + renforcement)

| Piste 4.1 | Contenu |
|---|---|
| Déclencheur | S1 = jamais ou 1×/semaine, ET S6 = non, ET garde-fous P4 (G1-G7) négatifs |
| Geste proposé | « Envisager d'engager un programme d'activité physique adaptée associant endurance et renforcement musculaire, avec l'accompagnement d'un professionnel — une reprise cadrée plutôt qu'une reprise seule et non structurée. » |
| Écart comblé | Rapproche de la structure (endurance + renforcement, encadrement) d'un programme recommandé |
| Provenance (P3) | **Recommandation officielle** — HAS DT2, R.24, `strategie_therapeutique...pdf`, p. 13, grade AE : « Prescrire un programme d'AP adaptée d'endurance et de renforcement musculaire, d'une durée de 3 mois, renouvelable, à raison de 2 à 3 séances par semaine (grade AE). » Complété **[ajout 2026-07-26]** par `HAS activité physique.pdf`, p. 16 (définition réglementaire de l'APA, article D. 1172-1 CSP) : « Un programme d'APA se compose habituellement de 48 séances, réparties habituellement sur une durée de 3 mois ou plus... La fréquence est de 2 à 3 séances par semaine. Chaque séance dure de 45 min à 1 h... pour permettre d'obtenir les 150 min d'AP structurées par semaine. » **Correction 2026-07-26** : ces chiffres (2-3 séances/semaine, 3 mois, 48 séances, 150 min) décrivent ce qui est prescrit dans un programme d'APA — ils restent ici en provenance/argumentaire, **retirés du geste proposé** (règle référent `CONCEPTION-module-rhd.md` §0 : aucune piste n'affiche de valeur à atteindre ; cf. §0 de ce document). **Gatée par le garde-fou G1 (R.19)** — évaluation médicale minimale avant intensité modérée, cf. P4 |
| Effort | Modéré à élevé — nécessite accompagnement |

| Piste 4.2 | Contenu |
|---|---|
| Déclencheur | S1 = ≥ 4×/semaine ET S5 = oui (déjà actif et déjà rompt la sédentarité — « marge de manœuvre faible », arbitrage §8-4 du dossier H) |
| Geste proposé | « Maintenir la pratique actuelle ; si l'endurance et le renforcement ne sont pas déjà associés, envisager de diversifier. » |
| Écart comblé | Reformulation en « maintenir/renforcer » plutôt qu'« améliorer » — évite le conseil condescendant à qui fait déjà l'effort (cf. §7 garde-fous de voix de l'analyse référent) |
| Provenance (P3) | **Recommandation officielle** — **corrigé 2026-07-26** : l'ancrage principal n'est plus R.24 mais le point EBM directeur ebmfrance (§0, grade A, régularité prédictive) — R.24 est une recommandation de *prescription* d'un programme structuré pour un patient qui en a besoin (« Prescrire un programme d'AP adaptée... », grade AE), pas une recommandation de *maintien* pour un patient déjà actif ≥ 4×/semaine ; elle n'est retenue ici que pour la **composition** du programme (endurance + renforcement) si le patient souhaite diversifier, pas pour justifier le principe de maintien lui-même |
| Effort | Faible — renforcement de l'existant |

### Famille 5 — Orientation vers une ressource

| Piste 5.1 | Contenu |
|---|---|
| Déclencheur | S6 = oui (limitation connue) OU AA3/AA4 défavorables (accès difficile, pas d'offre connue) |
| Geste proposé | « Orienter vers une structure d'activité physique adaptée (maison sport-santé, enseignant APA) pour un bilan et un accompagnement progressif et sécurisé. » |
| Écart comblé | Lève l'obstacle d'accès ou de compétence identifié en socle/approfondissement |
| Provenance (P3) | **Recommandation officielle** — HAS DT2, R.25, `strategie_therapeutique...pdf`, p. 13, grade AE : « Tous les professionnels de santé en contact avec des patients vivant avec un DT2 doivent se renseigner sur les structures d'orientation ou de dispensation d'AP à des fins de santé existantes sur son territoire (par exemple, auprès des maisons sport-santé) (grade AE). » |
| Effort | Faible pour le médecin (orientation) ; modéré pour le patient |

| Piste 5.2 | Contenu |
|---|---|
| Déclencheur | AA5/AA6 défavorables (expérience négative, peur de se blesser, crainte des moqueries) |
| Geste proposé | « Proposer un bilan avec un enseignant en activité physique adaptée avant toute reprise, pour co-construire un projet tenant compte des craintes et capacités exprimées — jamais une prescription d'intensité d'emblée. » |
| Écart comblé | Sécurise et débloque une reprise freinée par un vécu négatif, sans reformuler ce vécu en reproche |
| Provenance (P3) | **Recommandation officielle** — `guide HAS._parcours_surpoids-obesite_de_ladulte.pdf`, Fiche 5, p. 188 : rôle de l'enseignant APA, « associer la notion de plaisir et de bien-être à la pratique des activités physiques est un préalable indispensable à l'adoption d'habitudes de vie actives sur le long terme » ; p. 189 : « coconstruire avec la personne un projet d'activité physique en adéquation avec ses aptitudes, ses besoins et ses attentes » |
| Effort | Modéré — nécessite orientation et délai |

| Piste 5.3 | Contenu |
|---|---|
| Déclencheur | Toute orientation retenue (5.1 ou 5.2) une fois le principe accepté par le patient |
| Geste proposé | Désignation d'une ressource **nommée localement** (structure APA, maison sport-santé identifiée sur le territoire de la MSP) |
| Écart comblé | Transforme une orientation de principe en geste concret et actionnable |
| Provenance (P3) | **Ressource locale — [À SOURCER]**. La HAS (R.25) impose de connaître l'offre locale, mais **ce dossier ne contient aucun annuaire de structures APA/maison sport-santé du territoire** — aucune adresse, aucun nom d'organisme n'est avancé ici. Recoupe directement le projet `annuaire-msp` (répertoire d'adressage de la MSP) : c'est la source naturelle à mobiliser, à constituer/valider avant tout encodage de cette piste |
| Effort | Faible pour le médecin une fois l'annuaire disponible |

---

## P3 — Provenance

Quatre étiquettes, une par piste, strictes sur la première conformément à la demande du référent.

| Étiquette | Définition retenue | Pistes concernées | Total |
|---|---|---|---|
| **Bénéfice EBM sur critère dur** | Démontré sur un événement dur (mortalité, événement CV majeur) par un essai contrôlé ou une preuve d'un niveau assimilable | *(aucune)* | **0** |
| **Recommandation officielle** | Portée par une recommandation d'une institution de santé publique — HAS ou ebmfrance/Duodecim, gradée (A à AE) quand la source grade ; ou Santé publique France/PNNS/mangerbouger.fr, position institutionnelle officielle mais non gradée **[précision 2026-07-26]** — le critère sous-jacent peut être un substitut, précisé au cas par cas | 1.2, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.4, 3.5, 4.1, 4.2, 5.1, 5.2 | **13** |
| **Savoir-faire (non EBM)** | Extrapolation raisonnée ou suggestion pratique mentionnée dans une source, mais non gradée en tant que telle | 1.1, 3.3 | **2** |
| **Ressource locale** | Orientation vers une offre de proximité, dont le contenu concret n'est pas dans le corpus documentaire de ce nœud | 5.3 | **1** |

**Constat central, à ne pas édulcorer** : sur l'axe activité physique, **aucune piste de cette
bibliothèque ne porte l'étiquette « bénéfice EBM sur critère dur »**. C'est cohérent avec le dossier de
preuve déjà réuni pour ce nœud (`docs/decision/noeuds/H-rhd.md`, §3, sous-dossier H3 : « aucun
bénéfice CV dur propre à l'exercice » démontré ; le seul bénéfice CV dur des MHD est le régime
méditerranéen, axe alimentation) et avec Look AHEAD, dont le critère cardiovasculaire primaire est
neutre pour l'intervention intensive sur le mode de vie (`H-rhd.md` §3, sous-dossier H2 — HR 0,95,
essai arrêté pour futilité). Les recommandations officielles mobilisées ici (R.16, R.24, R.25, et les
sources ajoutées le 2026-07-26 : OMS/HAS p. 12-18, PNNS, mangerbouger.fr, astuces anti-sédentarité)
sont gradées ou institutionnelles sur des critères de processus ou de substitution (temps de
sédentarité, structure de programme, accès, nombre de pas), jamais sur un événement dur — **y compris
la mention DT2 (mortalité toutes causes et CV) du Tableau 1 de `HAS activité physique.pdf`, dont
l'origine épidémiologique/observationnelle est détaillée en §0** : elle reste classée recommandation
officielle, pas EBM-dur. Ce constat doit être porté tel quel au référent : il ne s'agit pas d'une
lacune de cette collecte, mais de l'état réel de la preuve sur cet axe.

Nuance dur/substitut appliquée pièce par pièce (invariant 6) : chaque fois qu'une piste s'appuie sur un
grade A/B/C, la case « Provenance » de P2 précise l'outcome réellement gradé (poids, HbA1c, temps de
sédentarité) plutôt que de laisser le grade suggérer, par défaut, un bénéfice dur.

**« À SOURCER »** : 1 occurrence — piste 5.3 (contenu de l'annuaire de ressources locales), faute de
tout annuaire dans ce dossier. Aucune autre piste n'a été formulée sans ancrage dans les sources listées
en tête de mission ; les tactiques de bon sens qui n'y trouvaient pas d'appui direct (ex. horaires fixes
d'activité, à la manière des « horaires de repas fixes » qu'ebmfrance recommande pour l'alimentation
mais jamais pour l'activité physique) ont été délibérément écartées plutôt que forcées dans la
bibliothèque.

---

## P4 — Garde-fous de sécurité

Tous ancrés sur HAS DT2 **R.19 / R.27 / R.28** (`strategie_therapeutique_du_patient_vivant_avec_un_diabete_de_type_2_-_recommandations.pdf`,
p. 12-14). Citations exactes, seuils non reformulés.

| # | Garde-fou (citation exacte) | Source | Piste(s) bloquée(s) | Critère de recueil minimal proposé |
|---|---|---|---|---|
| G1 | « Une évaluation médicale minimale est recommandée avant de commencer ou d'augmenter une AP d'intensité au moins modérée (grade AE). Une consultation médicale d'AP est préconisée avant toute pratique d'AP d'intensité élevée. Les patients vivant avec un DT2 inactifs ou avec facteur(s) de risque cardiovasculaire (RCV) associé(s) peuvent en bénéficier avant la pratique d'une AP d'intensité modérée. » | R.19, p. 12-13, grade AE | 4.1 (programme structuré) et toute piste qui élève l'intensité au-delà de l'existant | Item à ajouter : « Le patient est-il actuellement inactif, ou porteur d'un facteur de risque cardiovasculaire connu ? » (`bool`) — déclenche l'exigence d'évaluation médicale avant d'afficher 4.1 |
| G2 | « Il est recommandé de porter attention aux points de vigilance à l'activité physique... en particulier : signes et symptômes évocateurs d'ischémie myocardique chez les patients vivant avec un DT2. » | R.27, p. 13, grade AE | 4.1, 4.2 et toute intensification | Item à ajouter : « Douleur thoracique ou essoufflement inhabituel à l'effort ? » (`bool`) — recoupe AA9 (tolérance à l'effort perçue) |
| G3 | « ...signes ou symptômes d'hypoglycémie chez les patients vivant avec un DT2 sous traitement insulinosécréteur ou sous insuline. » | R.27, p. 13, grade AE | 4.1, 1.1, 3.1 (toute augmentation de la dépense énergétique) | Réutilisation du critère déjà présent dans le nœud RHD actuel : `traitements_en_cours contient insuline OR sulfamide OR glinide` (alerte D15 existante) |
| G4 | « ...patients vivant avec un DT2 avec une rétinopathie non stabilisée (en cas d'exercice à glotte fermée) » (R.27) ; « AP avec une manœuvre de Valsalva ou à glotte fermée chez certains patients (rétinopathie proliférante) » (R.28) | R.27 + R.28, p. 13-14, grade AE | 4.1 en particulier son volet renforcement musculaire (charges, efforts en apnée) | Item à ajouter ou réutiliser transversalement : « Rétinopathie diabétique non stabilisée / proliférante connue ? » (`bool`) — **note** : R.27 dit « non stabilisée », R.28 dit « proliférante » — deux formulations voisines mais non identiques, citées ici sans les fondre l'une dans l'autre |
| G5 | « ...patients vivant avec un DT2 avec une neuropathie périphérique ayant des risques majorés d'ulcère de pied » (R.27) ; « présence d'un mal perforant plantaire » (R.28) | R.27 + R.28, p. 13-14, grade AE | 1.1 (report modal — marche), 3.1 (activité quotidienne à base de marche/port de charges) | Item à ajouter : « Neuropathie périphérique ou mal perforant plantaire, actuel ou antécédent ? » (`bool`). **Précision [ajout 2026-07-26]**, `HAS activité physique.pdf` p. 30 : « La présence d'un mal perforant plantaire est une contre-indication temporaire et absolue à la pratique d'une AP au niveau des membres inférieurs, à la fois au niveau du pied lésé, mais aussi au niveau de l'autre pied. **Les AP des membres supérieurs sont permises.** » — nuance utile pour le câblage : le blocage ne porte que sur l'AP des membres inférieurs, pas sur 4.1 dans son ensemble s'il inclut du renforcement haut du corps ; à trancher au moment du câblage, signalé ici sans décision |
| G6 | « ...personne âgée à risque de déshydratation. » | R.28, p. 13-14, grade AE | Toute piste augmentant l'effort chez un sujet âgé, en particulier par forte chaleur | Réutilisation transverse des critères déjà présents dans d'autres nœuds du domaine (`fragilite`, `esperance_vie` — nœuds A/E) plutôt qu'un nouveau critère dédié à H. **Détail concret [ajout 2026-07-26]**, `HAS activité physique.pdf` p. 30-31 (registre général, pas spécifique DT2) : « éviter la pratique d'AP prolongées en plein air, dès que la température extérieure est supérieure à 28 ºC » ; hydratation « environ 0,5 L/h (par prises successives toutes les 15-20 min) » ; chez la personne âgée spécifiquement, « les AP susceptibles d'induire une augmentation durable de la pression artérielle, telles que les AP de renforcement musculaire de forte intensité, doivent être évitées, de même que les AP pratiquées en ambiances chaudes » et « la consommation d'eau doit être favorisée même en l'absence de sensation de soif ». Corroboré indépendamment par `mangerbouger.fr`, page « Rester en forme après 65 ans » (récupérée 2026-07-26) : « Les activités physiques en période de forte chaleur sont à éviter » ; « Hydratez-vous pendant et après la pratique, sans attendre la sensation de soif ». Ces détails sont plus riches que R.28 seule mais restent, comme R.28, non chiffrés dans le geste des pistes concernées — ils informent le garde-fou, pas un geste |
| G7 | « ...patients vivant avec un DT2 dont l'instabilité glycémique expose au risque d'hypoglycémie réactionnelle pendant l'effort, ou d'hyperglycémie instable (seuil : 2,5 g au début de l'activité physique). » | R.28, p. 13-14, grade AE | 4.1 et toute piste d'intensification | Item à ajouter : « Glycémie avant l'effort » (`nombre`, g/L) — seuil cité tel quel dans la source, **unité non explicitée au-delà de « g »** ; cohérent par convention avec le g/L utilisé ailleurs dans le domaine (ex. `insuline.yaml`, `GAJ`), mais ce rapprochement est une inférence, pas une citation |

Cohérence de gating à noter pour la conception ultérieure : G3 réutilise une alerte déjà encodée dans
`content/noeuds/diabete-type-2/rhd.yaml` (alerte hypoglycémie sous insuline/SU/glinide, §8-5 du
dossier H) — cette collecte ne demande donc pas un nouveau critère pour G3, seulement d'étendre son
usage du seul déclenchement d'alerte au **blocage effectif** des pistes d'intensification (G1, G2, G4,
G5, G7 demandent chacun un critère nouveau ou réutilisé d'un autre nœud, à discuter au moment du
câblage — hors périmètre de ce document).

**Point de vigilance signalé par le red-team (`redteam-collectes-rhd.md`, finding B-3), non tranché
ici** : passer du seul déclenchement d'alerte au blocage effectif est un **changement de nature** de
la même alerte D15 que `H-rhd.md` §8-5 a explicitement tranchée « conservée… pas d'exclusion » pour
son usage côté alimentation (hypoglycémie par restriction des apports). Le mécanisme visé ici
(hypoglycémie **à l'effort**, R.27) est cliniquement distinct de celui déjà arbitré (hypoglycémie **par
restriction des apports**), donc la proposition n'est pas nécessairement en contradiction clinique avec
§8-5 — mais elle doit être soumise explicitement au référent comme un durcissement (alerte → blocage)
de la même alerte D15, pas glissée silencieusement au câblage.

---

## Points laissés ouverts pour le référent

1. **Seuil de rupture de sédentarité** (S5/piste 2.1) — **statut au 2026-07-26 : tranché par le
   référent (R.16, 1 min/heure, grade C, DT2), retenu comme repère par défaut.** Point maintenu ouvert
   pour mémoire seulement, sur ce qui reste à signaler sans trancher : trois repères voisins coexistent
   (Fiche 5 du guide obésité, 4-5 min/1 h 30, non gradée ; `HAS activité physique.pdf` p. 15, 1-5 min,
   non gradée, avec réserve d'incertitude sur la littérature sous-jacente ; `mangerbouger.fr`, toutes
   les 2 heures, non gradé, grand public) — cf. Note S5 en P1 pour le détail complet.
2. **Piste 5.3** (ressource locale) : dépend entièrement de la constitution d'un annuaire APA/maison
   sport-santé du territoire — hors périmètre de cette collecte, à rapprocher du projet `annuaire-msp`.
3. **Câblage des garde-fous G1/G2/G4/G5** : chacun demande un critère clinique qui n'existe pas encore
   dans le nœud RHD (rétinopathie, neuropathie/mal perforant, douleur thoracique à l'effort, inactivité/
   FDR CV) — certains existent déjà dans d'autres nœuds du domaine (rétinopathie/albuminurie dans
   `prescription`, fragilité/espérance de vie dans `A`/`E`) : la question de la réutilisation
   transverse vs la duplication est à trancher au moment de la conception technique, pas ici.
4. **[Ajout 2026-07-26] G3 — alerte D15 : déclenchement seul ou blocage effectif ?** Signalé par le
   red-team (finding B-3, `redteam-collectes-rhd.md`) : étendre l'alerte D15 existante (hypoglycémie
   sous insuline/SU/glinide) d'un simple déclenchement à un blocage effectif des pistes
   d'intensification est un changement de nature par rapport à l'arbitrage §8-5 de `H-rhd.md`
   (« alerte conservée… pas d'exclusion », pour l'usage alimentation de la même alerte). Le mécanisme
   clinique diffère (hypoglycémie à l'effort vs par restriction), donc ce n'est pas nécessairement une
   contradiction — mais la décision (bloquer ou seulement alerter) doit être prise explicitement par le
   référent, pas héritée implicitement de §8-5.
5. **[Ajout 2026-07-26] G5 — mal perforant plantaire : blocage total ou membres inférieurs
   seulement ?** `HAS activité physique.pdf` p. 30 précise que la contre-indication porte sur l'AP des
   membres inférieurs (le pied lésé et l'autre pied), et que « les AP des membres supérieurs sont
   permises ». À trancher au câblage : G5 doit-il bloquer 4.1 entièrement, ou seulement son volet
   « membres inférieurs » (marche, endurance) en laissant un volet renforcement haut du corps ouvert ?
6. **[Ajout 2026-07-26] Portée télétravail des astuces anti-sédentarité (pistes 2.2-2.4)** :
   `10_petites_astuces_anti-sédentarité.pdf` est explicitement cadré pour le télétravail. Les gestes
   retenus (téléphone en marchant, pause active, bureau surélevé) généralisent raisonnablement à toute
   activité assise prolongée, mais la source elle-même ne le dit pas pour tous les patients (ouvriers,
   retraités, etc.) — à confirmer que cette généralisation est acceptable pour le référent, ou à
   restreindre ces trois pistes aux patients en contexte de bureau/écran déclaré.
