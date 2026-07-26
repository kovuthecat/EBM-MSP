# Vignettes existantes à valider — nœuds `prescription` et `cible-glycémique`

Document de relecture clinique. Chaque vignette du banc de tests **écrit par des agents, jamais relu par
un médecin**, est ici traduite en langage clinique, avec ce qu'elle verrouille et les points d'attention.
Le référent répond par numéro (« P-12 faux, A-04 ok »).

**Périmètre** : `src/features/decision/engine/evaluateNode.prescription.test.ts` (nœud `prescription`,
37 vignettes → **P-01 à P-37**) et `evaluateNode.test.ts` (nœud `cible-glycemique`, 13 vignettes →
**A-01 à A-13**). **Exclus** : `evaluateNode.p2.test.ts` et `evaluateNode.indetermine.test.ts` — ils
utilisent des nœuds synthétiques et testent le moteur générique, jamais un contenu clinique ; c'est le
découpage voulu du projet (le moteur ne connaît aucun nœud par son nom), rien n'en a été extrait ici.

## Comment lire ce document

- **Profil** : le patient en langage clinique. Les valeurs explicitement fixées par la vignette sont
  décrites d'abord ; les valeurs **non précisées par la vignette** (héritées d'un profil « par défaut »
  du banc de tests) sont listées à part quand elles pèsent sur l'interprétation.
- **Sortie vérifiée par le test** : uniquement ce que les lignes `expect(...)` contrôlent réellement —
  jamais ce que le contenu laisse par ailleurs deviner. Une vignette qui ne vérifie qu'une partie d'un
  résultat plus large ne verrouille QUE cette partie.
- **Ce que la vignette verrouille** : une phrase, le comportement qu'une régression future ferait échouer.
- **Drapeau** : présent uniquement si un des trois cas de la mission s'applique.

### Trois précisions techniques valables pour tout le document (pour ne pas les répéter 50 fois)

1. **Les tests du nœud `prescription` partent d'un profil « de base » commun** (`BASE`,
   `evaluateNode.prescription.test.ts:21-49`) que chaque vignette modifie par surcharge (`o = {...}`).
   Tout champ non cité dans la surcharge d'une vignette garde la valeur de `BASE` : DFG 80 (normal),
   IMC 27, âge 60, pas d'ASCVD, pas d'insuffisance cardiaque, normoalbuminurie, non fragile, espérance de
   vie « longue », risque hypoglycémique « faible », pas de dénutrition, pas d'infections urinaires
   récidivantes, pas d'intolérance, préférence vis-à-vis de l'injectable « indifférente », classes
   protectrices non déclarées indisponibles. Ces valeurs par défaut sont signalées ci-dessous **quand
   elles pèsent sur la lecture clinique du profil**, pas systématiquement (sinon chaque entrée listerait
   26 champs).
2. **Six critères du nœud `prescription` sont calculés, jamais saisis** : `hba1c_sous_cible`,
   `cible_atteinte`, `terrain_fragile`, `palette_glycemique_ouverte`, `remplacement_agent_sans_benefice`,
   `metformine_deprescriptible`. Le banc de tests recalcule systématiquement ces six champs à partir des
   critères bruts (`calculerCriteresDerives`, `evaluateNode.prescription.test.ts:54`) : une valeur que la
   vignette leur donnerait « à la main » dans sa surcharge est **sans effet, toujours écrasée**. C'est le
   cas de quelques vignettes (ex. P-08) qui fixent `hba1c_sous_cible` explicitement alors que cette valeur
   est de toute façon recalculée depuis l'HbA1c saisie — sans conséquence ici (les deux s'accordent), mais
   à ne pas lire comme une saisie réelle.
3. **Aucune des 50 vignettes ne teste un formulaire partiellement rempli** (toutes fournissent un profil
   complet) : la logique « valeur indéterminée » (D20, `enAttente`) n'est donc exercée par **aucune**
   vignette de ce document — elle est couverte ailleurs, par le banc de caractérisation et les invariants
   I3-I7 (`docs/decision/validation/chantier-2026-07-26/ETAT-DES-LIEUX.md`), volontairement séparés des
   vignettes (les « trois couches » de `GRAMMAIRE-NOEUD.md`). De même, **aucune vignette ne vérifie de
   badge** (« Recommandée » / « Recommandation officielle (France) », `optionBadges.ts`) : les 50 tests
   n'appellent jamais `computeBadges`, ils ne contrôlent que la présence/l'ordre/l'exclusion des options et
   le texte des alertes.

---

# Nœud A — « Fixer la cible d'HbA1c » (`cible-glycemique`)

Nœud **ordered-first-match** (une seule cible retenue par patient), **`statut: valide`** (contrairement à
`prescription`, encore en brouillon). 4 bandes, évaluées dans cet ordre : `Cible < 9 %` (la plus relâchée)
→ `Cible ≤ 8 %` → `Cible ~6,5 % (6,5–7 %)` (la plus stricte) → `Cible ≤ 7 %` (repli). Toutes les vignettes
partent d'un profil par défaut commun (`criteria()`, `evaluateNode.test.ts:27-38`) : 60 ans, diabète depuis
8 ans, espérance de vie « intermédiaire », non fragile, risque hypoglycémique « faible », pas d'antécédent
cardiovasculaire, pas de comorbidité grave — un profil médian, plausible, sans excès.

### A-01 — `evaluateNode.test.ts:45-50`

**Profil** : deux patients passés côte à côte — (1) le profil par défaut (60 ans, diabète 8 ans, EV
intermédiaire, non fragile, hypo faible, sans antécédent CV ni comorbidité grave) ; (2) le même mais
fragile et à espérance de vie limitée.

**Sortie vérifiée** : dans les deux cas, **exactement une** cible est retenue (`applicable` de longueur 1).
La vignette ne dit PAS laquelle.

**Ce que la vignette verrouille** : le nœud ne doit jamais renvoyer ni zéro cible (écran muet) ni deux
cibles à la fois (contradiction), quel que soit le profil.

**Drapeau — ASSERTION FAIBLE.** Le test ne vérifie qu'un compte (« = 1 »), pas un contenu : un moteur qui
renverrait systématiquement la mauvaise cible, du moment qu'il n'en renvoie qu'une, passerait ce test.
C'est un test structurel légitime (garde-fou d'exclusivité), pas un test de contenu clinique — complété
par les vignettes suivantes qui, elles, fixent la valeur attendue.

### A-02 — `evaluateNode.test.ts:52-54`

**Profil** : 52 ans, diabète depuis 3 ans, espérance de vie longue ; par défaut non fragile, risque
hypoglycémique faible, sans antécédent cardiovasculaire ni comorbidité grave.

**Sortie vérifiée** : cible retenue = **« Cible ~6,5 % (6,5–7 %) »** (la plus stricte).

**Verrouille** : un patient jeune, récemment diagnostiqué, sans facteur de risque, doit recevoir la cible
la plus stricte.

**Drapeau** : aucun.

### A-03 (« A1 ») — `evaluateNode.test.ts:56-58`

**Profil** : 78 ans, diabète depuis 3 ans, espérance de vie déclarée **longue** ; par défaut non fragile,
risque hypoglycémique faible, sans antécédent CV ni comorbidité grave — un profil par ailleurs « parfait »
pour la cible la plus stricte, sauf l'âge.

**Sortie vérifiée** : cible retenue = **« Cible ≤ 7 % »** (le repli), PAS la cible stricte.

**Verrouille** : le verrou d'âge (`age < 70`) doit à lui seul empêcher la cible la plus stricte, même chez
un patient sans aucun autre facteur de prudence.

**Drapeau** : aucun formel, mais un point d'attention — l'espérance de vie « longue » à 78 ans est un choix
de construction du test (isoler l'effet de l'âge seul, sans laisser l'espérance de vie limitée expliquer
le résultat) plutôt qu'un profil « typique ». Le référent doit savoir que ce n'est pas un profil médian
mais un profil construit pour isoler une seule variable.

### A-04 — `evaluateNode.test.ts:60-62`

**Profil** : 68 ans, diabète depuis 8 ans (valeur par défaut, redéclarée sans changement), espérance de
vie intermédiaire (idem) ; non fragile, risque hypoglycémique faible, sans antécédent CV ni comorbidité
grave — profil « du milieu », sans facteur d'assouplissement ni de resserrement.

**Sortie vérifiée** : cible retenue = **« Cible ≤ 7 % »** (repli par défaut).

**Verrouille** : un profil intermédiaire (ni jeune-strict, ni fragile-relâché) doit atterrir sur la cible
par défaut.

**Drapeau** : aucun. Note : `anciennete_diabete_annees: 8` et `esperance_vie: 'intermediaire'` sont
redéclarés dans la surcharge alors qu'ils valent déjà cela par défaut — redondance sans effet, pas une
erreur.

### A-05 (« A2 ») — `evaluateNode.test.ts:64-68`

**Profil** : 64 ans, antécédent cardiovasculaire établi, comorbidité grave, espérance de vie déclarée
**longue** ; par défaut non fragile, risque hypoglycémique faible, diabète depuis 8 ans.

**Sortie vérifiée** : cible retenue = **« Cible ≤ 8 % »**, PAS « ≤ 7 % ».

**Verrouille** : une comorbidité grave doit à elle seule relâcher la cible à ≤ 8 %, même chez un patient à
espérance de vie « longue » et non fragile par ailleurs.

**Drapeau** : aucun formel. Point d'attention — « antécédent cardiovasculaire établi » + « comorbidité
grave » + « espérance de vie longue » est une combinaison en tension clinique (un patient avec une maladie
cardiovasculaire évoluée grave a rarement une espérance de vie qualifiée de « longue »). Par ailleurs,
`antecedent_cv` n'est **pas nécessaire** à la conclusion : la condition qui fait basculer vers « ≤ 8 % » ne
teste que `comorbidite_grave` — retirer `antecedent_cv: true` de la surcharge donnerait le même résultat.
Cette valeur est donc présente dans le profil sans peser sur ce que le test vérifie (voir aussi
« Couverture » : l'effet propre d'`antecedent_cv`, lui, n'est testé nulle part).

### A-06 — `evaluateNode.test.ts:70-72`

**Profil** : profil par défaut (60 ans, diabète 8 ans, EV intermédiaire, hypo faible, sans antécédent CV
ni comorbidité grave) mais **fragile**.

**Sortie vérifiée** : cible retenue = **« Cible ≤ 8 % »**.

**Verrouille** : la fragilité seule, même avec une espérance de vie seulement « intermédiaire » (pas
« limitée »), relâche la cible à ≤ 8 %.

**Drapeau** : aucun.

### A-07 — `evaluateNode.test.ts:74-76`

**Profil** : profil par défaut mais diabète ancien de **15 ans** et schéma à **risque hypoglycémique
élevé**.

**Sortie vérifiée** : cible retenue = **« Cible ≤ 8 % »**.

**Verrouille** : la combinaison ancienneté > 10 ans + risque hypoglycémique élevé, ENSEMBLE, relâche la
cible.

**Drapeau** : aucun. Forme une paire volontaire avec A-08 (même schéma à risque, ancienneté différente).

### A-08 — `evaluateNode.test.ts:78-80`

**Profil** : profil par défaut, diabète depuis **5 ans** (donc < 10 ans), schéma à **risque hypoglycémique
élevé**.

**Sortie vérifiée** : cible retenue = **« Cible ≤ 7 % »** (le repli) — ni ≤ 8 %, ni ~6,5 %.

**Verrouille** : le risque hypoglycémique élevé **seul** (sans ancienneté > 10 ans) ne suffit pas à
relâcher la cible — contre-épreuve directe d'A-07, qui prouve que c'est bien la conjonction des deux qui
compte, pas le risque hypoglycémique isolément.

**Drapeau** : aucun — bon exemple de contre-épreuve (« negative control ») bien construite.

### A-09 — `evaluateNode.test.ts:82-84`

**Profil** : 82 ans, fragile, espérance de vie limitée ; diabète depuis 8 ans (défaut), risque
hypoglycémique faible (défaut), sans antécédent CV ni comorbidité grave (défaut).

**Sortie vérifiée** : cible retenue = **« Cible < 9 % »** (la bande la plus relâchée).

**Verrouille** : fragilité + espérance de vie limitée conduisent à la cible la plus relâchée, évaluée en
priorité dans l'ordre du nœud.

**Drapeau** : aucun. Profil gériatrique plausible.

### A-10 — `evaluateNode.test.ts:86-88`

**Profil** : profil par défaut (60 ans, **non fragile**) mais **comorbidité grave** et **espérance de vie
limitée**.

**Sortie vérifiée** : cible retenue = **« Cible < 9 % »**.

**Verrouille** : comorbidité grave + espérance de vie limitée suffisent à la cible la plus relâchée, **même
sans fragilité déclarée et à un âge non avancé (60 ans)** — la vignette dissocie « fragile » de « grave
comorbidité + espérance de vie limitée » comme deux portes indépendantes vers la même sortie.

**Drapeau** : aucun formel. Point d'attention — un patient de 60 ans, non fragile, avec une comorbidité
grave et une espérance de vie limitée (ex. cancer évolutif) est un profil réel mais peu fréquent ; c'est
un choix d'isolement de variable délibéré (voir A-05, A-03), pas une incohérence de données.

### A-11 — `evaluateNode.test.ts:90-92`

**Profil** : profil par défaut mais **espérance de vie limitée seule** (non fragile, pas de comorbidité
grave).

**Sortie vérifiée** : cible retenue = **« Cible ≤ 8 % »**, PAS « < 9 % ».

**Verrouille** : l'espérance de vie limitée **seule** ne suffit pas pour la bande la plus relâchée — il
faut, en plus, fragilité OU comorbidité grave (contre-épreuve directe d'A-09/A-10, qui complète le trio).

**Drapeau** : aucun — bonne contre-épreuve, complète le triptyque A-09/A-10/A-11.

### A-12 — `evaluateNode.test.ts:94-98`

**Profil** : identique à A-02 (52 ans, diabète 3 ans, EV longue — le patient jeune et récent).

**Sortie vérifiée** : le texte des « raisons » associé à la cible retenue contient la chaîne
`« age < 70 »`.

**Verrouille** : le moteur doit exposer, dans la justification affichée, la condition d'âge effectivement
remplie — c'est un test de la mécanique de traçabilité (« pourquoi cette option »), pas d'une valeur
clinique nouvelle.

**Drapeau — ASSERTION FAIBLE**, et vignette de nature plus **technique que clinique** : elle vérifie qu'un
fragment de texte interne (`"age < 70"`, littéralement le membre de condition du YAML) apparaît dans une
chaîne, ce qui teste le câblage du moteur plutôt qu'un fait médical. Elle réutilise par ailleurs exactement
le profil d'A-02 sans rien ajouter cliniquement.

### A-13 — `evaluateNode.test.ts:100-112`

**Profil** : un jeu de critères **incomplet** — `esperance_vie` est absent (toutes les autres valeurs
présentes : 52 ans, diabète 3 ans, non fragile, hypo faible, sans antécédent CV ni comorbidité grave). Ce
n'est pas un profil patient au sens clinique, c'est un test d'entrée invalide.

**Sortie vérifiée** : l'appel lève une `ConditionError` dont le message mentionne `esperance_vie`.

**Verrouille** : si une variable manque, le moteur doit s'arrêter avec une erreur explicite plutôt que de
calculer silencieusement une réponse fausse — garde-fou générique du moteur (brief §7, « jamais de faux
silencieux »), pas un contenu clinique propre à ce nœud.

**Drapeau** : aucun formel — assertion solide (type d'erreur + message). Signalé comme **technique plutôt
que clinique**, comme A-12 : cette vignette ne verrouille aucun fait médical, elle verrouille un
comportement du moteur (partagé par tous les nœuds).

---

# Nœud « Traiter : initier, optimiser, intensifier » (`prescription`)

Nœud **multi-options**, `statut: brouillon` (version 0.18, jamais validé référent dans son ensemble malgré
plusieurs lots d'arbitrages successifs). 24 options réparties en 6 familles (« À faire d'emblée —
sécurité », « Socle du traitement », « Agent à ajouter » — la seule famille EXCLUSIVE, on n'y retient que
la tête de classement —, « Traitement à corriger ou remplacer », « Traitement à alléger », « Aucun geste —
surveiller »). Sauf mention contraire, le profil de départ de chaque vignette est le profil `BASE` décrit
en introduction (60 ans, DFG 80, IMC 27, pas d'ASCVD ni d'insuffisance cardiaque, normoalbuminurie, non
fragile, EV longue, hypo faible, pas de dénutrition/infection/intolérance, injectable indifférent).

### P-01 (« F1 ») — `evaluateNode.prescription.test.ts:68-74`

**Profil** : 82 ans, fragile, IMC 21 (maigre), maladie cardiovasculaire athéromateuse établie, schéma à
risque hypoglycémique élevé, déjà sous metformine + sulfamide, HbA1c actuelle 7,8 %. Non précisé : intention
« optimiser » (défaut), à l'objectif (défaut), DFG 80, pas d'insuffisance cardiaque, **pas de dénutrition
déclarée** malgré un patient âgé fragile et maigre — proche du seuil sans y être formellement.

**Sortie vérifiée** : l'option « Introduire un AR GLP-1 » n'apparaît PAS parmi les options retenues, mais
apparaît dans les options **écartées** (motif IMC < 22) ; l'option tirzépatide n'apparaît pas non plus
parmi les retenues.

**Verrouille** : chez un patient âgé fragile et maigre en ASCVD, le garde-fou de terrain (IMC < 22) doit
retirer l'AR GLP-1 de la liste proposée — et le faire apparaître comme *écarté avec motif*, pas simplement
absent, même si l'indication cardiovasculaire serait par ailleurs favorable.

**Drapeau** : aucun — bonne vignette, elle distingue « écarté pour sécurité » de « jamais évalué ».

### P-02 (« F2 ») — `evaluateNode.prescription.test.ts:76-84`

**Profil** : 78 ans, IMC 34 (obèse), mais **dénutri**, fragile, maladie cardiovasculaire athéromateuse
établie, sous metformine seule, intention « intensifier », au-dessus de l'objectif, HbA1c 8 %. Non précisé :
espérance de vie « longue » (défaut) malgré 78 ans + fragile + dénutri — combinaison à noter mais qui ne
pèse sur aucune règle testée ici.

**Sortie vérifiée** : ni l'AR GLP-1 ni le tirzépatide n'apparaissent parmi les retenues ; les deux
apparaissent parmi les écartées (motif dénutrition).

**Verrouille** : la dénutrition exclut les incrétines **même chez un patient obèse** — le signal pertinent
est l'état nutritionnel, pas la seule corpulence (« dénutrition ≠ IMC », titre du test).

**Drapeau** : aucun.

### P-03 (« F3 ») — `evaluateNode.prescription.test.ts:86-106`

**Profil** : 74 ans, fragile, IMC 27 (surpoids simple, ni maigre ni obèse), maladie cardiovasculaire
athéromateuse établie, sous metformine, intention « intensifier », au-dessus de l'objectif, HbA1c 8 %.

**Sortie vérifiée** : l'AR GLP-1 apparaît parmi les retenues, **avant** l'iSGLT2 dans l'ordre d'affichage ;
de plus, l'alerte de surveillance nutritionnelle (« sujet fragile... incrétine ») est bien rattachée à la
**carte de l'option** AR GLP-1 elle-même (pas à une alerte générale de nœud).

**Verrouille** : chez un patient fragile pour qui l'incrétine est réellement proposée (pas exclue par
IMC/dénutrition), l'alerte de surveillance doit rester rattachée à la carte, pas disparaître avec le
découpage de l'alerte fragilité (correctif du 2026-07-25, `DECISIONS.md`).

**Drapeau** : aucun — vignette de régression bien ciblée, avec un commentaire de code qui explique
précisément le déplacement d'assertion.

### P-04 (« P1 ») — `evaluateNode.prescription.test.ts:109-116`

**Profil** : profil par défaut (60 ans, DFG 80, pas de fragilité ni de dénutrition) mais avec maladie
cardiovasculaire athéromateuse établie, IMC 26, sous metformine, intention « intensifier », au-dessus de
l'objectif, HbA1c 8,2 %.

**Sortie vérifiée** : l'AR GLP-1 apparaît, avant l'iSGLT2 ; le tirzépatide n'apparaît pas (IMC < 30).

**Verrouille** : en athérome pur (sans indication cardio-rénale), l'AR GLP-1 doit passer devant l'iSGLT2 —
le correctif de préférence de classe (« fix bug 9 » du titre de la suite de tests).

**Drapeau** : aucun.

### P-05 (« P2 ») — `evaluateNode.prescription.test.ts:118-131`

**Profil** : insuffisance cardiaque, DFG 50 (insuffisance rénale modérée), micro-albuminurie, IMC 28,
sous metformine, intention « intensifier », au-dessus de l'objectif, HbA1c 7,8 %. Pas de maladie
cardiovasculaire athéromateuse établie (défaut).

**Sortie vérifiée** : iSGLT2 ET AR GLP-1 apparaissent tous deux, l'iSGLT2 **avant** l'AR GLP-1 ; le
tirzépatide n'apparaît pas (IMC < 30).

**Verrouille** : en indication cardio-rénale (IC + DFG réduit + micro-albuminurie), sans obésité, l'iSGLT2
doit passer devant l'AR GLP-1 **même** quand ce dernier redevient disponible comme simple levier
glycémique parce que l'objectif n'est pas atteint.

**Drapeau** : aucun.

### P-06 (« T1 ») — `evaluateNode.prescription.test.ts:133-138`

**Profil** : maladie cardiovasculaire athéromateuse établie, IMC 24 (poids normal, plutôt maigre), sous
metformine, intention « intensifier », au-dessus de l'objectif, HbA1c 8 %.

**Sortie vérifiée** : le tirzépatide n'apparaît pas ; l'AR GLP-1 apparaît.

**Verrouille** : le tirzépatide reste réservé à l'obésité (IMC ≥ 30) même chez un patient dont l'indication
cardiovasculaire favoriserait par ailleurs un incrétine.

**Drapeau** : aucun sur l'ensemble, mais la moitié « tirzépatide absent » n'est vérifiée que par
son absence des retenues (pas via les écartées) — une suppression totale et non voulue de l'option
tirzépatide du contenu passerait ce test tout aussi bien qu'un comportement correct. Signalé comme point
de vigilance mineur, pas comme un drapeau formel (la vignette contient par ailleurs une assertion positive
solide sur l'AR GLP-1).

### P-07 (« T2 ») — `evaluateNode.prescription.test.ts:140-153`

**Profil** : obèse (IMC 33), fonction rénale normale (DFG 90), sous metformine, intention « intensifier »,
au-dessus de l'objectif, HbA1c 8 %. Pas de maladie cardiovasculaire ni d'insuffisance cardiaque (défaut).

**Sortie vérifiée** : AR GLP-1, tirzépatide ET iSGLT2 apparaissent tous les trois ; l'AR GLP-1 est classé
avant le tirzépatide ET avant l'iSGLT2.

**Verrouille** : chez l'obèse pur sans comorbidité cardio-rénale ni athéromateuse, l'AR GLP-1 doit rester
devant le tirzépatide ET devant l'iSGLT2 (qui n'entre ici que comme simple levier glycémique de rang bas).

**Drapeau** : aucun.

### P-08 (« D1 ») — `evaluateNode.prescription.test.ts:157-166`

**Profil** : 72 ans, sous metformine + sulfamide, intention « déprescrire », en dessous de l'objectif
(sur-traitement déclaré), HbA1c actuelle **6,2 %**, schéma à risque hypoglycémique élevé.

**Sortie vérifiée** : « Désintensifier » apparaît ; « Remplacer le sulfamide » n'apparaît PAS.

**Verrouille** : un sur-traitement caractérisé (HbA1c < 6,5 %) sous sulfamide doit conduire à
l'allègement, jamais à un switch vers une classe protectrice.

**Drapeau** : aucun. Note technique (cf. précision n°2 en tête de document) : la surcharge fixe aussi
`hba1c_sous_cible: true` à la main — sans effet, ce champ est de toute façon recalculé depuis l'HbA1c
saisie (6,2 % < 6,5 %), et les deux s'accordent ici.

### P-09 (« D1b ») — `evaluateNode.prescription.test.ts:168-173`

**Profil** : 55 ans, **non fragile**, sous metformine + sulfamide, intention « déprescrire », en dessous
de l'objectif, HbA1c 6,0 %, schéma à risque hypoglycémique élevé.

**Sortie vérifiée** : « Désintensifier » apparaît.

**Verrouille** : le sur-traitement (HbA1c < 6,5 %) déclenche la désintensification même chez un sujet
jeune et non fragile — forme une paire volontaire avec P-08 pour prouver que le seuil est absolu, pas
réservé à l'âgé (« gel D2 » cité dans le titre du test).

**Drapeau** : aucun.

### P-10 (« D2 ») — `evaluateNode.prescription.test.ts:175-183`

**Profil** : 64 ans, sous metformine + sulfamide, intention « intensifier », au-dessus de l'objectif,
maladie cardiovasculaire athéromateuse établie, IMC 29, schéma à risque hypoglycémique élevé, HbA1c 7,8 %.

**Sortie vérifiée** : « Remplacer le sulfamide » apparaît ; « Désintensifier » n'apparaît PAS ; l'AR GLP-1
est classé avant l'iSGLT2.

**Verrouille** : sulfamide + au-dessus de la cible + athérome établi doit déclencher un switch protecteur
(pas une désintensification), orienté par l'athérome (AR GLP-1 devant iSGLT2).

**Drapeau** : aucun.

### P-11 (« D4 ») — `evaluateNode.prescription.test.ts:185-201`

**Profil** : sous metformine + **gliptine**, intention « intensifier », au-dessus de l'objectif, IMC 31
(obèse), HbA1c 7,5 %. Pas d'ASCVD ni d'insuffisance cardiaque déclarées (défaut).

**Sortie vérifiée** : « Remplacer la gliptine » apparaît ; l'AR GLP-1 apparaît (destination du switch, par
l'indication obésité) ; le tirzépatide n'apparaît PAS.

**Verrouille** : après la levée du verrou gliptine (2026-07-25), le switch de la gliptine doit trouver un
remplaçant applicable (ici l'AR GLP-1) — le tirzépatide, lui, reste verrouillé (son option exige toujours
l'absence de gliptine en cours), donc toujours absent chez un patient sous gliptine.

**Verrou historique** : cette vignette protège contre le défaut d'origine documenté dans `DECISIONS.md`
D19 (patient sous gliptine à qui on ajoutait un protecteur sans jamais statuer sur la gliptine elle-même).
Voir aussi P-33, le profil qui a révélé ce défaut.

**Drapeau** : aucun.

### P-12 (« D5 ») — `evaluateNode.prescription.test.ts:203-207`

**Profil** : patient déjà sous metformine + **gliptine ET AR GLP-1 simultanément** (association jamais
recommandée, mais ici déjà en place), intention « intensifier », au-dessus de l'objectif, HbA1c 7,5 %.

**Sortie vérifiée** : « Arrêter la gliptine redondante » apparaît.

**Verrouille** : si un patient arrive déjà sous l'association interdite gliptine + incrétine, l'outil doit
détecter la redondance et proposer l'arrêt de la gliptine — pas seulement empêcher une future association.

**Drapeau** : aucun. Précision utile pour le référent : ce profil (gliptine + AR GLP-1 en même temps) est
délibérément un cas d'erreur déjà commise (« patient adressé déjà sous les deux », texte de l'option
elle-même) — ce n'est pas une donnée aberrante, c'est le scénario que l'option est censée rattraper.

### P-13 (« I1 ») — `evaluateNode.prescription.test.ts:211-216`

**Profil** : sous metformine + AR GLP-1, intolérance déclarée de nature **digestive**, intention
« optimiser », maladie cardiovasculaire athéromateuse établie, IMC 28, HbA1c 7 %.

**Sortie vérifiée** : l'option « Optimiser l'agent mal toléré » apparaît ; une alerte mentionnant
« METFORMINE » se déclenche.

**Verrouille** : une intolérance digestive chez un patient sous metformine + incrétine doit à la fois
ouvrir l'option de gestion et orienter vers la METFORMINE en priorité (l'agent au bénéfice le plus faible),
pas vers l'incrétine.

**Drapeau** : aucun.

### P-14 (« S1 ») — `evaluateNode.prescription.test.ts:218-223`

**Profil** : sous metformine + sulfamide, **DFG 25** (insuffisance rénale sévère), intention
« intensifier », au-dessus de l'objectif, HbA1c 8 %.

**Sortie vérifiée** : « Arrêter la metformine » apparaît ; la carte socle « Metformine (socle... —
instaurer ou poursuivre) » apparaît dans les options **écartées**.

**Verrouille** : DFG < 30 doit déclencher l'arrêt de la metformine ET retirer la carte socle « poursuivre »
— pas de contradiction affichée « poursuivre » + « arrêter » sur la même molécule.

**Drapeau** : aucun sur ce qui est vérifié. Le profil comporte aussi un sulfamide, dont le sort (l'option
« Arrêter le sulfamide », symétrique, se déclenche également sous DFG < 30) **n'est pas vérifié** par
cette vignette — voir « Couverture ».

### P-15 (« S2 ») — `evaluateNode.prescription.test.ts:225-231`

**Profil** : sous metformine + sulfamide, **DFG 18** (insuffisance rénale terminale, proche dialyse), IMC
26, intention « intensifier », au-dessus de l'objectif, HbA1c 8 %.

**Sortie vérifiée** : « Arrêter la metformine » apparaît ; l'iSGLT2 apparaît parmi les **écartées** (motif
DFG < 20) ; l'ensemble des options retenues n'est pas vide.

**Verrouille** : en insuffisance rénale sévère (DFG < 20), l'iSGLT2 doit être explicitement écarté (pas
simplement absent), et l'écran ne doit jamais rester muet.

**Drapeau** : aucun sur les deux premières assertions. La troisième (« la liste n'est pas vide ») est une
**assertion faible** en elle-même (elle passerait avec n'importe quel contenu non trivial) — elle protège
contre l'écran muet, rien de plus ; elle ne dit pas CE qui doit s'afficher (par ex. « Arrêter le sulfamide »,
également DFG < 30, n'est pas vérifié ici).

### P-16 (« S3 ») — `evaluateNode.prescription.test.ts:233-238`

**Profil** : sous metformine seule, HbA1c actuelle **11 %**, symptômes de glucotoxicité présents,
cétonémie positive, intention « intensifier », nettement au-dessus de l'objectif.

**Sortie vérifiée** : « Insuline d'initiation » apparaît ; une alerte mentionnant « cétonémie » se
déclenche.

**Verrouille** : un tableau catabolique franc (HbA1c élevée + symptômes de glucotoxicité + cétonémie) doit
déclencher l'insuline d'initiation et l'alerte de sécurité associée.

**Drapeau** : point d'ambiguïté (non un drapeau formel) — la condition de l'option est écrite
« HbA1c_actuelle >= 10 AND symptomes_glucotoxicite == true OR cetonemie == true »
(`prescription.yaml:248`) ; le "ET" prime sur le "OU", donc la cétonémie seule suffirait indépendamment de
l'HbA1c. Ce profil rend les deux branches vraies en même temps : la vignette ne permet pas de savoir
laquelle des deux déclenche réellement le résultat. Voir aussi P-25, profil quasi identique
(« Doublons »).

### P-17 (« I2 ») — `evaluateNode.prescription.test.ts:240-245`

**Profil** : infections génito-urinaires récidivantes, insuffisance cardiaque, sous metformine seule,
intention « intensifier », au-dessus de l'objectif, HbA1c 8 %. L'iSGLT2 est **indiqué** (par l'IC) mais pas
encore prescrit.

**Sortie vérifiée** : une alerte mentionnant « génito » se déclenche.

**Verrouille** : l'alerte infections génito-urinaires doit se déclencher dès que l'iSGLT2 est **indiqué**
par la comorbidité, pas seulement s'il est déjà prescrit (correctif red-team H1).

**Drapeau** : aucun formel. La vérification reste étroite : elle ne contrôle pas si l'iSGLT2 est malgré
tout proposé (rétrogradé), seulement que l'alerte existe — signalé pour information, pas comme faiblesse
disqualifiante (le titre du test annonce explicitement ce périmètre restreint : « l'alerte se déclenche »).

### P-18 (« A8 ») — `evaluateNode.prescription.test.ts:247-251`

**Profil** : sous metformine + sulfamide + **insuline** simultanément, intention « intensifier »,
au-dessus de l'objectif, HbA1c 8 %.

**Sortie vérifiée** : une alerte mentionnant « hypoglycémie cumulée » se déclenche.

**Verrouille** : la combinaison insuline + sulfamide déjà en place doit déclencher une alerte de risque
hypoglycémique cumulé.

**Drapeau** : aucun.

### P-19 (« R1 ») — `evaluateNode.prescription.test.ts:253-261`

**Profil** : maladie cardiovasculaire athéromateuse établie, IMC 26, **refus des injections déclaré**,
sous metformine, intention « intensifier », au-dessus de l'objectif, HbA1c 8 %.

**Sortie vérifiée** : l'AR GLP-1 apparaît toujours (pas exclu), mais classé **après** l'iSGLT2 ; une alerte
« Refus des injections » se déclenche.

**Verrouille** : un refus déclaré des injections ne doit jamais faire disparaître un traitement à bénéfice
démontré — seulement le reléguer derrière une alternative orale, avec une alerte explicative.

**Drapeau** : aucun.

### P-20 (« PC1 ») — `evaluateNode.prescription.test.ts:263-285`

**Profil** : sous metformine + sulfamide, intention « optimiser », **à l'objectif**, 60 ans, HbA1c 6,9 %
(juste au-dessus du seuil de sur-contrôle 6,5 %, donc pas de sur-traitement caractérisé).

**Sortie vérifiée** : en interne, la « palette glycémique » est bien fermée (aucune escalade glycémique
puisque le patient est à l'objectif) tandis que le « remplacement d'agent sans bénéfice » est bien ouvert
(la seule présence du sulfamide suffit) ; à l'écran : « Désintensifier » n'apparaît PAS (6,9 % ≥ 6,5 %,
pas de sur-traitement) ; « Remplacer le sulfamide » apparaît ; l'iSGLT2 apparaît (comme destination du
switch, pas comme ajout glycémique).

**Verrouille** : la vignette distingue explicitement les DEUX mécanismes d'accès à un agent protecteur —
la palette glycémique (fermée ici) et le remplacement d'un agent sans bénéfice (ouvert par la seule
présence du sulfamide) — pour que les deux voies ne se confondent pas dans une future modification.

**Drapeau** : aucun — vignette dense et bien commentée dans le code, avec un historique explicite (elle
a remplacé une attente strictement inverse lors du passage à R3).

### P-21 (« PC2 ») — `evaluateNode.prescription.test.ts:287-294`

**Profil** : obèse (IMC 33), fonction rénale normale (DFG 90), **refus des injections déclaré**, sous
metformine, intention « intensifier », au-dessus de l'objectif, HbA1c 8 %. Pas d'ASCVD ni d'insuffisance
cardiaque (défaut) — la seule indication vers un incrétine est l'obésité.

**Sortie vérifiée** : l'AR GLP-1 ET le tirzépatide apparaissent tous les deux (relégués, mais présents) ;
une alerte « Refus des injections » se déclenche.

**Verrouille** : en l'absence de toute alternative orale à bénéfice démontré (obésité seule, sans
ASCVD/IC/rein), le refus d'injection ne doit PAS supprimer les incrétines — relégation seulement, jamais
de cul-de-sac thérapeutique (souligné par le titre du test lui-même).

**Drapeau** : aucun.

### P-22 (« M1 ») — `evaluateNode.prescription.test.ts:296-305`

**Profil** : classes protectrices (iSGLT2 et AR GLP-1) déclarées **toutes deux inutilisables**, DFG 40
(insuffisance rénale modérée), maladie cardiovasculaire athéromateuse établie, sous metformine, intention
« intensifier », au-dessus de l'objectif, HbA1c 8 %.

**Sortie vérifiée** : ni l'iSGLT2 ni l'AR GLP-1 n'apparaissent ; la « Gliptine (sitagliptine) » apparaît
(place résiduelle, rang remonté par le drapeau).

**Verrouille** : le drapeau « classes protectrices indisponibles » doit empêcher toute introduction
d'iSGLT2/AR GLP-1 même en présence d'une indication cardiovasculaire forte, et laisser la place résiduelle
prendre le relais.

**Drapeau** : aucun. Ce profil DFG 40 tombe aussi dans la tranche « < 45 » d'une alerte dédiée
(adaptation de dose de la sitagliptine/gliclazide) — non vérifiée par cette vignette (voir « Couverture »).

### P-23 (« V-H1 ») — `evaluateNode.prescription.test.ts:316-320`

**Profil** : sous metformine + AR GLP-1 (déjà en place), intention « intensifier », au-dessus de
l'objectif, HbA1c 8,5 %.

**Sortie vérifiée** : la « Gliptine (sitagliptine) » n'apparaît PAS.

**Verrouille** : la non-association gliptine + incrétine doit être respectée aussi par la voie « place
résiduelle » (pas seulement par la voie classique de switch).

**Drapeau — ASSERTION FAIBLE.** Une seule assertion, une seule vérification d'absence, sans contrepartie
positive dans la même vignette (aucun profil comparable où la gliptine résiduelle apparaîtrait, pour
prouver que l'absence vient bien du mécanisme testé et pas d'un défaut plus large de l'option). Si
l'option « Gliptine (sitagliptine) » disparaissait entièrement du contenu par erreur, cette vignette
resterait verte sans le détecter.

### P-24 (« V-H1b ») — `evaluateNode.prescription.test.ts:322-326`

**Profil** : identique à P-23 mais avec **tirzépatide** au lieu d'AR GLP-1.

**Sortie vérifiée** : la « Gliptine (sitagliptine) » n'apparaît PAS.

**Verrouille** : même règle que P-23, pour le tirzépatide.

**Drapeau — ASSERTION FAIBLE**, pour la même raison que P-23 (absence seule, sans contrepartie positive).
Voir aussi « Doublons » : P-23/P-24 forment une paire symétrique volontaire (AR GLP-1 vs tirzépatide), ce
qui est une bonne pratique de conception, mais n'ajoute pas de robustesse sur la faiblesse commune aux
deux.

### P-25 (« V-M1 ») — `evaluateNode.prescription.test.ts:328-335`

**Profil** : sous metformine seule, intention « intensifier », **nettement** au-dessus de l'objectif,
HbA1c 11 %, symptômes de glucotoxicité présents, cétonémie positive. **Profil quasiment identique à P-16
(S3)** — voir « Doublons ».

**Sortie vérifiée** : l'AR GLP-1 n'apparaît PAS parmi les retenues et apparaît parmi les écartées ;
« Insuline d'initiation » apparaît.

**Verrouille** : en état catabolique franc, l'AR GLP-1 doit être explicitement ÉCARTÉ (pas seulement
absent), pas uniquement l'iSGLT2 dont l'exclusion par la cétonémie était déjà connue.

**Drapeau** : aucun sur le mécanisme testé (bien ciblé, écarté avec motif). Voir « Doublons » pour le
recouvrement de profil avec P-16.

### P-26 (« V-coherence ») — `evaluateNode.prescription.test.ts:337-345`

**Profil** : sous metformine, intention « optimiser », HbA1c actuelle **9 %** — la position par rapport à
l'objectif **n'est pas précisée par la vignette** : elle reste à sa valeur par défaut « à l'objectif ».
C'est délibéré : le profil déclare le patient « à l'objectif » alors que son HbA1c est à 9 %, une
contradiction volontairement construite pour vérifier l'alerte de cohérence.

**Sortie vérifiée** : une alerte contenant à la fois « Cohérence » et « INTENSIFICATION » se déclenche.

**Verrouille** : quand le praticien déclare le patient « à l'objectif » (ou en dessous) alors que l'HbA1c
saisie est ≥ 9 %, une alerte de cohérence doit avertir qu'une intensification est probablement indiquée.

**Drapeau** : aucun — mais à noter explicitement (cf. consigne D20 du mandat) : c'est un des rares cas où
une valeur par défaut non réaffirmée (« à l'objectif ») est **le ressort même du test**, pas un oubli.

### P-27 (« V-hba1c-derive ») — `evaluateNode.prescription.test.ts:347-352`

**Profil** : sous metformine + sulfamide, intention « déprescrire », en dessous de l'objectif, HbA1c
actuelle **6,0 %**, schéma à risque hypoglycémique élevé. Le champ `hba1c_sous_cible` n'est
**volontairement pas fixé** par la surcharge (contrairement à P-08) — le titre du test précise « drapeau
non requis ».

**Sortie vérifiée** : « Désintensifier » apparaît.

**Verrouille** : le déclenchement de la désintensification doit provenir du calcul automatique sur l'HbA1c
saisie (6,0 % < 6,5 %), sans qu'un drapeau manuel distinct soit nécessaire — protège contre une régression
du recalcul automatique.

**Drapeau** : aucun — vignette de régression propre et bien ciblée. Voir « Doublons » : forme, avec P-08
et P-09, un trio de vignettes très proches sur le même mécanisme (sur-traitement sous sulfamide →
désintensifier), chacune isolant une nuance différente (âge, drapeau manuel vs calculé).

### P-28 (« SEQ1 ») — `evaluateNode.prescription.test.ts:356-365`

**Profil** : patient **naïf de tout traitement**, intention « initier », au-dessus de l'objectif (mais
pas nettement), HbA1c 7,2 %.

**Sortie vérifiée** : ni l'iSGLT2 ni l'AR GLP-1 n'apparaissent ; la « Metformine (socle...) » apparaît.

**Verrouille** : à l'initiation avec une élévation modérée de l'HbA1c (7,2 %, « au-dessus » mais pas
« nettement »), le traitement doit rester une monothérapie metformine — pas de bithérapie d'emblée.

**Drapeau** : aucun.

### P-29 (« SEQ2 ») — `evaluateNode.prescription.test.ts:367-375`

**Profil** : patient naïf, intention « initier », **nettement** au-dessus de l'objectif, HbA1c 9 %.

**Sortie vérifiée** : iSGLT2 ET AR GLP-1 apparaissent tous les deux.

**Verrouille** : à l'initiation avec une élévation nette de l'HbA1c, la bithérapie d'emblée doit s'ouvrir
— traduit le séquençage HAS (« bithérapie d'emblée si nettement au-dessus »).

**Drapeau** : aucun. Note : la présence de la metformine socle en parallèle n'est pas vérifiée ici (mineur,
elle l'est par P-28 sur un profil voisin).

### P-30 (« ORD1 ») — `evaluateNode.prescription.test.ts:377-383`

**Profil** : sous metformine, intention « intensifier », au-dessus de l'objectif, IMC 27 (surpoids,
≥ 25), HbA1c 8,5 %. Aucune indication d'organe (ASCVD/IC/rein) déclarée — accès purement glycémique.

**Sortie vérifiée** : iSGLT2 ET AR GLP-1 apparaissent tous deux, l'iSGLT2 **en tête**.

**Verrouille** : en accès purement glycémique (sans comorbidité d'organe), à IMC ≥ 25, iSGLT2 et AR GLP-1
sont à égalité de rang — en cas d'égalité, l'iSGLT2 doit apparaître en tête (ordre de déclaration dans le
contenu, pas un ordre arbitraire).

**Drapeau** : aucun. Vignette qui teste spécifiquement une règle de départage à rang égal.

### P-31 (« ORD2 ») — `evaluateNode.prescription.test.ts:385-390`

**Profil** : identique à P-30 mais **IMC 23** (< 25, poids normal-bas plutôt que surpoids).

**Sortie vérifiée** : l'iSGLT2 est classé avant l'AR GLP-1 (cette fois, pas une égalité — l'AR GLP-1 est
explicitement rétrogradé).

**Verrouille** : chez un patient de poids normal-bas (IMC < 25) en accès purement glycémique, l'iSGLT2
doit passer devant l'AR GLP-1, la perte de poids associée à ce dernier n'étant pas souhaitable ici.

**Drapeau** : aucun. Forme une paire complémentaire avec P-30 (bascule de rang selon l'IMC).

### P-32 (« NAT1 ») — `evaluateNode.prescription.test.ts:392-397`

**Profil** : sous metformine + AR GLP-1, intolérance déclarée, maladie cardiovasculaire athéromateuse
établie, IMC 28, HbA1c 7 %, intention « optimiser » — testé deux fois : nature de l'intolérance
**digestive** puis **cutanée**.

**Sortie vérifiée** : avec une intolérance digestive, « Réduire la posologie de l'AR GLP-1 » apparaît ;
avec une intolérance cutanée, elle n'apparaît PAS.

**Verrouille** : la réduction de dose de l'AR GLP-1 ne doit se déclencher QUE pour une intolérance de
nature digestive (ou perte de poids) — pas pour n'importe quelle intolérance.

**Drapeau** : aucun — bonne paire contrastive (positive + négative) dans une seule vignette.

### P-33 (« RECETTE ») — `evaluateNode.prescription.test.ts:401-437`

**Profil** : 70 ans, **fragile**, espérance de vie **limitée**, IMC 20 (maigre), maladie cardiovasculaire
athéromateuse établie, DFG 70, normoalbuminurie, sous metformine + **gliptine**, intention « optimiser »,
déclaré **à l'objectif** malgré une HbA1c à 8 %.

**Sortie vérifiée** : en interne, la position « à l'objectif » calcule bien `cible_atteinte = true` ; à
l'écran, l'iSGLT2 apparaît parmi les retenues ET « Remplacer la gliptine » apparaît aussi.

**Verrouille** : c'est **LE profil qui a motivé toute la refonte R1→R4** (documentée dans `DECISIONS.md`
D19). Chez un patient maigre (donc AR GLP-1 exclu par le gate nutritionnel) sous gliptine et athérome
établi, l'outil doit désormais rendre un **verdict explicite sur la gliptine** (ici : la remplacer par
l'iSGLT2, seul remplaçant non exclu par la maigreur) au lieu de rester muet sur cette ligne de traitement
tout en ajoutant un iSGLT2 « à côté », en silence.

**Drapeau** : aucun — c'est la vignette de référence la mieux commentée du fichier ; à conserver
impérativement même après relecture (c'est la trace vivante d'un vrai défaut de production corrigé).
Note : l'HbA1c à 8 % avec une position « à l'objectif » n'est pas incohérente pour CE patient précis — un
sujet fragile à espérance de vie limitée relève, selon le nœud A, d'une cible individualisée relâchée
(≤ 8 % ou < 9 %), donc « à l'objectif » à 8 % est plausible ici, contrairement à P-26 où la même
combinaison serait un signal d'alerte.

### P-34 (« R3-1 ») — `evaluateNode.prescription.test.ts:441-450`

**Profil** : sous metformine + sulfamide **seulement** — tout le reste hérite du profil par défaut
(60 ans, à l'objectif, intention « optimiser », HbA1c 8 %, pas de comorbidité). Aucune comorbidité
d'organe, aucune élévation d'HbA1c ne justifie par ailleurs un switch.

**Sortie vérifiée** : « Remplacer le sulfamide » apparaît ; au moins un des deux (iSGLT2 ou AR GLP-1)
apparaît.

**Verrouille** : le switch du sulfamide doit se déclencher sur sa seule présence, même sans comorbidité ET
même à l'objectif — la troisième voie d'accès aux classes protectrices (indépendante de toute indication
d'organe), au cœur de la décision référent R3.

**Drapeau** : aucun formel, mais à signaler explicitement (consigne D20 du mandat) : cette vignette repose
presque entièrement sur des valeurs par défaut non réaffirmées (intention, position vs objectif, HbA1c) —
ici c'est voulu (prouver que RIEN d'autre n'est nécessaire pour déclencher le switch), mais voir
« Doublons » : le profil recouvre largement celui de P-20 (PC1).

### P-35 (« R3-2 ») — `evaluateNode.prescription.test.ts:452-465`

**Profil** : identique à P-34 mais avec **gliptine** au lieu de sulfamide.

**Sortie vérifiée** : « Remplacer la gliptine » apparaît ; au moins un des deux (iSGLT2 ou AR GLP-1)
apparaît.

**Verrouille** : même mécanisme que P-34, pour la gliptine — vérifie que la levée du verrou gliptine
s'applique aussi en l'absence de toute comorbidité, symétrique du sulfamide.

**Drapeau** : aucun formel. Paire symétrique volontaire avec P-34 (voir « Doublons »).

### P-36 (« R3-3 ») — `evaluateNode.prescription.test.ts:467-472`

**Profil** : sous metformine + sulfamide, HbA1c actuelle **6,0 %** (sur-contrôle) — reste du profil par
défaut (à l'objectif, non fragile, pas de comorbidité).

**Sortie vérifiée** : « Remplacer le sulfamide » n'apparaît PAS ; « Désintensifier » apparaît.

**Verrouille** : un sur-contrôle avéré (HbA1c < 6,5 %) doit bloquer le switch et orienter vers la
désintensification, même si le sulfamide est la seule anomalie du traitement, sans comorbidité.

**Drapeau** : aucun.

### P-37 (« R3-4 ») — `evaluateNode.prescription.test.ts:474-477`

**Profil** : sous metformine + sulfamide, **hypoglycémie récente déclarée** — reste du profil par défaut
(60 ans, non fragile, espérance de vie longue, schéma à risque hypoglycémique **faible**).

**Sortie vérifiée** : « Remplacer le sulfamide » n'apparaît PAS.

**Verrouille** : une hypoglycémie récente sous sulfamide doit bloquer le switch.

**Drapeau — ASSERTION FAIBLE**, avec une conséquence concrète à signaler au référent : le test ne vérifie
QUE l'absence du switch, jamais ce qui apparaît à la place. Or, avec ce profil précis, l'option
« Désintensifier » (que l'on pourrait attendre par analogie avec P-36) **ne se déclenche pas non plus** :
sa branche « hypoglycémie récente » exige EN PLUS un « terrain fragile » (`age ≥ 75 OU fragile OU EV
limitée OU risque hypo élevé`), qui vaut ici **faux** par défaut (60 ans, non fragile, EV longue, risque
hypo faible — aucun de ces quatre champs n'est réaffirmé par la vignette). Le patient obtient en réalité
une troisième option, « Réduire la posologie du sulfamide / du glinide » (dont les conditions sont bien
remplies : sulfamide présent + hypoglycémie récente) — **jamais vérifiée par cette vignette ni aucune
autre**. Autrement dit : la branche « hypoglycémie récente + terrain fragile → désintensifier » de
`prescription.yaml:628` n'est testée par **aucune** vignette de ce banc (voir « Couverture »).

---

# Couverture — ce que ces deux nœuds n'ont AUCUNE vignette pour vérifier

## Nœud A (`cible-glycemique`)

Les 4 bandes de cible sont toutes couvertes par au moins une vignette. Un point de couverture précis
manque néanmoins :

- **`antecedent_cv` n'est jamais isolé.** Il n'intervient que comme condition d'exclusion de la cible la
  plus stricte (« ~6,5 % » exige `antecedent_cv == false`) ; aucune vignette ne fixe `antecedent_cv: true`
  seul (sans `comorbidite_grave`) pour vérifier qu'un tel patient tombe bien sur « ≤ 7 % » (le repli) et
  pas sur « ≤ 8 % » (qui ne teste pas `antecedent_cv`). La seule vignette qui le manipule (A-05) le
  combine à `comorbidite_grave: true`, qui suffit à lui seul à expliquer le résultat — l'effet propre
  d'`antecedent_cv` n'est donc démontré nulle part.

## Nœud `prescription`

**11 des 24 options du nœud n'apparaissent dans AUCUNE vignette** (ni comme présentes, ni comme écartées,
ni comme absentes vérifiées) :

- « Réduire la posologie de la metformine (fonction rénale altérée ou intolérance digestive) »
- « Arrêter le sulfamide (DFG < 30 — contre-indication rénale) »
- « Association iSGLT2 + AR GLP-1 (deux indications distinctes) »
- « Envisager l'insuline (palette non-insulinique épuisée) »
- « Réduire la posologie de l'insuline (sur-basalisation / hypoglycémie) »
- « Réduire la posologie du tirzépatide (perte de poids excessive / intolérance) »
- « Réduire la posologie du sulfamide / du glinide (tolérance, hypoglycémie légère) »
- « Déprescrire la metformine (sur-traitement chez un patient fragile...) »
- « Reconsidérer un agent protecteur prescrit hors indication ET posant un risque »
- « Sulfamide (gliclazide MR ou glimépiride) — option glycémique de bas rang »
- « Poursuivre le traitement en cours et réévaluer » (le repli — **toute la famille « Aucun geste —
  surveiller » n'a donc aucune vignette**)

Deux gaps méritent une attention particulière du référent :

1. **« Déprescrire la metformine »** est l'option la PLUS RÉCENTE du nœud (arbitrage référent du
   2026-07-26, le jour même de ce chantier), avec son propre critère dédié
   (`metformine_deprescriptible`) et un bug déjà trouvé sur le banc automatique à 180 profils (« profil
   #121 », cf. commentaire `prescription.yaml:214-221`) — mais **zéro vignette manuelle** ne l'exerce.
2. **« Envisager l'insuline »** et **« Insuline d'initiation »** ont reçu, le même jour, un correctif de
   sécurité (`prerequis: traitements_en_cours ne_contient_pas insuline`, pour ne plus proposer d'« initier »
   une insuline chez un patient déjà sous insuline) et une réécriture d'alerte dédiée (« COLMATAGE D'UNE
   RÉGRESSION », `prescription.yaml:809-823`). Aucune vignette ne couvre le cas « patient déjà sous
   insuline + cétonémie » qui a motivé ce correctif — ni la présence de « Envisager l'insuline » nulle
   part, ni son absence chez un patient déjà insuliné.

**Une branche de règle jamais atteinte** (au-delà des options) : l'option « Désintensifier » a deux portes
de déclenchement — sur-contrôle (`hba1c_sous_cible`, bien couverte : P-08, P-09, P-27, P-36) et
« hypoglycémie récente **chez un patient au terrain fragile** » (`prescription.yaml:628`). Cette seconde
porte n'est vérifiée par AUCUNE vignette dans son cas positif (voir le drapeau détaillé sur P-37, qui teste
un profil où cette porte reste fermée par construction).

**Alertes de nœud jamais vérifiées par leur texte** (sur 17 alertes déclarées, `prescription.yaml:802-954`),
notamment : les trois messages d'adaptation de dose de la metformine au palier de DFG (45-59 / 30-44 /
< 30) ; l'alerte « cétonémie chez un patient déjà sous insuline » ; l'alerte fragilité « déjà sous
incrétine » (distincte de celle testée par P-03, qui couvre la branche « on va en introduire un ») ;
l'alerte « risque hypoglycémique élevé + place résiduelle → déconseiller le sulfamide » ; l'alerte
« place résiduelle + DFG < 45 → adapter la dose » (le profil de P-22/M1, DFG 40, la traverserait
mécaniquement mais ne la vérifie pas) ; l'alerte de cohérence « intensifier + HbA1c < 6,5 % » (distincte
de celle testée par P-26, qui couvre la branche opposée) ; l'alerte « intention = déprescrire » (info) ;
l'alerte « insuline + risque hypo élevé → éviter un sécrétagogue » ; l'alerte de non-association gliptine
systématique (plusieurs vignettes ont une gliptine en cours — D4/D5/R3-2/RECETTE — mais aucune ne vérifie
le texte de cette alerte).

**Valeurs d'énumération jamais exercées** : `nature_intolerance` a 6 valeurs possibles, seules `digestive`
et `cutanee` sont testées (P-32) — `uro_genitale`, `perte_poids` et `autre` ne le sont jamais, alors que
`perte_poids` déclenche spécifiquement les options de réduction de dose des incrétines
(`prescription.yaml:659, 671`). `albuminurie` : `micro` est testé (P-05), `macro` ne l'est jamais.
`preference_injection: accepte` n'est jamais testé (mais ne pilote aucune règle propre — se comporte comme
`indifferent` par construction, donc risque faible).

**Badges** (« Recommandée » / « Recommandation officielle (France) ») : couverture nulle sur les deux
nœuds — aucune des 50 vignettes n'appelle `computeBadges`/`optionBadges.ts`. Si le référent veut valider
ce que voit concrètement l'écran (pas seulement quelles options existent), c'est un chantier à part.

---

# Doublons — vignettes qui recouvrent le même terrain

- **P-16 (S3) et P-25 (V-M1)** : profils quasiment identiques (metformine seule, HbA1c 11 %, symptômes de
  glucotoxicité + cétonémie, intention intensifier, nettement au-dessus de l'objectif) — littéralement le
  même patient catabolique. Les assertions sont complémentaires (S3 : option insuline + alerte cétonémie ;
  V-M1 : exclusion de l'AR GLP-1 + option insuline), donc pas un pur gaspillage, mais le référent doit
  savoir qu'il valide deux fois le même profil sous deux angles plutôt que deux profils différents.

- **P-08 (D1), P-09 (D1b), P-27 (V-hba1c-derive)** : trio sur le même mécanisme (sur-traitement sous
  sulfamide → désintensifier), chacun isolant une nuance : D1 fixe l'âge à 72 ans et le drapeau
  `hba1c_sous_cible` à la main ; D1b prouve l'indépendance à l'âge (55 ans) ; V-hba1c-derive prouve que le
  calcul automatique suffit sans drapeau manuel. Nuances réelles, mais à fusionner ou clarifier si le
  référent juge que trois vignettes sont excessives pour une seule règle.

- **P-20 (PC1) et P-34 (R3-1)** : même profil de fond (sulfamide seul, à l'objectif, intention
  « optimiser », sans comorbidité) et mêmes conclusions vérifiées (switch du sulfamide + destination
  protectrice applicable). PC1 est la version « explicite » (toutes les valeurs réaffirmées + vérification
  des deux critères dérivés en interne) ; R3-1 est la version « minimale » (tout hérité des valeurs par
  défaut). PC1 est strictement plus informative ; R3-1 pourrait être retirée sans perte si le référent
  valide PC1.

- **P-23 (V-H1) et P-24 (V-H1b)** : paire symétrique délibérée (AR GLP-1 vs tirzépatide) sur la même
  règle de non-association — conception saine, pas un doublon accidentel, mais les deux partagent la même
  faiblesse d'assertion (absence seule, cf. drapeaux).

- **P-34 (R3-1) et P-35 (R3-2)** : paire symétrique délibérée (sulfamide vs gliptine) sur le même
  mécanisme R3 — conception saine, à garder telle quelle.

- **P-11 (D4) et P-33 (RECETTE)** : tous deux mettent en scène un patient sous gliptine recevant un
  verdict de switch, mais avec des terrains opposés (D4 : obèse, IMC 31, destination AR GLP-1 ; RECETTE :
  maigre et fragile, IMC 20, destination iSGLT2 par exclusion de l'AR GLP-1). Ce n'est **pas** un doublon
  — les deux sont nécessaires pour couvrir les deux issues possibles du même verdict — mais le référent
  doit les relire ensemble pour juger de la cohérence des deux destinations.

- **Nœud A — A-02 et A-12** : réutilisent exactement le même profil (52 ans, diabète 3 ans, espérance de
  vie longue) ; A-12 s'en sert seulement pour vérifier le texte interne de justification. Réutilisation
  légitime, pas un doublon de contenu clinique (A-12 ne revérifie pas la valeur de la cible retenue,
  seulement son texte).

- **Nœud A — A-09, A-10, A-11** : trois chemins distincts vers/autour de la même bande (« < 9 % » pour
  A-09/A-10, « ≤ 8 % » pour A-11 comme contre-épreuve) — triptyque volontaire et complémentaire, à garder.
