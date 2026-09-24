# OE — Passe A — Première lecture du bloc OE-A2

**Nœud** : `insuline` (DT2) · **Bloc source** : OE-A2 — « Titration de la basale sur glycémie à
jeun capillaire : monter **et** descendre » · **Prompt posé** :
`epreuve/entrees/PROMPTS-OE-passeA.md` (§ OE-A2, lignes 49-77) · **Retour brut** :
`epreuve/entrees/OE-passeA-brut-2026-07-29.txt` (bloc OE-A2 ≈ lignes 203-398, entre la fin des
références d'OE-A1 et le début d'OE-A3/SMBG).

**Statut** : lecture 1 (Agent A², préparation de l'étape 2). Aucune requête OpenEvidence n'a été
posée pour produire ce document — travail de lecture seule sur l'archive fournie. Aucun accès
source primaire n'a été tenté ici : c'est le rôle d'Agent B (`recherche-preuve-triangulee` étape 2).
Ce document est **provisoire** (§ « Après OE » de `PROMPTS-OE-passeA.md`) et n'entre dans
`content/**` sous aucune forme.

---

## 1. Table des règles de réduction de dose telles que rendues par OE

Colonne « Lisibilité » = ce qui est réellement récupérable dans le texte capturé, pas ce qu'on
suppose que l'essai contient. Voir §2 pour l'explication de la corruption du texte.

| Essai | Déclencheur de la réduction | Montant de la réduction | Réf. (numérotation OE-A2) | Lisibilité dans le retour brut |
|---|---|---|---|---|
| **Treat-to-Target** (Riddle 2003) | Corps du texte : « no dose increase was made if any plasma glucose was **[5][4]** » (valeur coupée). Tableau de synthèse Q1 : « Any PG » (non chiffré) | Corps du texte : non énoncé (ne décrit qu'un *hold*, pas une réduction). Tableau de synthèse Q1 : « Fixed units (−2 to −4 U) » | [1],[2] / [1],[2] (Q1) | **Faible** — le seuil est illisible partout ; le montant n'apparaît que dans le tableau de synthèse, absent du corps du texte, sur une ligne au contenu potentiellement différent (voir §3a) |
| **AT.LANTUS — bras « Fritsche » / médecin** | Tableau intra-essai : ligne implicite sous « 90–110 (5,0–6,1) : No change » — seuil bas non écrit explicitement | **−2 U** (lisible, table intra-essai et tableau Q1) | [3] | **Moyenne** — montant lisible, seuil numérique déduit de la position dans le tableau, jamais énoncé en toutes lettres |
| **AT.LANTUS — bras « Davies » / patient** | Non atteint dans le corps du texte : la phrase s'arrête à « in the absence of BG **[6][3]** » avant de décrire toute condition de réduction | **−2 U** — n'apparaît que dans le tableau de synthèse Q1, jamais dans le corps du texte consacré à ce bras | [3] (Q1 uniquement) | **Faible** — le chiffre du tableau de synthèse n'est confirmé nulle part dans le paragraphe narratif dédié à ce bras |
| **INSIGHT** (Gerstein 2006) | — | « **Not explicitly published** in primary document » / « cannot be grounded » — OE l'écrit explicitement en toutes lettres, à deux reprises (corps du texte + tableau Q1) | [4] | **Haute** (pour l'absence de règle) — c'est la seule ligne du tableau qui est une lecture propre plutôt qu'un artefact de troncature |
| **LANMET** (Yki-Järvinen 2006) | — | Idem INSIGHT : « **A specific down-titration step cannot be grounded in the primary LANMET publication** » | [5] | **Haute** (pour l'absence de règle) |
| **PREDICTIVE 303** (Meneghini 2007) | « reduce by 3 U if mean aFPG **[10]** » (seuil coupé) ; tableau intra-essai : ligne implicite sous « 80–110 (4,4–6,1) : No change » | **−3 U**, qualifié « Explicitly defined » par OE | [6] | **Moyenne** — montant et le mot « explicitly defined » sont lisibles, seuil numérique absent du texte capturé |
| **ATLAS** (Garg 2015) | **≤ 56 mg/dL (≤ 3,1 mmol/L)** — seule ligne entièrement chiffrée et complète | « At physician's discretion (**no fixed unit decrement specified in the protocol**) » | [7] | **Haute** — phrase complète, cohérente entre corps du texte et tableau Q1 |
| **EDITION 3** (Bolli 2015, Gla-300) | Corps du texte : « +3 U if SMPG >5,6 and **[13]** » — phrase coupée avant toute mention de réduction. Tableau Q1 : « SMPG 60– » (borne coupée) | Tableau Q1 uniquement : **−3 U** | [8] | **Très faible** — aucune règle de réduction n'est même amorcée dans le corps du texte ; le chiffre ne vient que du tableau de synthèse |
| **TAKE CONTROL** (Russell-Jones 2019, Gla-300) | « −3 U if SMPG **[1][14]** » (seuil coupé) | **−3 U** | [7] (Q1) | **Moyenne** — montant lisible, seuil absent |
| **SENIOR** (Ritzel 2018, ≥ 65 ans) | « −3 U if SMPG **[1]** » (seuil coupé) | **−3 U** | [7] (Q1) | **Moyenne** — montant lisible, seuil absent ; c'est pourtant le seul essai à population âgée dédiée du lot |
| **Home 2015** (algorithme « hypo-sensible ») | « −2 U if any measurement **[16]** » puis tableau Q1 : « Any measurement −2 U; if **[9]** » — laisse deviner un **second palier** de réduction jamais restitué | **−2 U** pour le premier palier ; second palier illisible | [9] | **Faible** — la structure même de la règle (paliers multiples) est incomplète, pas seulement un chiffre |

**Repère de synthèse donné par OE lui-même** (tableau Q1, texte de clôture de la question 1) :
« Down-titration rules are **heterogeneous and often incompletely reported**. […] Most trials use
fixed-unit reductions (−2 to −3 U), not percentage-based reductions. The AACE 2022–2026 guidelines
recommend a **percentage-based** approach: reduce by 10–20% for FBG **[valeur coupée][17][18]** » —
même la seule règle *en pourcentage* mentionnée (hors essais, de recommandation) a son seuil
tronqué dans l'archive.

---

## 2. Ce qui empêche de s'y fier — avant transmission à l'agent B

### 2a. Corruption systématique du texte capturé (le problème dominant)

Le fichier brut n'est pas un export propre : partout où un tableau ou une valeur numérique
devrait apparaître, le texte s'arrête net sur un appel de référence (`[5][4]`, `[10]`, `[1][14]`,
`[13]`…) ou sur une borne incomplète (« SMPG 60– », « 140– », « 90–110 → No change → — »). Des
légendes de figures (« Figure 2 », « Figure 3 », titres d'articles tiers non liés à OE-A2) sont
intercalées **au milieu** de phrases et de tableaux — signe d'un scraping d'une page web à mise en
page dynamique (tableaux HTML, images flottantes) plutôt que d'un export texte structuré. Cf.
lignes 205-217, 230-232, 246, 258, 274, 286, 296, 303, 312, 322-323, 331 du fichier brut.

**Conséquence directe pour la table du §1** : pour toutes les lignes marquées « seuil coupé », on
ne peut **pas** conclure qu'OpenEvidence n'avait pas la valeur — seulement que l'archive telle que
sauvegardée ne la restitue pas. C'est une différence importante avec INSIGHT/LANMET, où
l'absence de règle est **une phrase complète et volontaire d'OE** (« cannot be grounded »), donc une
lecture fiable au sens propre. Il faut donc distinguer dans le rapport à l'agent B :
- **« NON VÉRIFIABLE — capture tronquée »** (Treat-to-Target, AT.LANTUS-Davies, EDITION 3, TAKE
  CONTROL, SENIOR, Home 2015, PREDICTIVE 303 pour le seuil, AT.LANTUS-Fritsche pour le seuil, la
  règle AACE en %) : à retenter en priorité en repassant le prompt, ou en accédant directement aux
  publications primaires (AT.LANTUS, PREDICTIVE 303, EDITION 3, SENIOR, Take Control) plutôt qu'en
  acceptant l'absence comme un résultat.
- **« NON PUBLIÉ — dit explicitement par OE »** (INSIGHT, LANMET) : lecture fiable en l'état, mais
  à confirmer quand même sur la source primaire par principe (discipline du skill), car OE reste un
  débroussaillage jamais une source primaire.
- **« RÈGLE COMPLÈTE »** (ATLAS uniquement) : seule ligne du tableau qui n'a besoin que d'une
  vérification PMID/DOI standard, pas d'une reconstruction de valeur manquante.

### 2b. Contradiction interne sur la référence primaire d'AT.LANTUS, entre OE-A1 et OE-A2

Le même retour brut, dans sa réponse à OE-A1 (ligne 55-60), attribue l'essai AT.LANTUS « original »
à *Fritsche et al., 2003* avec **PMID 14578243, Diabetes Care 2003**. Or, dans sa réponse à OE-A2
(ligne 223-225), le même AT.LANTUS est donné comme *Davies et al., 2005* avec **PMID 16306275,
Diabetes Res Clin Pract 2005** — un PMID, une année et même une revue différents pour ce qui est
présenté comme le même essai princeps. Les deux réponses s'accordent en revanche sur le PMID
17593236 (Diabetes Obes Metab 2007) pour la sous-analyse. Par ailleurs, la citation donnée dans la
liste de références d'OE-A2 pour *Treat-to-Target* (Riddle, Diabetes Care 2003;26(11):3080-6,
doi:10.2337/diacare.26.11.3080) correspond, à volume/pages/DOI près, à la citation que la
littérature attribue habituellement au PMID 14578243 — c'est-à-dire au PMID qu'OE-A1 assigne par
ailleurs à « Fritsche/AT.LANTUS ». **Trois PMID distincts flottent donc autour de deux essais
différents (AT.LANTUS princeps et Treat-to-Target) dans le même document.** C'est exactement le
type d'erreur que le précédent des nœuds H et E avait démontré (« la totalité des PMID rendus par
OE étaient faux », rappelé dans `PROMPTS-OE-passeA.md` en tête de fichier) : à vérifier en priorité
par l'agent B avant toute citation dans un dossier de preuve, puisque AT.LANTUS porte à lui seul
deux des dix lignes de la table du §1.

### 2c. Incohérence entre le corps du texte et le tableau de synthèse, pour Treat-to-Target

Le paragraphe narratif dédié à Treat-to-Target décrit une règle de **non-augmentation** (« no dose
increase was made if... ») — un *hold*, pas une réduction de dose — puis s'interrompt avant de dire
si une vraie réduction existe. Le tableau de synthèse de la question 1, lui, affirme sans détour
« Any PG → Fixed units (−2 à −4 U) », comme s'il s'agissait d'une règle de réduction confirmée. Rien
dans le corps du texte ne vient étayer ce chiffre : soit il provient d'une partie du tableau
intra-essai qui a été perdue à la capture (cf. §2a), soit le tableau de synthèse généralise/reformule
au-delà de ce que documente le paragraphe dédié. Impossible de trancher sans rouvrir Riddle 2003 —
à signaler tel quel à l'agent B plutôt qu'à choisir l'une des deux versions.

### 2d. Rien de ce qui est chiffré ici n'est un critère dur

Toutes les lignes du tableau §1, sans exception, portent sur des essais dont le critère de
jugement est un substitut (HbA1c, glycémie à jeun, taux d'hypoglycémie symptomatique) — OE le
répète explicitement en fin de section (« None was powered for or reported cardiovascular events,
mortality, or microvascular endpoints »). Les règles de réduction elles-mêmes ne sont donc validées,
au mieux, que par leur effet sur l'hypoglycémie symptomatique documentée dans le bras qui les
applique — jamais par un essai qui aurait comparé « règle de réduction X » vs « règle de réduction Y »
sur un critère dur. Cela ne rend pas la table inutilisable, mais borne ce qu'un futur nœud pourra en
dire (argumentaire prudent, pas une affirmation d'efficacité).

### 2e. Un seul essai dédié au sujet âgé/fragile, et sa règle de réduction est elle-même illisible

SENIOR est le seul essai du lot à cibler explicitement les patients ≥ 65 ans (~20 % ≥ 75 ans) — sa
cible de GAJ plus haute (90-130 vs 80-100/110 ailleurs) est lisible et cohérente, mais son propre
seuil de réduction de dose (« −3 U if SMPG **[1]** ») tombe exactement dans la même corruption que
le reste. C'est un point sensible pour la sous-question 3 du prompt OE-A2 (titration ralentie chez
le sujet âgé/fragile) : la seule donnée un peu spécifique disponible est justement celle qu'on ne
peut pas lire dans ce document.

### 2f. Ce qui, à l'inverse, tient déjà (pour ne pas tout jeter avant le red-team)

- La discipline « signaler plutôt qu'inventer » demandée dans le prompt est visiblement respectée
  par OE à trois reprises non ambiguës : INSIGHT, LANMET (absence de règle) et Home 2015 (« PMID:
  not retrieved directly »).
- ATLAS fournit une règle complète et interne cohérente (corps du texte = tableau de synthèse).
- Le tableau de synthèse Q1 fournit lui-même son propre bilan de fiabilité (« heterogeneous and
  often incompletely reported ») — OE ne présente pas ces règles comme uniformément solides, ce qui
  limite le risque de survendre la table au référent.

---

## 3. Pour mémoire — questions 2 et 3 du bloc OE-A2 (hors table de réduction, non retravaillées ici)

À transmettre telles quelles à l'agent B, sans lecture approfondie de notre part à ce stade :

- **Q2 (seuil plafond)** : le repère 0,5 U/kg/j est rattaché par OE à une analyse **post-hoc**
  (Umpierrez 2019, poolée sur 12 ECR) et non à un essai prospectif dédié — GRADE très bas explicitement
  donné par OE (⊕◯◯◯). Aucun ECR n'a randomisé « arrêt à 0,5 U/kg » vs « poursuite ».
- **Q3 (sujet âgé/fragile)** : OE conclut qu'aucun ECR n'a testé prospectivement un palier plus lent,
  un intervalle plus long ou une cible plus haute chez les ≥ 75 ans/fragiles — tout relève, selon OE,
  du consensus d'experts (ADA 2026, Endocrine Society 2019, notice FDA glargine, position ADA 2025 de
  Bolli et al. proposant ≤ 2 U/semaine et cible 100-120 mg/dL). Cohérent avec le constat du §2e :
  SENIOR est cité comme la seule extrapolation par sous-groupe, pas comme un essai dédié à la question.
- Une méta-analyse en réseau (Boonpattharatthiti et al., Diabetes Care 2025) est citée en clôture
  pour comparer les stratégies de titration entre elles (auto-titration ≥ 2×/semaine avec soutien
  professionnel = meilleure réduction d'HbA1c, sans sur-risque d'hypoglycémie sévère) — à vérifier
  également, non exploitée ici.

---

## 4. Recommandation avant l'étape 2 (agent B)

1. Transmettre ce document **avec** le fichier brut complet (pas seulement la table) — la table seule
   masquerait la différence entre « OE dit qu'il n'y a pas de règle » et « le texte capturé a perdu le
   chiffre ».
2. Prioriser la vérification par l'agent B dans cet ordre : (a) le nœud PMID d'AT.LANTUS/Treat-to-Target
   (§2b) — risque de citation croisée fausse, l'historique H/E incite à la prudence maximale ; (b) les
   seuils manquants pour AT.LANTUS, PREDICTIVE 303, EDITION 3, TAKE CONTROL, SENIOR — en rouvrant les
   publications primaires plutôt qu'en retentant OE, puisqu'un deuxième passage OE ne réparera pas une
   perte de capture qui est probablement un artefact de sauvegarde, pas un artefact du modèle ; (c)
   Treat-to-Target : trancher entre la version « hold » du corps du texte et la version « −2 à −4 U »
   du tableau de synthèse (§2c).
3. Ne rien encoder dans `content/**` à partir de cette table tant que (a) et (c) ne sont pas levés —
   ce sont les deux seuls points de la question 1 à statut réellement décisionnel pour un nœud qui
   doit encoder une règle de descente utilisable en pratique.
