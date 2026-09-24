# Contradiction (Agent B) — titration de la basale pilotée par la MCG, DT2, nœud `insuline`

## Provenance

- Date : 2026-09-24
- Rôle joué : Agent B (contradiction / red-team), tenu dans la session orchestratrice — aucun sous-agent
  distinct lancé pour cette passe ; méthode suivie : `.claude/skills/recherche-source-primaire/references/contradiction.md`
  et `acces-identite.md`.
- Pièces reçues : `epreuve/entrees/prompt-OE-titration-mcg.md` (prompt posé le 2026-08-11) et
  `epreuve/entrees/OE-titration-mcg-brut-2026-08-11.txt` (retour brut OE, tel que collé par le référent).
  Aucun rapport d'Agent A distinct n'accompagnait ces pièces pour ce chantier.
- OpenEvidence : **aucune question posée** pour ce travail (interdiction explicite de la commande).
- Outils disponibles dans cette session : `WebSearch`, `WebFetch` (natifs). **Absents** : `node`
  (aucun outil Bash/PowerShell exposé) → `identite.mjs` n'a pas pu être appelé ; les connecteurs MCP
  PubMed/ClinicalTrials.gov, listés comme outils différés, n'ont pas été chargés (la recherche web
  ouverte a suffi pour trancher l'existence des 16 références). Cette substitution est actée ici
  conformément à `acces-identite.md` § 1 (« constater les outils réellement exposés »).
- Portée : uniquement le point de contrôle demandé — existence et soutien de chaque appel `[1]` à
  `[16]` du corps de la réponse OE. Pas de passe d'omission, pas de registre, pas de consolidation :
  cette pièce n'est pas un dossier complet du circuit `recherche-preuve-triangulee`, seulement son
  étape de contradiction ciblée sur un retour déjà collecté.

## Attendus (avant vérification des références)

Écrits à partir du seul prompt (`prompt-OE-titration-mcg.md`), avant lecture détaillée du retour OE :

- **Q1/Q2 (décisives)** — un algorithme de titration de basale *piloté par métriques MCG* (TIR/TAR/AGP,
  avec déclencheur chiffré + pas de dose), validé prospectivement en ambulatoire chez le DT2, est
  attendu **absent** de la littérature au 2026-08-11 : la question posée est formulée pour distinguer
  ce cas précis des essais qui comparent seulement des *modalités de monitorage* (MCG vs autosurveillance
  capillaire). Un rapport sérieux doit donc dire explicitement « aucun essai trouvé » plutôt que de
  substituer silencieusement un essai de modalité pour un essai d'algorithme.
- **Q3 (décisive)** — pour MOBILE, FreeDM2 et Jancev, le protocole de titration *réellement appliqué*
  dans le bras capteur doit être caractérisé à partir de la section Méthodes de chaque essai, pas de son
  résultat global : c'est le passage le plus consulté et le plus susceptible d'erreur d'attribution.
- **Q4 (décisive)** — la distinction seuil d'interprétation / seuil d'action posologique est le nœud
  clinique de la question ; toute référence attachée aux seuils d'interprétation doit être un texte qui
  définit ou reprend ces seuils (ATTD/ICTR, ADA), pas un texte sur un thème adjacent (risque
  cardiovasculaire, complications).
- **Q5/Q6** — réserves attendues : les sources y sont plus hétérogènes (revues, avis d'experts,
  recommandations) ; le risque principal est l'habillage d'un avis d'expert en position de société
  savante (spin d'autorité), plus que l'invention de référence.
- **Chiffres attendus** : effet absolu + IC pour chaque essai comparatif (MOBILE, Jancev) ; à défaut
  d'IC dans le retour, le signaler. Aucune conclusion ne doit dépasser la population/l'horizon étudiés.

## Vérification référence par référence (point de contrôle demandé)

Méthode : recherche web ouverte (titre, auteurs, revue, DOI/PMID) pour chaque appel `[n]`, comparée à
l'entrée correspondante de la liste « ### References » du retour brut, puis confrontation du contenu
retrouvé (résumé, abstract, notice) à l'affirmation du corps de texte à laquelle `[n]` est rattaché.

| Réf. | Citation (liste OE) | Existence | Soutien de l'affirmation rattachée | Verdict |
|---|---|---|---|---|
| [1] | Olsen et al., DIATEC, *Diabetes Care* 2025;48(4):569-578, doi:10.2337/dc24-2222 | **Confirmée** — DOI, titre, revue, pagination retrouvés à l'identique (PubMed) ; essai hospitalier RCT comparant algorithmes de titration sur MCG vs glycémie au doigt, DT2. | **Partielle / non vérifiable en détail** — le design général soutient « hospitalisé, non transposable » ; l'affirmation précise « algorithmes identiques pour cibles et pas de dose, seule la source de mesure diffère » n'a pas pu être confirmée sur les seuls résumés disponibles : nécessite lecture de la section Méthodes. | Identité ✅ / Soutien à vérifier sur texte intégral |
| [2] | Martens et al., *Diabetes & Metabolic Syndrome* 2025;19(6):103266, doi:10.1016/j.dsx.2025.103266 | **Confirmée** — titre, auteurs, revue, volume concordants. | **Confirmé** — le résumé retrouvé décrit exactement le « nadir MCG de la 1 h du matin » comme équivalent à la glycémie à jeun sur 3 algorithmes (INSIGHT, Treat2Target, AT.LANTUS) : correspond au texte de l'affirmation. | Identité ✅ / Soutien ✅, mais voir finding sur le PMID 40683222 |
| [3] | Martens et al. (MOBILE), *JAMA* 2021;325(22):2262-2272, PMID 34077499 | **Confirmée** — PMID exact, essai réel et bien identifié. | **Partielle** — le chiffre TIR « +15 pts, IC95 % 8–23 » correspond à un résultat largement cité de MOBILE, mais une source secondaire trouvée en cours de vérification (Healio, portant en réalité sur une ré-analyse à 3 mois de la même famille d'essai) donne +9,3 pts — écart **non tranché ici** (un relais ne vérifie pas un chiffre contre la source, `contradiction.md` § 3 Spin) ; le HbA1c (−0,4 %, IC −0,8 à −0,1) est du même ordre qu'un chiffre de relais trouvé (−1,1 % vs −0,6 %). La caractérisation du protocole (« titration à la discrétion du médecin de soins primaires, pas d'algorithme piloté par capteur ») — point décisif de Q3 — n'a pas pu être confirmée sur les extraits disponibles. | Identité ✅ / Soutien non tranché sur le chiffre TIR et sur le protocole — **[À VÉRIFIER]** sur texte intégral |
| [4] | Wilmot et al. (FreeDM2), *Lancet Diabetes Endocrinol* 2026;14(6):463-474, doi:10.1016/S2213-8587(26)00076-8 | **Confirmée** — DOI, titre, revue, design (RCT multicentrique ouvert de supériorité) concordants ; structure en deux phases de 16 semaines confirmée par une source de presse indépendante (Imperial College Healthcare NHS Trust). | **Plausible / non vérifiable en détail** — la structure en deux phases est confirmée ; l'affirmation « amélioration en phase 1 sans différence de dose d'insuline entre groupes » n'a pas été retrouvée dans les sources de presse consultées (qui parlent d'HbA1c et de temps dans la cible, pas de dose). | Identité ✅ / Soutien à vérifier — voir aussi finding PMID 42035781 |
| [5] | Jancev et al., *Diabetologia* 2024;67(5):798-810, doi:10.1007/s00125-024-06107-6, PMID 38363342 | **Confirmée** — concordance exacte (titre, auteurs, revue, volume, pages, DOI, PMID). | **Non vérifiable en détail** — les chiffres précis cités (HbA1c −0,31 %, TIR +6,36 %, etc.) n'ont pas pu être confrontés au texte intégral dans cette passe. | Identité ✅ / Soutien non vérifié |
| [6] | Aroda & Eckel, *Diabetes Obes Metab* 2022;24(12):2297-2308, doi:10.1111/dom.14830 | **Confirmée** — article réel. | **NON** — l'article porte sur le rôle du contrôle glycémique dans le risque cardiovasculaire au DT2 ; aucun rapport avec les seuils d'interprétation MCG (TIR/TBR/TAR) auxquels il est rattaché. | Identité ✅ / **Soutien ✗ — attribution erronée** |
| [7] | Anagnostopoulou et al., *Diabetes Obes Metab* 2026;28(2):840-849, doi:10.1111/dom.70288 | **Confirmée**. | **Partielle** — relie bien des métriques MCG (TIR, variabilité, TITR) aux complications microvasculaires, donc emploie les mêmes métriques ; mais ce n'est pas la source qui définit les seuils eux-mêmes (définis par le consensus ATTD/Battelino, déjà cité séparément en [16]). | Identité ✅ / Soutien indirect, imprécis |
| [8] | Goshrani et al., *Diabetes Obes Metab* 2025;27(5):2342-2362, doi:10.1111/dom.16279, PMID 40000405 | **Confirmée** (PMID retrouvé et concordant). | **Plausible** — revue narrative sur le TIR comme critère de jugement, rapporte usuellement les valeurs cibles de consensus ; support raisonnable mais non canonique. | Identité ✅ / Soutien plausible |
| [9] | ADA Standards of Care 2026, chap. 6, *Diabetes Care* 2026;49(S1):S132-S149, doi:10.2337/dc26-S006, PMID 41358894 | **Confirmée** (PMID, DOI, pagination retrouvés à l'identique). | **Confirmé** — chapitre consacré précisément aux objectifs glycémiques et aux paramètres MCG (TIR/TBR/TAR) pour l'ajustement du traitement ; cohérent avec la citation verbatim de Q6. | Identité ✅ / Soutien ✅ |
| [10] | AACE Consensus Statement 2026, *Endocr Pract* 2026;32(4):473-518, doi:10.1016/j.eprac.2026.01.006, PMID 41842862 | **Confirmée**. | **Plausible** — l'article est bien un algorithme de prise en charge du DT2 en plusieurs parties ; les pourcentages précis cités (+20 %/+10 %/+1 U, réduction 10-20 %) n'ont pas pu être confirmés dans les extraits disponibles. | Identité ✅ / Soutien plausible, chiffres non confrontés au texte |
| [11] | Bolli et al., *Diabetes Care* 2025;48(5):671-681, doi:10.2337/dci24-0104 | **Confirmée**. | **Attribution contestable** — l'article est un point de vue signé par des auteurs indépendants (Bolli et al.), qui argumente que le rôle de la basale décline face aux nouvelles classes thérapeutiques ; ce n'est pas une position officielle de l'ADA. Le libellé « ADA/Bolli 2025 » du corps de texte laisse croire à une source de société savante. | Identité ✅ / **Soutien — habillage d'autorité trompeur (spin)** |
| [12] | Dower et al., *JAMA Intern Med* 2026, doi:10.1001/jamainternmed.2026.2772, PMID 42545686 | **Confirmée** (PMID retrouvé et concordant). | **Plausible** — revue critique sur la MCG au DT2 et au-delà ; cohérente avec un commentaire qualitatif sur la basale et le profil nocturne, mais le passage précis n'a pas été confronté au texte intégral. | Identité ✅ / Soutien plausible, non confronté |
| [13] | ADA Standards of Care 2026, chap. 9, *Diabetes Care* 2026;49(S1):S183-S215, doi:10.2337/dc26-S009, PMID 41358900 | **Confirmée** (concordance exacte, y compris pagination). | **Confirmé** — chapitre pharmacologique de l'ADA, pertinent pour les signaux de sur-basalisation (Q5) et pour l'absence d'algorithme MCG (Q6). | Identité ✅ / Soutien ✅ — voir aussi finding sur le mélange de versions 2025/2026 |
| [14] | Peters et al., *Diabetes Obes Metab* 2019;21(7):1752-1756, doi:10.1111/dom.13729, PMID 30924578 (non cité par OE) | **Confirmée**. | **Partielle** — l'article confirme qu'une variation glycémique nocturne élevée (et l'augmentation post-prandiale) prédit un effet de traitement plus marqué à l'intensification par bolus. L'affirmation d'OE selon laquelle cette variation « prédit MIEUX... que l'HbA1c » n'est pas clairement établie par le résumé retrouvé, qui traite l'HbA1c de base comme un des critères étudiés sans hiérarchie explicite de supériorité. | Identité ✅ / **Soutien — possible surinterprétation, à vérifier sur texte intégral** |
| [15] | Irace et al., *Diabetes Metab Res Rev* 2025;41(5):e70059, doi:10.1002/dmrr.70059, PMID 40497316 — utilisée deux fois : « Consensus ADA/EASD » et « NICE » | **Confirmée** — l'article existe tel que cité dans la liste. | **NON, dans les deux emplois** — c'est un avis d'un groupe d'experts **italien** sur l'intégration de la MCG au DT2 ; ce n'est ni un consensus ADA/EASD, ni une recommandation NICE. Aucune des deux phrases auxquelles [15] est rattaché n'est étayée par cette référence. | Identité ✅ / **Soutien ✗✗ — erreur d'attribution majeure, doublée** |
| [16] | Battelino et al., *Lancet Diabetes Endocrinol* 2023;11(1):42-57, doi:10.1016/S2213-8587(22)00319-9, PMID 36493795 | **Confirmée** (concordance exacte). | **Confirmé** — consensus international sur les métriques MCG pour essais cliniques, actualisation légitime du consensus ATTD 2019 ; cohérent avec « ATTD/ICTR ... actualisations ». | Identité ✅ / Soutien ✅ |

**Constat transversal favorable** : sur les 16 appels vérifiés, **aucune référence fantôme ni DOI
inventé** n'a été détecté — les 16 renvoient tous à des publications réelles, correctement titrées et
datées. Le problème du document n'est pas l'invention de sources, mais l'**attribution** (rattacher une
source réelle à la mauvaise affirmation) et l'**habillage d'autorité** (présenter un avis d'auteurs comme
une position de société savante).

## Findings

### HAUTE

1. **[15] — attribution erronée doublée (origine : OE seule).** La référence Irace et al. (avis d'un
   groupe d'experts italien) est utilisée à la fois pour « Consensus ADA/EASD » (Q6) et pour « NICE »
   (Q6), alors qu'elle ne représente ni l'un ni l'autre. C'est l'erreur la plus sévère du document :
   une source réelle, mais deux fois hors sujet. Passage : corps de texte, section Q6, avant-dernier et
   dernier tirets.
2. **PMID non sollicités et non vérifiés indépendamment (origine : OE seule).** Le prompt demandait
   explicitement le DOI, jamais le PMID (`openevidence.md` § 6). OE a néanmoins ajouté de son propre
   chef un PMID pour [2] (40683222) et pour [4] (42035781, cité dans le corps au sujet de FreeDM2) ;
   aucun des deux n'a pu être retrouvé indépendamment par la recherche web pour l'article en question.
   Règle du projet : « un PMID recopié d'OE ne vaut rien » (`docs/decision/00-global.md` § Règles de
   sourcing) — ces deux identifiants ne doivent pas entrer dans un registre sans passage par
   `identite.mjs` ou une notice PubMed directe, indisponibles dans cette session.
3. **Q3 (décisive) non tranchée sur les pièces disponibles (origine : non vérifiable en l'état).** La
   caractérisation du protocole de titration dans MOBILE [3] et FreeDM2 [4] (« à la discrétion
   clinique », « auto-titration sans effet démontré sur la dose ») est le point qui porte toute la
   conclusion du nœud (aucun algorithme MCG-piloté trouvé) ; elle n'a pas pu être confirmée sur les
   extraits accessibles depuis cette session et nécessite la lecture de la section Méthodes des deux
   articles princeps.

### MOYENNE

4. **[6] — hors sujet (origine : OE seule).** Aroda & Eckel (risque cardiovasculaire/contrôle
   glycémique) rattaché à tort aux seuils d'interprétation MCG (Q4, Q6).
5. **[11] — habillage d'autorité (origine : OE seule).** Bolli et al. (point de vue d'auteurs) présenté
   comme « ADA/Bolli 2025 », ce qui laisse croire à une position officielle de l'ADA.
6. **[14] — possible surinterprétation (origine : OE seule ou non vérifiable).** L'affirmation de
   supériorité prédictive de la variation nocturne sur l'HbA1c n'est pas clairement établie par le
   résumé retrouvé de Peters et al. 2019.
7. **[3] — chiffre TIR non tranché contre un relais (origine : non vérifiable en l'état).** Un chiffre
   de TIR différent (+9,3 pts) a été relevé dans une source secondaire lors de la vérification, mais
   celle-ci semble porter sur une ré-analyse à 3 mois de la même famille d'essai (MOBILE), pas sur le
   résultat princeps à 8 mois cité par OE — écart probablement lié à une confusion de publication au
   sein de la même famille d'essai (`acces-identite.md` § 5), pas nécessairement une erreur d'OE ; à
   trancher sur le tableau princeps.
8. **[7] et [8] — rattachement indirect aux seuils d'interprétation (origine : OE seule).** Les deux
   références emploient les bonnes métriques (TIR/TBR) sans être la source qui définit les seuils
   eux-mêmes ; imprécis plus que faux.

### BASSE

9. **Notation ambiguë « [19 dans la source] » (Q2, DIATEC) — origine : la source elle-même /
   présentation OE.** Ce renvoi désigne la référence 19 de la bibliographie interne de DIATEC, pas la
   référence [19] de ce document (Khunti et al., sujet différent) — risque de confusion pour un lecteur
   pressé.
10. **Mélange de versions 2025/2026 de l'ADA chapitre 9 — origine : la source elle-même (artefact de
    collage OE).** Le bloc « Figure 9.4 » collé en fin de retour (avant « ### References ») cite la
    version 2025 du chapitre 9 (S181-S206, référence [17] de la liste), alors que le corps du texte
    utilise la version 2026 ([13]) — sans conséquence sur le verdict de [13] lui-même.
11. **Bloc de citations « Figure X » non rattaché à un appel entre crochets — origine : la source
    elle-même.** Les lignes 70-105 du fichier brut introduisent les références 17 à 23 (jamais appelées
    par un `[n]` dans le corps) : artefact de présentation de l'interface OE (légendes de figures
    collées avec le texte), hors du périmètre strict des brackets [1]-[16] mais à signaler pour la
    lisibilité du dossier.

### Décompte

| | HAUTE | MOYENNE | BASSE | Total |
|---|---|---|---|---|
| OE seule | 2 | 4 | 2 | 8 |
| Non vérifiable en l'état | 1 | 1 | 0 | 2 |
| La source elle-même | 0 | 0 | 1 | 1 |
| **Total** | **3** | **5** | **3** | **11** |

## Confirmations obtenues

- **[2]** Martens et al. 2025 (DSX) — le « nadir MCG de la 1 h du matin » équivalent à la glycémie à
  jeun sur 3 algorithmes (INSIGHT, Treat2Target, AT.LANTUS) — confirmé par le résumé de l'article
  (ScienceDirect).
- **[9]** ADA Standards of Care 2026, chapitre 6 — chapitre consacré aux objectifs glycémiques et aux
  paramètres MCG — confirmé par la notice de l'article (PubMed/ADA, pagination exacte).
- **[13]** ADA Standards of Care 2026, chapitre 9 — chapitre pharmacologique, pagination exacte
  (S183-S215) — confirmé.
- **[16]** Battelino et al. 2023 — consensus international sur les métriques MCG pour essais cliniques,
  actualisation légitime du consensus ATTD 2019 — confirmé.
- **Identité des cinq essais/méta-analyse centraux** — DIATEC [1], MOBILE [3], FreeDM2 [4], Jancev [5],
  et la retrospective Martens [2] — tous confirmés comme des publications réelles, correctement
  titrées, datées et indexées ; aucune référence fantôme détectée sur l'ensemble des 16 appels vérifiés.
- **PMID 31177185** (consensus ATTD/ICTR, cité en texte libre, hors brackets) — confirmé comme
  identifiant réel et cohérent avec le consensus ATTD 2019 déjà connu du référent (cadrage du prompt).

## Points ouverts (nature et suite)

| Point | Nature | Suite proposée |
|---|---|---|
| Protocole exact de titration dans MOBILE/FreeDM2 (finding HAUTE n°3) | Source probablement disponible mais non consultée en texte intégral | Recherche ciblée sur les Méthodes des deux articles princeps (voie : page éditeur JAMA / Lancet Diabetes Endocrinol) |
| PMID 40683222 et 42035781 non recoupés | Source probablement disponible mais non consultée par la bonne voie | Appeler `identite.mjs` (nécessite `node` — absent de cette session) ou une notice PubMed E-utilities directe, avant toute entrée en registre |
| Chiffres précis de Jancev, AACE, MOBILE (TIR) | Source probablement disponible mais non consultée | Lecture du texte intégral / tableaux princeps avant validation des chiffres |
| Mélange de versions ADA ch.9 2025/2026 | Coquille du document (artefact de collage OE) | À signaler au référent, sans relance de recherche |

## Verdict par sous-question (limité aux références vérifiées ici)

- **Q1/Q2** — aucun essai comparatif ou algorithme prospectif trouvé pour un pilotage MCG de la basale :
  cohérent avec les Attendus ; les références attachées ([1], [2]) sont d'identité confirmée et de
  soutien globalement correct, sous réserve du détail méthodologique de DIATEC.
- **Q3 (décisive)** — **non tranché** : les références sont bien identifiées, mais le point clinique
  central (titration clinicien-dépendante vs pilotée) n'est pas vérifié sur le texte intégral dans
  cette passe — reste `[À VÉRIFIER]`.
- **Q4** — la distinction seuil d'interprétation / seuil d'action posologique tient sur le fond, mais
  deux de ses quatre références d'appui ([6], et dans une moindre mesure [7]) sont mal ou peu
  rattachées ; à reformuler avec [8], [9], [16] comme appuis principaux.
- **Q5** — soutenue par des sources d'identité confirmée ([12], [13], [14]) mais dont deux comportent
  des réserves de soutien (surinterprétation possible pour [14]) ; les signaux de sur-basalisation
  eux-mêmes ([13], [10]) sont bien étayés.
- **Q6** — la conclusion « aucune recommandation post-2019 ne définit d'algorithme MCG » tient sur les
  références solides ([9], [13], [16]) mais s'appuie aussi sur [15], qui ne soutient ni le point ADA/EASD
  ni le point NICE : ces deux phrases précises du Q6 restent **non étayées** en l'état et doivent être
  reformulées ou re-sourcées avant toute entrée au nœud.

## Ce que cette pièce ne couvre pas

Pas de registre des affirmations, pas de passe d'omission, pas de consolidation (Agent C), pas de porte
`verifier-registre.mjs` : cette pièce est la seule étape de contradiction demandée sur un retour déjà
collecté, pas un dossier complet du circuit `recherche-preuve-triangulee`. La décision d'intégrer, de
reformuler ou d'écarter les affirmations reste au référent.
