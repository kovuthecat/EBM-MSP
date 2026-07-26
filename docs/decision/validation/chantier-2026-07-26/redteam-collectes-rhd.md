# Red-team (agent B) — collectes RHD alimentation & activité physique (2026-07-26)

Vérification adversariale des deux dossiers de conception produits par des agents A le 2026-07-26 :

- `rhd-collecte-alimentation.md`
- `rhd-collecte-activite-physique.md`

Méthode : réextraction texte de tous les PDF cités (`pdftotext -layout -enc UTF-8`), vérification page
par page de chaque citation portant une référence, recoupement avec `H-rhd.md` et avec les critères
réellement déclarés dans `content/noeuds/diabete-type-2/*.yaml`. Aucun fichier existant modifié.

**Décompte** : **4 HAUTE**, **5 MOYENNE**, **2 BASSE** — répartition détaillée ci-dessous.

---

## A. Findings — rapport ALIMENTATION

### A-1 [HAUTE] — Citation SFD 2025 mal attribuée à « Avis n°14 » (récurrente ×3 : S1, U1, B1)

**Où** : P1 tableau socle (item S1), P2 piste U1, P2 piste B1.

**Ce qui est affirmé** : les trois pistes citent `SFD 2025.pdf p.21, Avis n°14` pour justifier
« en évitant… la consommation… de boissons sucrées » et « … d'aliments ultra-transformés », étiquetées
**recommandation officielle**.

**Ce que dit la source** :
- `Avis no 14 - Patient en situation d'obésité (IMC ≥ 30 kg/m2) : stratégies non chirurgicales` est bien
  réel, mais se trouve **page 17**, et son texte ne mentionne **ni boissons sucrées ni aliments
  ultra-transformés** — il parle de « alimentation équilibrée, idéalement de type méditerranéen,
  modérément hypocalorique si cela est nécessaire… ».
- La phrase réellement citée (« Les modifications thérapeutiques du mode de vie sont indispensables, en
  favorisant une alimentation de type méditerranéen et **en évitant plus spécifiquement la consommation
  d'aliments ultra-transformés et de boissons sucrées** ») est bien page **21**, verbatim confirmé — mais
  elle appartient à la section consacrée aux patients **DT2 + MASLD/MASH (stéatose hépatique)**, juste
  avant `Avis no 16`, **pas à l'Avis n°14**.

**Correction proposée** : soit retrouver la vraie source SFD pour une recommandation générale
boissons sucrées/ultra-transformés (elle existe peut-être ailleurs dans le document, à re-chercher),
soit conserver la citation p.21 mais la retirer d'« Avis n°14 » et signaler qu'elle est **scopée
MASLD/MASH**, pas une recommandation générale pour tout patient DT2. Ne pas présenter comme validant
une reco générale ce qui est une reco de sous-population.

### A-2 [HAUTE] — Piste M1 : la moitié du geste (« colza ») n'est pas le bras testé par PREDIMED, sous le même label « bénéfice EBM sur critère dur »

**Où** : P2 piste M1 (« Huile d'olive ou de colza »), table P3.

**Ce qui est affirmé** : M1 est étiquetée **bénéfice EBM sur critère dur**, geste = « Utiliser de
l'huile d'olive (ou colza)… », adossé à PREDIMED (HR 0,69, huile d'olive).

**Ce que dit la source** : PREDIMED randomise l'ajout d'**huile d'olive vierge extra** *ou* de **noix**
— jamais de colza (`H-rhd.md` §3 H3 : « MedDiet + huile d'olive VE *ou* noix vs conseil pauvre en
graisses »). Aucune des trois sources citées à l'appui de la paire olive/colza ne fait le lien EBM pour
le colza : `guide HAS…obesite.pdf` Fiche 4 p.180 parle uniquement d'« huile d'olive » (pas de colza) ;
`Lifestyle education…ebmfrance.pdf` p.3/5 dit juste « oil » / « vegetable oil » (générique, ni olive ni
colza) ; seul `prescrire-dt2.md` P10 mentionne « huile d'olive/colza », mais comme repère nutritionnel
général (verbe « semble »), pas comme bras d'essai. Le rapport se contredit d'ailleurs lui-même : sa
propre synthèse P3 (ligne « Ce ratio… ») écrit noir sur blanc que « parmi ses composants, **seul l'ajout
d'huile d'olive est un bras réellement randomisé** » — mais le tableau et le geste M1 continuent
d'inclure le colza sous la même étiquette EBM-dur.

**Correction proposée** : soit retirer le colza du geste M1 et le reporter en variante « savoir-faire »
distincte, soit conserver la formulation mais retirer explicitement l'étiquette « bénéfice EBM sur
critère dur » du colza (huile d'olive seule = EBM-dur ; colza = recommandation officielle/savoir-faire).
C'est la **seule** piste EBM-dur de tout le module — l'enjeu de précision est maximal.

### A-3 [HAUTE] — Piste B2 : la référence Salame/NutriNet-Santé citée est celle des émulsifiants, pas des édulcorants

**Où** : P2 piste B2 (« Ne pas remplacer par des édulcorants intenses »).

**Ce qui est affirmé** : « Étayé par un signal épidémiologique… : `prescrire-dt2.md` P9 (cohorte
NutriNet-Santé, Salame et al., *Lancet Diabetes Endocrinol* 2024;12:339-49) — à présenter comme argument
de prudence uniquement. »

**Ce que dit la source** : `prescrire-dt2.md` P9 contient deux signaux **distincts**, deux puces
séparées : (1) « cohorte NutriNet-Santé 2024 → *une association entre des émulsifiants… et le risque de
diabète de type 2* (réf = Salame C et coll., *Lancet Diabetes Endocrinol* 2024;12:339-49) » — c'est
l'étude sur les **émulsifiants** (polysorbate 80, CMC) ; (2) « Édulcorants « intenses »… associés à un
risque accru de… diabète de type 2 et à une mortalité accrue » — c'est le signal sur les
**édulcorants**, présenté par Prescrire **sans la référence Salame**. Le rapport rattache la citation
Salame/NutriNet-Santé (émulsifiants) au geste sur les édulcorants : référence transposée d'un sujet à
l'autre dans la même note.

**Correction proposée** : retirer la référence Salame de B2 (elle documente les émulsifiants, sujet
d'ailleurs non couvert par la grille alimentation actuelle) ; citer P9 sans lui attacher une référence
précise pour le point édulcorants, ou retrouver la source réelle du signal édulcorants chez Prescrire.

### A-4 [HAUTE] — Piste T1 : grade « A/B » attribué à une phrase non gradée

**Où** : P2 piste T1 (« Fixer des repas à heures régulières »).

**Ce qui est affirmé** : « Provenance : recommandation officielle — `ebmfrance` p.6 (**guideline A/B**,
« Fixed meal times in order to support weight control ») ».

**Ce que dit la source** : dans `Lifestyle education in type 2 diabetes` (p.6), les sous-sections
« Appropriate meal size in proportion to the patient's weight », « Meals are to be enjoyed without
hurrying » et « **Fixed meal times in order to support weight control** » ne portent **aucune lettre de
grade** (vérifié à l'extraction texte et en mode layout, deux méthodes concordantes) — contrairement aux
sous-sections voisines qui, elles, affichent explicitement leur grade (« Tips for implementing a
recommended diet **A B** », « Increasing physical activity **A A A** »). Le « A/B » cité pour T1 semble
recopié de la sous-section précédente (portant sur le choix des aliments), pas de « Fixed meal times »
elle-même.

**Correction proposée** : retirer la mention de grade pour T1, ou la reformuler « repère pratique non
gradé, issu d'un guide EBM (ebmfrance) » — cohérent avec T2/T3 qui, eux, ne revendiquent pas de grade
pour des citations voisines du même document.

---

### A-5 [MOYENNE] — PREDIMED : la rétractation de 2018 n'est jamais mentionnée

**Où** : P2 piste M1 ; P3 (synthèse du ratio EBM-dur/officielle).

**Ce qui est affirmé** : « PREDIMED, bras huile d'olive : HR 0,69 (IC 0,53-0,91)… réanalyse 2018, PMID
29897866 ».

**Ce que dit la source citée par le rapport lui-même** (`H-rhd.md` §3, sous-dossier H3) : « article
**républié** PMID 29897866 … *orig. 23432189 rétracté* ; avis 29897867 ». Le dossier de preuve que le
rapport cite documente explicitement la rétractation d'origine (irrégularités de randomisation sur
certains centres) ; le rapport reprend le chiffre post-réanalyse mais ne mentionne jamais le mot
« rétracté » ni la raison de la réanalyse — alors que c'est précisément la nuance demandée par
l'invariant 6 (exactitude médicale) sur la **seule** piste EBM-dur du module.

**Correction proposée** : ajouter une phrase de contexte dans M1 (« essai initialement publié en 2013,
rétracté puis republié en 2018 après correction méthodologique — cf. H-rhd.md §3 ») pour que le
référent/l'argumentaire final ne perde pas cette nuance en aval.

### A-6 [MOYENNE] — S8 : deux signes sur trois attribués à « DSM-5 » viennent en fait de la liste « perturbations de l'alimentation », pas de la liste DSM-5

**Où** : P1, item S8 (verrou TCA).

**Ce qui est affirmé** : « `guide HAS…obesite.pdf` encadré 11 p.43 (**DSM-5** : « restriction
cognitive… » ; « manger seul ou en cachette… » ; « demande de régime amaigrissant… ») ».

**Ce que dit la source** : l'Encadré 11 (p.43) contient **deux listes distinctes** : (1) « Penser à des
**perturbations de l'alimentation** face à des signes cliniques d'appel » — inclut « manger seul ou en
cachette… se sentir dégoûté de soi-même, triste ou coupable » et « restriction cognitive… alternance
avec des épisodes de désinhibition » ; (2) « Penser à des **troubles des conduites alimentaires (TCA)**
face à des signes cliniques d'appel comme (**DSM-5**) » — inclut « demande de régime amaigrissant…
habitudes alimentaires restrictives ». Sur les 3 citations utilisées pour S8, **seule la troisième**
(demande de régime amaigrissant) appartient à la liste explicitement estampillée « DSM-5 » dans la
source ; les deux premières viennent de la liste « perturbations de l'alimentation », plus large et non
spécifiquement DSM-5.

**Correction proposée** : ne pas regrouper les trois citations sous une même étiquette « (DSM-5 : … ;
… ; …) » — soit distinguer les deux registres (cohérent avec la nuance que la HAS fait elle-même), soit
retirer la mention « DSM-5 » et parler plus largement de « signes d'appel HAS (encadré 11) », ce que le
paragraphe d'avertissement S8 fait déjà correctement par ailleurs.

### A-7 [MOYENNE] — P1'/P2' (pesée, repères de portion) : la source scope explicitement cette technique aux patients sous insulinothérapie fonctionnelle, non signalé

**Où** : P2 pistes P1' et P2' (famille Portions).

**Ce qui est affirmé** : ces pistes sont déclenchées par « approfondissement A4 = difficile » chez
n'importe quel patient DT2, étiquetées « savoir-faire diététique (non EBM) ».

**Ce que dit la source** (`rapport_gtg_glucides_sfd.pdf`, p.8) : juste avant la phrase citée par le
rapport, le texte précise : « **Pour la pratique, ce degré de précision dans la quantification des
glucides n'est pas requis pour les patients diabétiques de type 2**, chez qui, l'apprentissage doit se
focaliser sur « comment diversifier son alimentation » et réduire ses apports en graisses. À l'inverse,
les patients diabétique de type 1 et de type 2 pratiquant **l'insulinothérapie fonctionnelle**, peuvent
utiliser les tables… » — et la phrase « il semble pertinent de peser au moins deux ou trois fois… »
apparaît juste après, dans un paragraphe qui introduit l'estimation de quantité « lorsqu'elle doit être
assez précise (**insulinothérapie fonctionnelle, utilisation des assistants bolus des pompes ou des
lecteurs**) ». La conclusion générale p.14 (citée par le rapport, exacte) réemploie la formule plus
largement pour « l'éducation nutritionnelle dispensée aux patients diabétiques » — il y a donc une
tension interne à la source elle-même entre un paragraphe scopé (p.8, insulinothérapie fonctionnelle) et
une conclusion générale (p.14) ; le rapport ne signale cette tension nulle part et généralise sans
discussion.

**Correction proposée** : signaler la tension p.8/p.14 dans le sourçage de P1'/P2', et demander au
référent si ces deux pistes doivent être réservées aux patients sous schéma insulinique nécessitant un
comptage précis, ou confirmées comme générales (cas où la conclusion p.14 prévaut).

### A-8 [MOYENNE] — R2 (« Explorer le contexte avant de juger ») : étiquette « recommandation officielle » pour une inférence, candidate à « À SOURCER »

**Où** : P2 piste R2 (famille Restauration rapide).

**Ce qui est affirmé** : « Provenance : recommandation officielle — `guide HAS…obesite.pdf` §3.5.2 p.42
(la grille de recueil elle-même invite à explorer le contexte avant de juger) ».

**Ce que dit la source** : p.42 est une liste d'items de **recueil** (« contexte et conditions… des
prises alimentaires : maison, restaurant d'entreprise, restauration rapide… »), pas une recommandation
d'action formulée comme « explorer avant de juger ». Le rapport transforme un item de collecte de
données en recommandation comportementale pour le praticien — inférence raisonnable mais non littérale.
C'est exactement le type de piste qui, par la propre règle du rapport (« ce qui semble plausible mais
n'est étayé nulle part… est marqué « À SOURCER » »), aurait dû être signalée plutôt qu'étiquetée
« officielle » au même titre que les autres pistes du tableau P3.

**Correction proposée** : reclasser R2 en « savoir-faire (non EBM) » ou « À SOURCER », cohérent avec le
traitement réservé à B3 (alcool) dans le même rapport.

---

## B. Findings — rapport ACTIVITÉ PHYSIQUE

### B-1 [BASSE] — S7 : citation « p. 5/6 » pour une phrase située en réalité p. 6/6

**Où** : P1, item S7.

**Ce qui est affirmé** : « `Lifestyle education...pdf`, p. 5/6, §3 : *« All forms of exercise that the
patient likes and that are feasible for him/her are suitable »* ».

**Ce que dit la source** : cette phrase appartient à la sous-section « Increasing physical activity A A
A », qui se trouve en page **6** du PDF (juste avant le footer « 6 sur 6 »), pas en page 5 — le même
document, la même phrase, est d'ailleurs correctement cité « p. 6/6 » ailleurs dans le même rapport
(pistes 3.1 et 3.3). Le contenu et la traduction sont exacts ; seul le numéro de page est décalé d'une
unité.

**Correction proposée** : corriger « p. 5/6 » en « p. 6/6 ».

### B-2 [MOYENNE] — Piste 4.2 : étiquette « recommandation officielle » sur un ancrage R.24 qui ne couvre pas le cas d'usage (patient déjà actif)

**Où** : P2 famille 4, piste 4.2 (« Maintenir la pratique actuelle »).

**Ce qui est affirmé** : « Provenance (P3) : Recommandation officielle — même ancrage R.24 (diversité
endurance/renforcement) ; formulation de maintien cohérente avec le point EBM directeur… ».

**Ce que dit la source** : R.24 (HAS DT2, p.13, grade AE) dit : « Prescrire un programme d'AP adaptée
d'endurance et de renforcement musculaire, d'une durée de 3 mois, renouvelable, à raison de 2 à 3
séances par semaine » — c'est une recommandation de **prescription** d'un programme structuré pour un
patient qui en a besoin, pas une recommandation de « maintien » pour un patient déjà actif ≥ 4×/semaine
(la cible de 4.2). Le rapport le reconnaît lui-même en rattachant la justification réelle au « point EBM
directeur » (§0, régularité prédictive, ebmfrance grade A) plutôt qu'à R.24 stricto sensu — mais
continue d'afficher R.24 comme ancrage « officiel » en colonne Provenance.

**Correction proposée** : soit retirer la mention R.24 pour 4.2 et ne garder que l'ancrage ebmfrance
(§0, cohérent), soit reformuler la case Provenance pour dire explicitement que R.24 ancre la
*composition* du programme (endurance + renforcement) mais pas le principe de « maintien ».

### B-3 [BASSE / point de vigilance, non tranché] — G3 : proposition de faire passer une alerte existante (non bloquante) à un blocage effectif, sans le signaler comme un écart à l'arbitrage §8-5

**Où** : P4, note sous le tableau des garde-fous (G1-G7).

**Ce qui est affirmé** : « cette collecte ne demande donc pas un nouveau critère pour G3, seulement
d'étendre son usage du seul déclenchement d'alerte au **blocage effectif** des pistes d'intensification ».

**Ce que dit le dossier H** : `H-rhd.md` §8-5 tranche explicitement, pour ce même mécanisme
(`traitements_en_cours contient insuline/sulfamide/glinide`) et cette même alerte D15 dans
`content/noeuds/diabete-type-2/rhd.yaml` : « **alerte conservée**… pas d'exclusion ». Le mécanisme visé
par G3 (hypoglycémie **à l'effort**, R.27) est cliniquement distinct de celui déjà tranché côté
alimentation (hypoglycémie **par restriction des apports**, §8-5) — la proposition n'est donc pas
nécessairement en contradiction clinique. Mais le rapport ne signale nulle part qu'il propose de durcir
(alerte → blocage) le même D15 qu'un arbitrage référent antérieur a explicitement choisi de garder non
bloquant ; le référent pourrait ne pas remarquer ce changement de nature au moment du câblage.
**Non tranché ici** faute d'élément permettant d'affirmer que c'est une erreur — signalé comme point
d'attention à soumettre explicitement au référent, pas comme un défaut avéré.

---

## C. Deux points précis à trancher (mission)

### C-1 — Seuil de rupture de sédentarité : R.16 vs Fiche 5

Vérifié directement dans les deux PDF :

- **HAS DT2** (`strategie_therapeutique…pdf`, p.12) — **R.16, grade C** : « Il est recommandé
  d'encourager les patients vivant avec un DT2 à rompre les temps prolongés assis en se levant et en
  bougeant **au moins une minute toutes les heures** (grade C). » — verbatim confirmé, page confirmée
  (12), grade confirmé (C, une lettre de grade explicite dans le système à 5 niveaux du document).
- **Guide HAS parcours surpoids-obésité** (`guide HAS…obesite.pdf`, p.189) — **Fiche 5** (« Enseignant en
  activité physique adaptée »), **non gradée** : « … rompre les temps prolongés assis en se levant pour
  bouger, mobiliser ses articulations, **au moins 4 à 5 minutes toutes les heures et demie**. » —
  verbatim confirmé, page confirmée (189), et confirmé qu'aucune lettre de grade n'accompagne cette
  fiche (contrairement au système R.1-R.49 du document DT2).

**Verdict** : la caractérisation du rapport activité est **exacte sur les deux citations** (texte, page,
grade). Le choix du référent de retenir R.16 (1 min/heure, grade C, spécifique DT2) comme seuil par
défaut repose sur une citation correctement vérifiée. La Fiche 5 est bien une fiche métier
(« enseignant APA »), plus ambitieuse mais non gradée pour ce point précis — la distinction que fait le
rapport entre les deux registres (reco gradée DT2 vs repère de fiche métier plus large) est fondée.

### C-2 — Réutilisation de critères d'autres nœuds (`fragilite`, `esperance_vie`, `age`, `traitements_en_cours`)

Vérifié contre `content/noeuds/diabete-type-2/cible-glycemique.yaml` (nœud A), `insuline.yaml` (nœud E)
et `rhd.yaml` (nœud H lui-même) :

- `fragilite` : type **bool** dans les deux rapports ↔ `bool` dans `cible-glycemique.yaml` (ligne 19) et
  `insuline.yaml` (ligne 55). **Cohérent.**
- `esperance_vie` : type **enum** dans le rapport alimentation ↔ `enum [longue, intermediaire, limitee]`
  dans `cible-glycemique.yaml` (lignes 16-18). **Cohérent** (le rapport ne redéclare pas les valeurs,
  mais n'en présuppose aucune incompatible).
- `age` : type **nombre** dans le rapport alimentation ↔ `nombre` dans `cible-glycemique.yaml` (ligne
  12). **Cohérent.**
- `traitements_en_cours` : condition reprise à l'identique dans les deux rapports
  (`traitements_en_cours contient insuline OR sulfamide OR glinide`) ↔ **exactement** la condition déjà
  encodée dans `content/noeuds/diabete-type-2/rhd.yaml` ligne 264 (`type: liste`, valeurs
  `[metformine, iSGLT2, aGLP1, tirzepatide, sulfamide, gliptine, insuline, glinide]`) pour l'alerte D15
  existante. **Cohérent, y compris au niveau de l'implémentation actuelle du nœud H.**

**Verdict** : aucun glissement sémantique trouvé sur ces quatre critères — c'est le point le mieux vérifié
des deux rapports. Noter que `fragilite`, `esperance_vie` et `age` ne sont **pas encore** déclarés dans
`rhd.yaml` (seuls `IMC`, `anciennete_diabete_annees`, `motivation`, `capacite_activite`,
`alimentation_equilibree`, `activite_physique_reguliere`, `traitements_en_cours` le sont) : les deux
rapports proposent bien un **ajout**, pas une réutilisation d'un critère déjà câblé dans H — cohérent
avec `H-rhd.md` §1 qui les listait comme candidats non encore actés.

---

## Décompte final

| Sévérité | Alimentation | Activité physique | Total |
|---|---|---|---|
| HAUTE | 4 (A-1 à A-4) | 0 | **4** |
| MOYENNE | 3 (A-5 à A-8, soit 4 comptées séparément — voir note) | 1 (B-2) | **5** |
| BASSE | 0 | 2 (B-1, B-3) | **2** |
| **Total** | **8** | **3** | **11** |

*(Note : A-5, A-6, A-7, A-8 sont 4 findings MOYENNE côté alimentation — le tableau ci-dessus les
totalise correctement dans le décompte global de tête : 4 HAUTE + 5 MOYENNE + 2 BASSE = 11.)*

## Verdict global

**Rapport activité physique** : très solidement sourcé — sur ~25 citations vérifiées (R.16, R.19, R.24,
R.25, R.27, R.28, R.30-R.38 par ricochet, ebmfrance p.3-6, guide HAS p.41/188-189), une seule imprécision
de page (BASSE) et une étiquette un peu généreuse (MOYENNE) ont été trouvées. Le point de méthode demandé
par le référent (seuil R.16 vs Fiche 5) est traité avec une exactitude totale sur le texte, la page et le
grade des deux sources. **Exploitable tel quel pour la suite du travail (validation référent), avec les
deux corrections mineures B-1/B-2 à appliquer en passant.**

**Rapport alimentation** : la charpente (grille de recueil, garde-fous TCA/dénutrition/hypoglycémie,
cohérence du gating réduction-vs-substitution) est saine et bien pensée. Mais **4 findings HAUTE**
touchent tous des points sensibles : la SEULE piste EBM-dur du module (M1, avec en prime l'omission de
la rétractation PREDIMED signalée par sa propre source), une référence Prescrire transposée d'un sujet à
un autre (B2), une reco SFD mal attribuée et répétée trois fois (S1/U1/B1), et un grade inventé sur une
piste de structuration des repas (T1). Ce ne sont pas des inventions ex nihilo — chaque erreur part d'une
vraie citation, mais glisse le sens, l'attribution ou le grade. C'est exactement le mode de défaillance
que la mission demandait de chercher. **Exploitable après corrections ciblées** (les 4 HAUTE + les 4
MOYENNE sont chacune corrigeable en une ou deux phrases, sans remettre en cause la structure du
document) — mais ne devrait pas passer en distillation YAML sans que ces corrections soient faites,
puisque M1 est précisément la pièce que le référent examinera le plus attentivement (seule étiquette
EBM-dur du module).
