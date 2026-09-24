# Passe A — première lecture du retour OE, bloc OE-A2 (descente de la basale sur GAJ)

> Statut : **provisoire**, non red-teamé (cf. `PROMPTS-OE-passeA.md` §Après OE, point 3). Ne sert
> qu'à préparer la transmission à l'Agent B — aucun chiffre ci-dessous n'entre dans `content/**`.
> Source lue : `epreuve/entrees/OE-passeA-brut-2026-07-29.txt`, bloc de réponse correspondant au
> prompt OE-A2 (`PROMPTS-OE-passeA.md` lignes 49-76), repéré dans le brut entre la phrase d'accroche
> « This is a comprehensive, structured response organized by trial... » et la fin de sa liste de
> références (25 items) — juste avant que le brut n'enchaîne sur le bloc OE-A3 (SMBG).
> Aucune requête OpenEvidence, PubMed ou autre n'a été effectuée pour produire cette lecture : tout
> vient du texte déjà archivé.

## 1. Ce que couvre effectivement ce bloc

Le prompt OE-A2 posait trois sous-questions précises. Ce document ne traite que la **sous-question
1 (« The down-titration rule »)** — c'est le point demandé par le référent pour ce chantier. Les
sous-questions 2 (plafond de dose) et 3 (sujet âgé/fragile) apparaissent dans le même bloc mais ne
sont pas reprises ici.

## 2. Table maîtresse — règles de réduction de dose rapportées par le retour

Statut de récupération par ligne selon la convention du skill `recherche-preuve-triangulee` : `oui`
(rapporté intact) / `partiel` (rapporté mais tronqué ou incohérent avec une autre partie du même
document) / `NON VÉRIFIÉ` (OE lui-même déclare ne pas pouvoir l'ancrer, ou la donnée est absente).

| Essai | Déclencheur de la réduction (tel que rapporté) | Montant de la réduction | Référence donnée par OE (n° de sa propre liste OE-A2) | Statut de récupération |
|---|---|---|---|---|
| **Treat-to-Target** (Riddle 2003) | « Any PG [glycémie] » suivi d'un seuil **tronqué dans le texte récupéré** — la phrase s'interrompt après « no dose increase was made if any plasma glucose was » | Le paragraphe dédié à l'essai ne donne **aucun montant**. Le tableau de synthèse § Question 1, plus bas dans le même retour, donne lui « Fixed units (−2 to −4 U) » pour ce même essai — **incohérence interne**, les deux passages du retour ne se recoupent pas | [1], [2] dans le tableau de synthèse ; [5][4] dans le paragraphe dédié | `partiel` — deux valeurs différentes possibles selon l'endroit du retour, aucune complète |
| **AT.LANTUS — algorithme Fritsche** (médecin) | GAJ moyenne (3 valeurs), tableau lisible : 90–110 mg/dL = pas de changement | **−2 U** (ligne du tableau, en dessous de 90 mg/dL) | [3] dans le tableau de titration ; [6] pour la source de ce même tableau plus haut dans le texte | `partiel` — le montant est lisible, mais la référence change de numéro selon l'endroit (voir §3.2) |
| **AT.LANTUS — algorithme Davies** (patient) | Règle de sécurité censée déclencher la baisse **tronquée** : « in the absence of BG » puis coupure | Non retrouvé dans ce retour | [3], [6] | `NON VÉRIFIÉ` |
| **INSIGHT** (Gerstein 2006) | — | — | [4] (tableau) / [7] (paragraphe, qui est la référence Gerstein elle-même) | `NON VÉRIFIÉ` — **OE le dit lui-même explicitement** : « the primary publication does not specify a formal down-titration step size (...) does not publish an explicit "reduce by X units if FBG..." » et le tableau de synthèse porte « Cannot be grounded » |
| **LANMET** (Yki-Järvinen 2006) | — | — | [5] dans le tableau (pointe vers Arakaki 2014, un essai lispro-protamine **sans rapport** avec LANMET) | `NON VÉRIFIÉ` — **OE le dit lui-même explicitement** : « A specific down-titration step cannot be grounded in the primary LANMET publication » |
| **PREDICTIVE 303** (Meneghini 2007) | Mean aFPG (moyenne de 3 valeurs), seuil numérique **tronqué** : « reduce by 3 U if mean aFPG » puis coupure | **−3 U** (le montant a survécu, pas le seuil déclencheur) | [6] (tableau — pointe en fait vers Seufert 2019/AT.LANTUS, pas Meneghini) ; [10] est la vraie référence Meneghini dans la liste | `partiel` |
| **ATLAS** (Garg 2015) | **BG ≤56 mg/dL (≤3,1 mmol/L)** — seuil complet, non tronqué (symbole ≤ Unicode) | « At physician's discretion » — **aucun montant fixe** précisé par le protocole selon OE | [7] (tableau — pointe en fait vers Gerstein/INSIGHT, pas Garg) ; [12] est la vraie référence Garg | `oui` pour le déclencheur, `NON VÉRIFIÉ` pour le montant (délibérément non fixé) |
| **EDITION 3** (Gla-300, Bolli 2015) | « SMPG 60– » puis coupure — plage tronquée, borne haute manquante | **−3 U** (partiel — le texte laisse deviner un système par paliers de 3 U mais le mécanisme complet n'est pas lisible) | [8] (tableau — pointe en fait vers Mathieu/Robbrecht 2008, pas Bolli) ; [13] est la vraie référence Bolli | `partiel` |
| **TAKE CONTROL** (Gla-300, Russell-Jones 2019) | « SMPG » puis coupure — seuil totalement absent | **−3 U** | [7] (tableau — pointe en fait vers Gerstein/INSIGHT, pas Russell-Jones) ; [14] est la vraie référence | `partiel` |
| **SENIOR** (Ritzel 2018, ≥65 ans) | « SMPG » puis coupure — seuil totalement absent | **−3 U** | [7] (tableau — même doublon erroné qu'ATLAS et TAKE CONTROL) ; [15] est la vraie référence | `partiel` |
| **Home et al. 2015** (algorithme « hypo-sensible ») | Deux paliers évoqués (« any measurement » puis « if » ) — **les deux seuils numériques sont tronqués** | **−2 U** pour le premier palier ; second palier illisible | [9] (tableau — pointe en fait vers Yki-Järvinen/LANMET, pas Home) ; [16] est la vraie référence | `partiel` |

## 3. Ce qui empêche de s'y fier avant transmission à l'Agent B

### 3.1 — Sévérité HAUTE : corruption systématique des seuils numériques du retour brut

Le fichier archivé présente un schéma répété : chaque fois qu'une règle de titration s'exprime avec
un comparateur ASCII simple (`<`, `>`) suivi d'une valeur — la forme naturelle pour « réduire si
glycémie **<** 70 mg/dL » — le texte s'interrompt net après le mot qui précède, et reprend au milieu
d'une phrase suivante (souvent au niveau d'un `]` de référence). Exemples observés dans ce bloc
seul : « was [5][4] », « if FPG [7] », « if mean aFPG [10] », « SMPG [1][14] », « SMPG 60– » (avant
un tiret qui devrait introduire la borne haute), « any measurement [16] ». À l'inverse, les valeurs
utilisant un symbole Unicode (`≤`, `≥`) sont systématiquement intactes (ATLAS : « ≤56 mg/dL
(≤3,1 mmol/L) »). L'hypothèse la plus probable est qu'un traitement de type « suppression de
balises HTML/XML » a été appliqué quelque part dans la chaîne de récupération/collage du retour, et
qu'il a avalé tout segment ressemblant à `<...>` — c'est-à-dire précisément les seuils numériques
qui sont l'objet même de la sous-question 1.
**Conséquence directe** : la quasi-totalité des seuils déclencheurs de baisse de dose dans ce bloc
sont illisibles dans le document tel qu'archivé, alors que les montants de réduction (qui
s'expriment sans `<`/`>`, ex. « −3 U ») ont pour la plupart survécu. La table ci-dessus reflète cette
asymétrie : on connaît souvent le **combien** mais pas le **quand**.
**Action recommandée pour l'Agent B** : ne pas tenter de deviner les valeurs tronquées à partir du
contexte ; rouvrir chaque source primaire (Riddle 2003, Meneghini 2007, Bolli 2015, Russell-Jones
2019, Ritzel 2018, Home 2015) pour lire les seuils exacts, faute de quoi ces lignes restent
`[À VÉRIFIER]` de façon indéfinie.

### 3.2 — Sévérité HAUTE : la numérotation des références du tableau de synthèse (§ Question 1) ne correspond pas à la liste de références du même retour

En comparant le tableau récapitulatif « Question 1 » à la liste numérotée 1-25 fournie en fin de
bloc OE-A2 :
- Treat-to-Target est référencé `[1]` dans ce tableau, alors que l'item `[1]` de la liste est **Khunti
  et al. 2020** (une revue narrative sur la titration, pas l'essai princeps de Riddle).
- AT.LANTUS est référencé `[3]`, alors que l'item `[3]` de la liste est **Barnett 2007** (revue sur le
  dosage, pas la publication AT.LANTUS elle-même — qui est ailleurs dans le retour rattachée aux PMID
  16306275/17593236).
- INSIGHT est référencé `[4]`, qui pointe vers **Frier 2019** (revue sur le signalement des
  hypoglycémies), alors que la vraie référence Gerstein 2006 est l'item `[7]`.
- LANMET est référencé `[5]`, qui pointe vers **Arakaki 2014**, un essai sur l'insuline lispro
  protamine vs glargine **sans rapport apparent** avec LANMET.
- PREDICTIVE 303 est référencé `[6]`, qui pointe vers **Seufert 2019** (papier sur l'algorithme
  AT.LANTUS), alors que la vraie référence Meneghini 2007 est l'item `[10]`/`[11]`.
- ATLAS, TAKE CONTROL et SENIOR — **trois essais différents** — partagent tous les trois le même
  renvoi `[7]` dans ce tableau, qui pointe vers **Gerstein 2006/INSIGHT**, alors que leurs vraies
  références sont respectivement `[12]`, `[14]`, `[15]`.
- EDITION 3 est référencé `[8]`, qui pointe vers **Mathieu/Robbrecht 2008**, alors que la vraie
  référence Bolli 2015 est l'item `[13]`.
- Home 2015 est référencé `[9]`, qui pointe vers **Yki-Järvinen 2006/LANMET**, alors que la vraie
  référence est l'item `[16]`.

Autrement dit : **aucun** des numéros de référence affichés dans le tableau de synthèse ne
correspond à l'essai qu'il est censé sourcer. Le motif (décalage/réutilisation qui ne suit aucun
offset constant, avec réutilisation du même `[7]` pour trois lignes) suggère une corruption de
sérialisation du tableau plutôt qu'une erreur de fond ligne par ligne, mais je ne peux pas trancher
la cause avec ce que contient le fichier. **À traiter comme : aucun numéro de référence de ce tableau
ne doit être utilisé tel quel** ; l'Agent B doit rattacher chaque ligne à sa source par le nom de
l'essai et l'année, pas par le crochet, et revérifier chaque PMID/DOI indépendamment.

### 3.3 — Sévérité HAUTE : PMID contradictoire pour AT.LANTUS *à l'intérieur du même retour archivé*

Le bloc de réponse OE-A1 (plus haut dans le même fichier brut, section « B5. AT.LANTUS ») attribue à
AT.LANTUS le PMID **14578243** (Diabetes Care 2003). Le bloc OE-A2, pour le même essai, donne PMID
**16306275** (primaire, Diabetes Res Clin Pract 2005) et 17593236 (sous-analyse, Diabetes Obes
Metab 2007) — un PMID totalement différent pour ce qui est présenté comme la publication princeps.
Les deux ne peuvent pas être justes simultanément. Pour mémoire, le rappel en tête de
`PROMPTS-OE-passeA.md` (nœuds H et E : « la totalité des PMID rendus par OE étaient faux ») rend
cette divergence d'autant plus à prendre au sérieux — aucun des deux PMID ne doit être considéré
comme acquis avant vérification PubMed par l'Agent B.

### 3.4 — Sévérité MOYENNE : deux essais où OE reconnaît lui-même l'absence de règle de descente publiée

INSIGHT et LANMET sont les deux seuls essais du groupe où OE ne prétend pas produire une valeur — il
déclare explicitement l'absence de règle de descente à pas fixe dans la publication princeps
(« cannot be grounded »). C'est cohérent avec la consigne du prompt (« flag any figure you cannot
ground ») et donc plutôt un signe de bonne discipline de la part d'OE sur ces deux lignes — mais cela
laisse deux essais du périmètre demandé (sur 6 essais nommément cités dans le prompt : Treat-to-
Target, AT.LANTUS, INSIGHT, LANMET, PREDICTIVE 303, ATLAS) sans aucune règle de descente exploitable,
même en admettant tout le reste du retour comme exact.

### 3.5 — Sévérité MOYENNE : la sous-question posée (protocole) n'est pas une donnée d'efficacité

Le retour décrit des règles de protocole (« on réduit de X unités si... »), pas des résultats
d'essai comparant cette règle à une autre. Aucun NNT/NNH, taux absolu ou GRADE n'est donné **pour la
règle de descente elle-même** — ce qui est normal au regard de la sous-question posée (elle demande
la règle, pas son effet), mais signifie que rien dans ce bloc ne permet de dire qu'un seuil de
descente donné est *meilleur* qu'un autre en termes d'hypoglycémie évitée. À garder à l'esprit si le
référent souhaite, au-delà de la règle, une justification de son bien-fondé clinique.

### 3.6 — Sévérité BASSE : essais du périmètre du prompt absents de ce qui a été récupéré ici

Le prompt OE-A2 nommait aussi **PREDICTIVE 303** (couvert), mais la sous-liste « toute comparaison
tête-à-tête » n'apparaît que plus loin dans le retour (§ Part 3, méta-analyse Boonpattharatthiti
2025) sans figurer dans la table de descente elle-même — la comparaison tête-à-tête entre règles de
descente spécifiquement n'est pas traitée, seulement une comparaison globale d'approches de
titration (auto- vs médecin-gérée). Pas bloquant pour ce livrable, mais à signaler si l'Agent B
cherche à raccrocher un essai à cette méta-analyse pour la question de la descente.

## 4. Synthèse pour l'Agent B

Sur les 11 lignes de la table maîtresse (6 essais nommés par le prompt + 5 essais additionnels que
OE a ajoutés de sa propre initiative), **aucune ne peut être transmise en l'état comme une donnée
fiable** :
- 2 lignes (INSIGHT, LANMET) sont explicitement non ancrées par OE lui-même — statut honnête, rien à
  red-teamer sur le chiffre puisqu'il n'y en a pas, seulement à confirmer que la source primaire ne
  publie effectivement rien.
- 1 ligne (ATLAS) a un déclencheur complet et lisible (≤56 mg/dL) mais avec un montant
  délibérément non fixé par le protocole — à confirmer contre Garg 2015 directement, PMID donné par
  OE (25297660) et DOI cohérent, ceci-dit non vérifiés indépendamment ici.
- 8 lignes restantes portent un seuil et/ou une référence tronqués ou incohérents à l'intérieur même
  du document — **aucun chiffre de ces 8 lignes ne doit être considéré comme acquis** avant relecture
  directe des sources primaires par l'Agent B (Treat-to-Target/Riddle 2003, AT.LANTUS/Davies-Fritsche
  2005+sous-analyses, PREDICTIVE 303/Meneghini 2007, EDITION 3/Bolli 2015, TAKE CONTROL/Russell-Jones
  2019, SENIOR/Ritzel 2018, Home 2015).

Priorité suggérée pour la relecture de l'Agent B : lever d'abord la contradiction PMID sur
AT.LANTUS (§3.3, bloque toute réutilisation de cet essai dans les deux passes OE) et confirmer les
seuils tronqués des essais explicitement nommés par le prompt (Treat-to-Target, PREDICTIVE 303)
avant les cinq essais ajoutés par OE de sa propre initiative.
