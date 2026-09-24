# Red-team (Agent B) — Titration de la basale pilotée par MCG, DT2

Circuit `recherche-preuve-triangulee`, étape 2 (Agent B). Cible : le retour brut OpenEvidence
`epreuve/entrees/OE-titration-mcg-brut-2026-08-11.txt`, réponse au prompt
`epreuve/entrees/prompt-OE-titration-mcg.md` (6 sous-questions Q1-Q6), posé le 2026-08-11.

**Adaptation du gabarit standard** : ce chantier ne comporte pas de rapport « Agent A » distinct — le
référent a demandé la relecture red-team du seul retour OpenEvidence. Les catégories d'origine du
gabarit habituel se réduisent donc à trois : **OpenEvidence seule fautive**, **la source primaire
elle-même**, **non-vérifiable (accès bloqué)**. Aucune requête OpenEvidence n'a été posée pour ce
travail, conformément à la consigne.

## Accès obtenus / accès bloqués

Les connecteurs MCP dédiés (PubMed, ClinicalTrials.gov) ont été refusés par le harness au moment de
l'exécution (« don't ask mode »). Repli utilisé, dans l'esprit de la consigne (rouvrir les sources
primaires, pas de contournement de paywall) :
- **NCBI E-utilities** (`eutils.ncbi.nlm.nih.gov`) — abstracts, PMID, métadonnées bibliographiques.
- **PMC / Europe PMC** — texte intégral quand l'article est en libre accès.
- **Crossref API** et résolution **doi.org** — métadonnées bibliographiques faisant autorité,
  non payantes.
- **WebSearch/WebFetch** en complément, uniquement pour corroborer des métadonnées ou retrouver des
  extraits déjà indexés publiquement — jamais pour contourner un paywall.

Accès bloqués (403) sur les versions payantes de : diabetesjournals.org (ADA Standards of Care ch.6
et ch.9, MOBILE en accès direct), linkinghub.elsevier.com (AACE 2026, FreeDM2), jamanetwork.com
(Dower et al.), thelancet.com (Battelino 2023). Dans ces cas, l'existence bibliographique a pu être
confirmée (Crossref/eutils) mais le contenu chiffré précis n'a pas pu être vérifié en primaire — noté
ci-dessous comme **NON VÉRIFIABLE (accès bloqué)**, un résultat honnête et non une faute d'un agent.

Elicit (connecteur MCP) n'a pas été utilisé : authentification non disponible dans cette session.

---

## Verdicts par référence — [1] à [16]

| # | Référence citée | Existence | Soutien |
|---|---|---|---|
| [1] | DIATEC, Olsen MT et al., Diabetes Care 2025;48(4):569-578, doi:10.2337/dc24-2222 | **CONFIRMÉE** | **PARTIELLEMENT SOUTENU** |
| [2] | Martens TW et al., Diabetes Metab Syndr 2025;19(6):103266, doi:10.1016/j.dsx.2025.103266, PMID 40683222 | **CONFIRMÉE** (PMID exact) | **SOUTENU** |
| [3] | MOBILE, Martens T et al., JAMA 2021;325(22):2262-2272, doi:10.1001/jama.2021.7444, PMID 34077499 | **CONFIRMÉE** (PMID exact) | **SOUTENU** |
| [4] | FreeDM2, Wilmot EG et al., Lancet Diabetes Endocrinol 2026;14(6):463-474, doi:10.1016/S2213-8587(26)00076-8, PMID 42035781 | **CONFIRMÉE** (PMID exact) | **PARTIELLEMENT SOUTENU** |
| [5] | Jancev M et al. (méta-analyse), Diabetologia 2024;67(5):798-810, doi:10.1007/s00125-024-06107-6, PMID 38363342 | **CONFIRMÉE** (PMID exact) | **SOUTENU** |
| [6] | Aroda VR, Eckel RH, Diabetes Obes Metab 2022;24(12):2297-2308, doi:10.1111/dom.14830 | **CONFIRMÉE** | **SOUTENU** (chiffres) / réserve Q6 |
| [7] | Anagnostopoulou L et al., Diabetes Obes Metab 2026;28(2):840-849, doi:10.1111/dom.70288 | **CONFIRMÉE** | **SOUTENU** (chiffres) / réserve Q6 |
| [8] | Goshrani A et al., Diabetes Obes Metab 2025;27(5):2342-2362, doi:10.1111/dom.16279 | **CONFIRMÉE** | **SOUTENU** (chiffres) / réserve Q6 |
| [9] | ADA Standards of Care 2026 ch.6, Diabetes Care 2026;49(S1):S132-S149, doi:10.2337/dc26-S006 | **CONFIRMÉE** | **PARTIELLEMENT SOUTENU** (1 citation verbatim retrouvée mais dégradée ; 2ᵉ non vérifiable) |
| [10] | AACE 2026 Consensus, Samson SL et al., Endocr Pract 2026;32(4):473-518, doi:10.1016/j.eprac.2026.01.006 | **CONFIRMÉE** | **NON VÉRIFIABLE** (accès bloqué — chiffres Algorithme 8) |
| [11] | Bolli GB et al., Diabetes Care 2025;48(5):671-681, doi:10.2337/dci24-0104 | **CONFIRMÉE** | **NON VÉRIFIABLE** (accès bloqué — chiffres ≤2U/semaine, cible 100-120) |
| [12] | Dower JA et al., JAMA Intern Med 2026, doi:10.1001/jamainternmed.2026.2772 | **CONFIRMÉE AVEC DIVERGENCE MINEURE** (pagination : ID interne « 2851941 » au lieu de 186(9):1166) | **SOUTENU** |
| [13] | ADA Standards of Care 2026 ch.9, Diabetes Care 2026;49(S1):S183-S215, doi:10.2337/dc26-S009 | **CONFIRMÉE** | **NON VÉRIFIABLE** (accès bloqué — BeAM value, seuils sur-basalisation) |
| [14] | Peters AL et al., Diabetes Obes Metab 2019;21(7):1752-1756, doi:10.1111/dom.13729 | **CONFIRMÉE** | **SOUTENU** |
| [15] | Irace C et al., Diabetes Metab Res Rev 2025;41(5):e70059, doi:10.1002/dmrr.70059 | **CONFIRMÉE** | **PARTIELLEMENT SOUTENU** (contenu fidèle mais sourcing tertiaire pour EASD/NICE) |
| [16] | Battelino T, Alexander CM, Amiel SA et al., Lancet Diabetes Endocrinol 2023;11(1):42-57, doi:10.1016/S2213-8587(22)00319-9 | **CONFIRMÉE** | **PARTIELLEMENT SOUTENU** (objet réel : métriques pour essais cliniques, pas cibles d'interprétation en pratique — cf. finding HAUTE) |

**Constat transversal** : aucune des 16 références n'est fabriquée. Tous les PMID donnés en toutes
lettres dans le texte (40683222, 34077499, 42035781, 38363342) correspondent exactement à l'article
attendu — l'erreur classique de « citation hallucinée » (mauvais PMID substitué) ne se produit pas
ici. Les défauts identifiés sont d'un autre ordre : chiffres non vérifiables (paywall), un
rattachement de PMID en prose qui ne correspond à aucune référence numérotée, une étiquette imprécise
et un sourcing tertiaire.

---

## Findings, classés par sévérité et par origine

### HAUTE

**F1 — PMID 31177185 rattaché à la mauvaise référence (origine : OpenEvidence seule fautive)**
En Q6, le texte affirme : « ATTD/ICTR (PMID 31177185 et actualisations) : uniquement des cibles
d'interprétation […].[6][7][16][8] ». Le PMID 31177185 correspond en réalité à Battelino T, Danne T,
Bergenstal RM et al., *« Clinical Targets for Continuous Glucose Monitoring Data Interpretation:
Recommendations From the International Consensus on Time in Range »*, Diabetes Care 2019;42(8):
1593-1603 — un article **différent** de la référence [16] fournie (Battelino, **Alexander**, **Amiel**
et al., Lancet Diabetes Endocrinol 2023, objet réel : standardisation des métriques MCG pour le
**reporting des essais cliniques**, pas les cibles cliniques d'interprétation en pratique courante).
Ce PMID 31177185 n'est confirmé par **aucune** des 4 références numérotées auxquelles la phrase le
rattache. Conséquence : le texte donne l'apparence d'une traçabilité précise (un PMID cité) qui ne
résiste pas à la vérification — le consensus ICTR 2019 réellement identifiable par ce PMID n'est nulle
part dans l'apparat de citation du document. Le fond de l'affirmation (des cibles d'interprétation
existent, pas d'algorithme posologique) reste probablement correct — voir F5 pour [6][7][8] qui, eux,
soutiennent bien les chiffres — mais l'attribution précise est fautive.

### MOYENNE

**F2 — Chiffres posologiques non vérifiables indépendamment : réf. [10] AACE Algorithme 8 (origine : non-vérifiable, accès bloqué)**
Les valeurs « +20 % si >180 mg/dL, +10 % si 140-180, +1 unité si 110-139, réduction 10-20 % » et le
nom « Algorithme 8 » n'ont pas pu être confirmés en primaire (Endocrine Practice payant). L'existence
bibliographique du document (Samson SL, Vellanki P, Blonde L et al., 2026) est confirmée exactement.

**F3 — Chiffres posologiques non vérifiables indépendamment : réf. [11] Bolli et al. (origine : non-vérifiable, accès bloqué)**
« ≤2 unités de variation par semaine, cible glycémie à jeun 100-120 mg/dL » non retrouvé en primaire
(Diabetes Care payant, aucun extrait indexé ne le confirme). Existence bibliographique confirmée.

**F4 — Seuils de sur-basalisation non vérifiables indépendamment : réf. [13] ADA ch.9 / BeAM value (origine : non-vérifiable, accès bloqué)**
Différentiel coucher-réveil ≥50 mg/dL (≥2,8 mmol/L), dose >0,5 U/kg/j : non retrouvés en primaire
(Diabetes Care payant). Existence bibliographique du chapitre confirmée exactement.

**F5 — Sourcing tertiaire pour caractériser ADA/EASD et NICE : réf. [15] (origine : OpenEvidence seule fautive)**
En Q6, OE s'appuie sur Irace et al. (revue d'avis d'experts italiens) pour dire ce que « suggère » le
consensus ADA/EASD et ce que « recommande » NICE — au lieu de citer les documents primaires ADA/EASD
et NICE eux-mêmes, alors que Q6 demandait explicitement des « recommandations internationales
indexées » avec « le paragraphe exact et son grade ». Vérification faite : le contenu rapporté par OE
est **fidèle** à ce que dit effectivement Irace et al. (citations verbatim retrouvées en texte
intégral), donc pas d'erreur factuelle en bout de chaîne — mais la méthode introduit un double
filtrage non primaire là où le prompt exigeait le contraire.

### BASSE

**F6 — DIATEC [1] : affirmation « algorithmes identiques dans les deux bras » non vérifiable en primaire (origine : non-vérifiable, accès bloqué)**
Cohérente avec l'abstract (population hospitalière, deux bras différant par la seule source de
mesure) mais le détail « algorithmes identiques » n'apparaît pas explicitement dans l'abstract
disponible ; texte intégral payant, non indexé PMC.

**F7 — FreeDM2 [4] : affirmation « sans différence de dose d'insuline » en phase 1 non vérifiable en primaire (origine : non-vérifiable, accès bloqué)**
Design en deux phases et population confirmés exactement par l'abstract ; l'absence de différence de
dose n'y est pas explicitement mentionnée (texte intégral bloqué, non indexé PMC/Europe PMC — revue
2026 très récente).

**F8 — Étiquette imprécise « actualisations du consensus ATTD/ICTR » pour [6][7][8] (origine : OpenEvidence seule fautive)**
[6] (Aroda/Eckel, revue CVD), [7] (Anagnostopoulou, revue complications microvasculaires) et [8]
(Goshrani, revue TIR) *citent* tous les trois le consensus ATTD/ICTR et en reproduisent fidèlement les
seuils chiffrés (confirmé en texte intégral pour les trois) — mais ce sont des revues narratives qui
rapportent le consensus, pas des « actualisations » du consensus lui-même. Qualification à corriger
si reprise dans un nœud.

**F9 — Citation « verbatim » de [9] partiellement dégradée (origine : artefact de transcription du document source, ni OE ni les agents)**
La citation attribuée à l'ADA ch.6 (« TBR (<70 et <54 mg/dL) and TAR (>180 mg/dL) are useful
parameters… ») a perdu les symboles `<`/`>` et le segment « and TAR » dans le fichier brut fourni —
un extrait indexé public retrouve une formulation très proche et complète. Le même phénomène de perte
de `<`/`>` est visible ailleurs dans le fichier source (Q4, ligne 32 ; Q6, ligne 59), ce qui pointe
vers un artefact de copier-coller/rendu Markdown au moment où le référent a collé le retour brut,
plutôt qu'une erreur de fond d'OpenEvidence. À signaler au référent pour ne pas la lire comme une
altération volontaire du contenu.

**F10 — Pagination non standard pour [12] (origine : OpenEvidence seule fautive, mineure)**
La référence donne « JAMA Internal Medicine 2026;:2851941 » (identifiant d'article interne JAMA) au
lieu de la pagination réelle (186(9):1166). Sans conséquence sur le fond — le contenu (revue narrative
« Less Is More ») est correctement caractérisé.

---

## Confirmations obtenues

- **[2] Martens et al. (rétrospectif, nadir 1 h du matin)** — SOUTENU intégralement : 68 patients,
  7354 paires, trois algorithmes de comparaison (INSIGHT canadien, Treat2Target, AT.LANTUS), erreurs
  de dose −10 % à +10 %, tous confirmés verbatim dans l'abstract.
- **[3] MOBILE** — SOUTENU intégralement, avec **texte intégral obtenu** (PMC8173473) : TIR +15 %
  (IC95 % 8-23), HbA1c −0,4 % (IC95 % −0,8 à −0,1) à 8 mois, absence de différence de dose totale
  d'insuline entre bras, et titration « faite par le médecin de soins primaires » — les quatre
  éléments cités par OE sont retrouvés mot pour mot dans la source primaire.
- **[5] Jancev (méta-analyse)** — SOUTENU intégralement, chiffres recroisés et convertis avec succès
  (HbA1c −3,43 mmol/mol = −0,31 %, IC95 % −0,43 à −0,19 % ; TIR +6,36 %, IC95 % 2,48-10,24 ; TAR
  −5,86 % ; TBR −0,66 % — tous exacts).
- **[6][7][8]** — les seuils numériques ATTD/ICTR (TIR >70 %, TBR <4 %, TAR <25 %/<5 %) sont retrouvés
  verbatim en texte intégral dans les trois revues, malgré l'imprécision d'étiquetage relevée en F8.
- **[14] Peters et al. 2019** — usage exemplaire : confirmé qu'il s'agit d'une analyse post-hoc
  réorientant explicitement vers l'intensification par **bolus**, pas vers la titration de basale —
  exactement la nuance que le texte OE met en avant, sans mésattribution.
- **[9] et [13] (ADA ch.6 et ch.9)** — existence bibliographique exacte (DOI, volume, pages) malgré
  l'accès bloqué au contenu fin.
- **Aucune référence fabriquée, aucun PMID substitué** parmi les 16 — point à souligner : sur ce
  chantier, OpenEvidence n'a pas halluciné de source, contrairement au risque le plus redouté pour ce
  type d'outil.

---

## Décompte final

**Par existence** (16/16 vérifiées) : CONFIRMÉE 15 · CONFIRMÉE AVEC DIVERGENCE MINEURE 1 ([12]) ·
INTROUVABLE 0.

**Par soutien** : SOUTENU 7 ([2][3][5][6][7][8][14]) · PARTIELLEMENT SOUTENU 5 ([1][4][9][15][16]) ·
NON VÉRIFIABLE — accès bloqué 3 ([10][11][13], existence confirmée, contenu chiffré non vérifié) ·
NON SOUTENU / CONTREDIT 0.

**Par sévérité** : HAUTE 1 (F1) · MOYENNE 4 (F2, F3, F4, F5) · BASSE 5 (F6, F7, F8, F9, F10).

**Par origine** : OpenEvidence seule fautive 4 (F1, F5, F8, F10) · non-vérifiable/accès bloqué 5
(F2, F3, F4, F6, F7) · artefact de transcription du document source 1 (F9) · Agent A ET OpenEvidence /
Agent A seule : sans objet (pas de rapport Agent A dans ce chantier).

---

## Verdict par sous-question

- **Q1** (ECR comparatif MCG-métriques vs FPG) — **SOUTENU**, avec une réserve mineure non résolue :
  l'absence d'ECR ambulatoire est confirmée par construction (aucune source ne la contredit) ; DIATEC
  existe et est correctement écarté comme hospitalier, mais le détail « algorithmes identiques » (F6)
  reste à confirmer en texte intégral si le référent veut le citer verbatim dans le nœud.
- **Q2** (algorithme publié et évalué prospectivement) — **SOUTENU** intégralement ; le nadir 1 h du
  matin de Martens et al. est correctement caractérisé comme rétrospectif et substitutif, pas
  prospectif ni piloté par métriques MCG.
- **Q3** (protocole réellement appliqué — MOBILE/FreeDM2/Jancev) — **SOUTENU pour MOBILE et Jancev**
  (vérification en texte intégral) ; **PARTIELLEMENT SOUTENU pour FreeDM2** (design confirmé, l'absence
  de différence de dose en phase 1 non vérifiable indépendamment — F7).
  Ne pas encoder d'affirmation ferme sur ce point précis de FreeDM2 sans nouvel accès.
  Aucune version n'appelle correction : le sens global (titration clinicien-dépendante ou non
  harmonisée dans les trois essais) tient.
- **Q4** (seuils MCG comme déclencheur posologique) — **PARTIELLEMENT VÉRIFIÉ**. La conclusion négative
  (« aucun seuil MCG d'action posologique validé, aucun ECR trouvé ») n'est contredite par aucune
  vérification. Les seuils d'interprétation ATTD/ICTR chiffrés (refs 6/7/8) sont solidement confirmés.
  Les algorithmes de repli fondés sur la glycémie à jeun (AACE, Bolli) existent bibliographiquement
  mais leurs chiffres précis ne sont pas vérifiés indépendamment (F2, F3) — à traiter comme
  `[À VÉRIFIER]` si le nœud doit citer ces pourcentages précis.
- **Q5** (profil nocturne AGP et sur-basalisation) — **SOUTENU pour la caractérisation qualitative**
  (Dower et al. correctement qualifié d'opinion/revue narrative ; Peters 2019 confirmé et correctement
  réorienté vers le bolus). **NON VÉRIFIÉ INDÉPENDAMMENT** pour les seuils chiffrés de sur-basalisation
  (BeAM ≥50 mg/dL, dose >0,5 U/kg/j — F4).
- **Q6** (recommandations internationales post-2019) — **PARTIELLEMENT SOUTENU**. La conclusion
  qualitative (pas d'algorithme MCG posologique dans les recommandations indexées) n'est contredite par
  rien, mais l'apparat de citation qui la porte a deux failles réelles : le rattachement PMID 31177185
  (F1, HAUTE) et le sourcing tertiaire via Irace et al. pour caractériser ADA/EASD et NICE (F5,
  MOYENNE) alors que le prompt demandait explicitement les documents primaires. À corriger avant
  encodage si Q6 doit servir de base à un argumentaire citant nommément ADA/EASD ou NICE.

---

## Proposition de libellé pour le nœud (si le référent valide)

Trois formulations graduées, de la plus prudente à la plus affirmative — au choix du référent :

**1. Prudente** :
> Aucun essai randomisé ambulatoire n'a comparé une titration de basale pilotée par les métriques de
> mesure continue du glucose à une titration pilotée par la glycémie capillaire à jeun chez le DT2
> (recherche à jour du 2026-08-11). Les métriques MCG (temps dans la cible, temps au-dessus/sous la
> cible) sont validées comme cibles d'interprétation (consensus international sur le temps dans la
> cible), pas comme déclencheurs chiffrés de majoration de dose.

**2. Intermédiaire** (ajoute le contraste avec le pilotage clinique) :
> … Dans les essais randomisés existants de MCG chez le DT2 sous basale (MOBILE, JAMA 2021,
> PMID 34077499), le bénéfice observé sur le temps dans la cible et l'HbA1c n'était pas lié à une
> différence de dose d'insuline entre bras : la titration restait à la discrétion du clinicien de
> soins primaires, pas pilotée par un algorithme sur métriques capteur.

**3. Affirmative** (à ne retenir que si le référent veut trancher, avec réserve explicite sur les
`[À VÉRIFIER]` ci-dessous) :
> À ce jour, la titration de la basale reste pilotée par la glycémie à jeun, y compris chez les
> patients porteurs d'une MCG ; aucune règle posologique chiffrée (« si TIR < X %, alors +N unités »)
> fondée sur les métriques MCG n'est validée par un essai randomisé ni retenue par une recommandation
> internationale indexée post-2019.

**`[À VÉRIFIER]` avant tout encodage engageant des chiffres précis** :
- Algorithme 8 AACE 2026 (+20 %/+10 %/+1 U) — accès bloqué, non confirmé en primaire (F2).
- Bolli et al. 2025 (≤2 U/semaine, cible 100-120 mg/dL) — accès bloqué, non confirmé (F3).
- Seuils ADA ch.9 de sur-basalisation (différentiel coucher-réveil ≥50 mg/dL, dose >0,5 U/kg/j /
  BeAM value) — accès bloqué, non confirmé (F4).
- Ne pas citer nommément « ADA/EASD » ou « NICE » sur la seule foi d'Irace et al. 2025 sans revérifier
  au moins un extrait du document primaire correspondant (F5).
- Reformuler toute mention de « consensus ATTD/ICTR PMID 31177185 » : ce PMID désigne le consensus
  2019 (Battelino, Danne, Bergenstal), distinct de la référence 2023 (Battelino, Alexander, Amiel)
  utilisée dans le retour — citer l'un ou l'autre explicitement, pas les deux sous un même PMID (F1).
