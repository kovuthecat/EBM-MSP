# Red-team clinique — module DT2, angle sécurité (2026-07-26)

Mission : chercher des sorties cliniquement **dangereuses** sur des profils désormais **plausibles**
(bornes `min`/`max` déclarées le 2026-07-26, `engine/banc/profils.ts`). Périmètre : les 5 nœuds DT2
(`prescription`, `insuline`, `statine`, `rhd`, `cible-glycemique`). Lecture seule — aucun fichier de
contenu, de test ou de code modifié ; seul ce rapport est neuf.

## Méthode

Un script temporaire (3 fichiers `__redteam_temp*.test.ts` sous `src/features/decision/engine/banc/`,
**supprimés après usage**, aucune trace laissée) a :

1. fait tourner `genererProfils(node, tailleBanc(node))` sur les 5 nœuds (bancs réalistes de 600 à 2880
   profils selon le nœud) et `evaluateNode` sur chaque profil, à la recherche de motifs génériques
   (alerte au vocabulaire prohibitif co-occurrant avec une option applicable nommant la même classe) ;
2. construit à la main une douzaine de profils **ciblés** — dans les bornes déclarées, donc plausibles
   — sur les croisements identifiés par la lecture des 4 YAML de contenu (`prescription.yaml`,
   `insuline.yaml`, `statine.yaml`, `rhd.yaml` ; `cible-glycemique.yaml` lu aussi) et par
   `docs/decision/validation/chantier-2026-07-26/inventaire-alertes.md` (les 6 couples alerte/option de
   la recette du 2026-07-25) ;
3. rejoué `evaluateNode`/`computeBadges` sur ces profils et compté, sur le banc complet, la fréquence de
   chaque motif retenu — pour distinguer un cas rare d'un défaut structurel.

Chaque finding ci-dessous est reproductible : le profil exact est donné, il suffit de le repasser à
`evaluateNode(node, criteria)` (après `calculerCriteresDerives`) pour obtenir la sortie citée.

---

## Findings

### HAUTE-1 — Sulfamide en insuffisance rénale sévère : « Arrêter » et « Réduire la dose » affichés ensemble

**Profil patient** (nœud `prescription`) : `intention: optimiser` ; `traitements_en_cours: [sulfamide]` ;
`dose_metformine: 0` ; `HbA1c_actuelle: 8` ; `position_vs_cible: au_dessus` ; `ASCVD_etablie: false` ;
`insuffisance_cardiaque: false` ; **`DFG: 25`** ; `albuminurie: normo` ; `IMC: 27` ;
`symptomes_glucotoxicite: false` ; `cetonemie: false` ; `hypoglycemie_recente: false` ;
`denutrition: false` ; `infections_uro_genitales_recidivantes: false` ;
**`intolerance_traitement: true`, `nature_intolerance: digestive`** ; `age: 68` ; `fragilite: false` ;
`esperance_vie: intermediaire` ; `risque_hypoglycemie_schema: faible` ; `preference_injection: indifferent` ;
`classes_a_benefice_indisponibles: false`.

**Sortie observée** — `applicable` contient simultanément :
- « **Arrêter le sulfamide (DFG < 30 — contre‑indication rénale)** » (famille « À faire d'emblée —
  sécurité »)
- « **Réduire la posologie du sulfamide / du glinide (tolérance, hypoglycémie légère)** » (même famille)

Les deux familles sont `exclusive: false` (cumulables) : les deux cartes sont affichées **côte à côte**,
toutes deux badgées « Recommandée » (`computeBadges`, `lib/optionBadges.ts:39-44`, famille cumulable →
badge sur tout ce qui est affiché). L'alerte de nœud déclenchée par le même `DFG < 30` dit, mot pour mot :
« Metformine CONTRE‑INDIQUÉE si DFG < 30 (RCP ANSM) : arrêter. […] **Sulfamide aussi CI < 30**. »
(`prescription.yaml:878-882`).

**Pourquoi c'est dangereux.** Le sulfamide est **contre-indiqué** sous DFG 30 (accumulation → hypoglycémie
sévère et prolongée, risque déjà nommé par le nœud lui-même : « Sulfamide CONTRE‑INDIQUÉ en insuffisance
rénale sévère […] : risque d'hypoglycémie sévère et prolongée par accumulation », `prescription.yaml:367`).
Un praticien qui suit la carte « Réduire la posologie » plutôt que « Arrêter » — les deux étant présentées
au même niveau, sans hiérarchie ni renvoi de l'une vers l'autre — **maintient une exposition** à une
molécule que le moteur qualifie par ailleurs, sur la MÊME ligne d'alerte, de contre-indiquée. Ce n'est pas
un défaut de forme : c'est le moteur qui affirme deux choses incompatibles sur le même geste.

**Règle en cause.** `content/noeuds/diabete-type-2/prescription.yaml:716-727` — l'option « Réduire la
posologie du sulfamide / du glinide » ne porte **aucune exclusion sur `DFG`** (`conditions` : présence du
sulfamide/glinide + intolérance ou hypoglycémie récente seulement) contrairement à sa sœur « Réduire la
posologie de la metformine » qui, elle, borne ses deux branches de dose à `DFG >= 30` (`:349`) — seule sa
branche `nature_intolerance == digestive`, indépendante du DFG, y échappe (cf. HAUTE-2).

**Fréquence sur le banc réaliste.** 812 / 1840 profils (44 %) où un sulfamide est en cours et `DFG < 30`
présentent cette co-occurrence — ce n'est pas un cas limite, c'est la majorité des profils insuffisants
rénaux sévères sous sulfamide.

**Correction suggérée.** Ajouter `exclusions: ["DFG < 30"]` à l'option « Réduire la posologie du
sulfamide / du glinide », symétriquement à ce qui existe déjà sur le socle metformine (`:311`) et sur
« Remplacer le sulfamide » (`:633`).

---

### HAUTE-2 — Même défaut sur la metformine (fréquence moindre, mécanisme identique)

**Profil patient** (nœud `prescription`) : `intention: optimiser` ; `traitements_en_cours: [metformine]` ;
`dose_metformine: 500` ; `HbA1c_actuelle: 7.5` ; `position_vs_cible: a_l_objectif` ; `ASCVD_etablie: false` ;
`insuffisance_cardiaque: false` ; **`DFG: 25`** ; `albuminurie: normo` ; `IMC: 25` ;
`symptomes_glucotoxicite: false` ; `cetonemie: false` ; `hypoglycemie_recente: false` ;
`denutrition: false` ; `infections_uro_genitales_recidivantes: false` ;
**`intolerance_traitement: true`, `nature_intolerance: digestive`** ; `age: 70` ; `fragilite: false` ;
`esperance_vie: intermediaire` ; `risque_hypoglycemie_schema: faible` ; `preference_injection: indifferent` ;
`classes_a_benefice_indisponibles: false`.

**Sortie observée** — `applicable` contient simultanément « **Arrêter la metformine (DFG < 30 —
contre‑indication rénale)** » et « **Réduire la posologie de la metformine (fonction rénale altérée ou
intolérance digestive)** », le socle « Metformine — instaurer ou poursuivre » étant lui correctement
écarté (`excluded`, motif `DFG < 30`).

**Pourquoi c'est dangereux.** Même mécanisme que HAUTE-1 : la metformine est **contre-indiquée** (pas
seulement « à réduire ») sous DFG 30 — risque d'acidose lactique par accumulation, que le moteur nomme
lui-même (`prescription.yaml:335`, alerte `:878-882`). La branche qui produit la co-occurrence ici est
précisément celle qui échappe au bornage déjà en place : `nature_intolerance == digestive`
(`prescription.yaml:349`), vraie indépendamment du DFG.

**Règle en cause.** `content/noeuds/diabete-type-2/prescription.yaml:337-359` — la branche intolérance de
« Réduire la posologie de la metformine » n'est pas bornée à `DFG >= 30` alors que les deux branches
« dose vs palier RCP » le sont.

**Fréquence sur le banc réaliste.** 65 / 1840 profils (3,5 %) — plus rare que HAUTE-1 (seule la branche
intolérance digestive y expose, les deux branches de dose étant déjà hors du domaine DFG < 30), mais
non nul et de même nature.

**Correction suggérée.** Ajouter `DFG >= 30` à la branche `nature_intolerance == digestive` de cette
option (ou une `exclusions: ["DFG < 30"]` globale à l'option).

---

### HAUTE-3 — iSGLT2 déjà en place + cétonémie confirmée : aucune option ne propose de le suspendre

**Profil patient** (nœud `prescription`) : `intention: optimiser` ;
**`traitements_en_cours: [metformine, iSGLT2]`** ; `dose_metformine: 1500` ; `HbA1c_actuelle: 7.8` ;
`position_vs_cible: au_dessus` ; `ASCVD_etablie: false` ; `insuffisance_cardiaque: false` ; `DFG: 70` ;
`albuminurie: normo` ; `IMC: 26` ; `symptomes_glucotoxicite: false` ; **`cetonemie: true`** ;
`hypoglycemie_recente: false` ; `denutrition: false` ; `infections_uro_genitales_recidivantes: false` ;
`intolerance_traitement: false` ; `age: 58` ; `fragilite: false` ; `esperance_vie: longue` ;
`risque_hypoglycemie_schema: faible` ; `preference_injection: indifferent` ;
`classes_a_benefice_indisponibles: false`.

**Sortie observée** — `applicable` = [« Metformine — instaurer ou poursuivre », « **Insuline d'initiation
(souvent transitoire — état catabolique)** »]. `alertes` = **[] (aucune alerte affichée)**. L'iSGLT2 n'est
mentionné **nulle part** dans la sortie : ni écarté, ni alerté, ni même cité.

**Pourquoi c'est dangereux.** Une cétonémie positive chez un patient déjà sous iSGLT2 est le tableau
typique de l'**acidocétose euglycémique sous iSGLT2**, complication reconnue (FDA/EMA) dont la conduite
standard est de **suspendre l'inhibiteur SGLT2** sans attendre. Le nœud propose bien d'initier une
insuline (`cetonemie == true` est l'un des déclencheurs de cette option, `prescription.yaml:275`) — mais
rien ne suggère d'arrêter l'agent qui peut être en train d'entretenir l'état catabolique. Le seul rappel
du domaine sur ce risque (« maintenir l'iSGLT2 […], informer du risque d'acidocétose euglycémique —
suspendre en cas de jeûne, de chirurgie ou de maladie aiguë intercurrente ») vit dans un **autre nœud**
(`content/noeuds/diabete-type-2/insuline.yaml:499-503`), non conditionné à une cétonémie **avérée**
(seulement à la présence d'iSGLT2), et n'est de toute façon jamais vu par un praticien qui reste sur le
nœud `prescription`.

Second défaut, dans le même profil : l'alerte censée couvrir la cétonémie
(`quand: "HbA1c_actuelle >= 10 OR symptomes_glucotoxicite == true"`, `prescription.yaml:839-844`,
message : « Contrôler la cétonémie […] ≥ 3 mmol/L → urgence ») **ne teste jamais `cetonemie` elle-même** —
elle s'appuie sur deux proxys (HbA1c très élevée, symptômes de glucotoxicité) qui peuvent être **absents**
dans une acidocétose euglycémique par construction (glycémie proche de la normale). D'où `alertes: []`
dans ce profil alors que `cetonemie == true` est le fait le plus grave qu'il porte.

**Règle en cause.** `content/noeuds/diabete-type-2/prescription.yaml:375-414` (option « Introduire un
iSGLT2 », exclusions `:385-388` ne couvrent que la primo-introduction, jamais un arrêt sur agent déjà en
place) et `:839-844` (alerte qui ne teste pas `cetonemie`). Aucune option du nœud ne porte de condition
`traitements_en_cours contient iSGLT2 AND cetonemie == true`.

**Fréquence sur le banc réaliste.** 459 / 1840 profils (25 %) où `iSGLT2` est en cours et `cetonemie ==
true` ne produisent aucune option d'arrêt/suspension de l'iSGLT2.

**Correction suggérée.** (1) Élargir le `quand` de l'alerte cétonémie à `OR cetonemie == true` pour
qu'elle s'affiche aussi sur cette seule confirmation. (2) Ajouter une option (ou, a minima, une alerte
dédiée, canal R8) « Suspendre l'iSGLT2 — suspicion d'acidocétose euglycémique » déclenchée par
`traitements_en_cours contient iSGLT2 AND cetonemie == true`, distincte de l'alerte générique de
`insuline.yaml` qui ne s'affiche pas sur ce nœud.

---

### HAUTE-4 — Dialyse + maladie cardiovasculaire établie, pas encore sous statine : le patient est présenté comme « à faible risque » ou « en prévention primaire »

**Profil A** (nœud `statine`) : `age: 55`, **`ASCVD_etablie: true`**, `anciennete_diabete_annees: 4`,
`autres_FDRCV: 0`, `diabete_complique: false`, **`dialyse: true`**, `statine_deja_en_place: false`,
`intolerance_statine: false`.
→ **Sortie** : `applicable` = [« **Discuter la statine (décision partagée) — diabète non compliqué à
faible risque absolu** »].

**Profil B** (même nœud) : mêmes `age`/`ASCVD_etablie`/`dialyse`/`statine_deja_en_place`, mais
`anciennete_diabete_annees: 12`, `autres_FDRCV: 3`, `diabete_complique: true`.
→ **Sortie** : `applicable` = [« **Statine (prévention primaire, intensité modérée — haute si risque très
élevé)** »].

**Pourquoi c'est dangereux.** Dans les deux profils, `ASCVD_etablie == true` : le patient a une maladie
cardiovasculaire **établie**, donc relève par définition de la **prévention secondaire**, jamais de la
« prévention primaire » ni d'un « risque absolu faible ». Le mécanisme : l'option « Statine de haute
intensité — prévention secondaire » est correctement **exclue** (`dialyse == true AND
statine_deja_en_place == false`, `statine.yaml:136-137`, exclusion posée le 2026-07-26 pour corriger la
contradiction « ne pas initier » vs « Statine de haute intensité », D21). Mais le nœud est en
`ordered-first-match` (`evaluateOrderedFirstMatch`, `engine/evaluateNode.ts:748-805`) : une option exclue
**ne stoppe pas la boucle**, elle la fait simplement continuer vers l'option suivante dans l'ordre du
nœud — qui n'a, elle, **aucune connaissance du statut ASCVD** de ce patient. Le profil A tombe sur
« Discuter la statine » (conditions : ancienneté < 10, FDRCV = 0, diabète non compliqué — **aucune de ces
trois conditions ne regarde `ASCVD_etablie`**, `statine.yaml:138-152`) dont le texte affiché dit
littéralement « le risque absolu est faible […] » (`:144`) — faux pour ce patient. Le profil B tombe sur
le repli, dont le titre même est « **prévention primaire** » (`:153`) et dont l'intensité est **modérée**
au lieu de la haute intensité normalement due à une ASCVD établie.

L'exclusion posée pour corriger la contradiction repérée en recette (D21) a donc un effet de bord non
vérifié : un patient à très haut risque cardiovasculaire (maladie établie) peut se retrouver, à cause
d'une caractéristique sans rapport avec son risque CV (être dialysé et pas encore sous statine), routé
vers l'option la MOINS agressive du nœud, présentée avec un discours de bas risque. C'est un
sous-traitement potentiel d'un patient en prévention secondaire, produit par un garde-fou de sécurité mal
bordé — exactement le type de « garde-fou contourné » que la mission demande de chercher, sauf qu'ici
c'est le garde-fou lui-même qui, en se retirant, ouvre la voie à une sortie inadaptée plutôt qu'à une
sortie vide.

**Nuance.** L'alerte dialyse (`statine.yaml:181-189`) est correctement affichée dans les deux profils et
explique honnêtement que le bénéfice statine n'est pas démontré sur critères durs en dialyse (4D, AURORA)
— ce n'est donc pas un silence total. Mais rien dans le texte affiché ne rappelle au praticien que
`ASCVD_etablie == true` justifierait, hors dialyse, une intensité haute — le contexte de « prévention
secondaire » disparaît purement et simplement de l'écran.

**Règle en cause.** `content/noeuds/diabete-type-2/statine.yaml:136-137` (exclusion) combinée à l'absence
de tout garde-fou `ASCVD_etablie` dans les conditions des options 2 et 3 (`:138-172`) et au comportement
« continuer après exclusion » de `evaluateOrderedFirstMatch` (`engine/evaluateNode.ts:779` : « Sinon (non
retenue ou exclue) : l'ordre du nœud continue vers l'option suivante »).

**Fréquence sur le banc réaliste.** 360 / 2880 profils (12,5 % du banc `statine` entier) cumulent
`dialyse == true`, `ASCVD_etablie == true`, `statine_deja_en_place == false` — dont 330 tombent sur le
repli « prévention primaire » et 30 sur « Discuter » (faible risque). Ce n'est pas un cas rarissime :
c'est la totalité du croisement dialyse × maladie CV établie × pas encore traité.

**Correction suggérée.** Porter le contexte ASCVD dans le texte de l'option atteinte (au minimum une
mention explicite « ce patient a une maladie cardiovasculaire établie : discuter une statine malgré le
manque de preuve directe en dialyse plutôt que le classer à bas risque ») ou, plus proprement, ajouter une
alerte dédiée `ASCVD_etablie == true AND dialyse == true AND statine_deja_en_place == false` qui restaure
explicitement le contexte perdu par l'exclusion.

---

### MOYENNE-1 — iSGLT2 + infections uro-génitales récidivantes : alerte « ne pas initier » toujours contredite (paire 5, déjà documentée, non corrigée, vérifiée toujours vivante)

**Profil patient** (nœud `prescription`) : `intention: optimiser` ; `traitements_en_cours: []` ;
`HbA1c_actuelle: 7.5` ; `position_vs_cible: au_dessus` ; `ASCVD_etablie: false` ;
**`insuffisance_cardiaque: true`** ; `DFG: 70` ; `albuminurie: normo` ; `IMC: 25` ;
**`infections_uro_genitales_recidivantes: true`** ; reste neutre.

**Sortie observée** : `applicable` contient « Introduire un iSGLT2 (protection cardio‑rénale et/ou
contrôle glycémique) » (badgée « Recommandée », seule option de la famille exclusive « Agent à
ajouter » ici) ; `alertes` contient « iSGLT2 (en cours ou indiqué par la comorbidité) + infections
génito‑urinaires récidivantes : réévaluer l'indication (**ne pas initier** / envisager l'arrêt) […] ».

**Pourquoi c'est un garde-fou faible (pas HAUTE) plutôt qu'un danger direct** : le texte est nuancé
(« réévaluer », pas un ordre binaire) et le risque cité (gangrène de Fournier) est rare mais grave — c'est
la classe MOYENNE (« garde-fou faible ») de la mission, pas une association manifestement délétère.

**Règle en cause.** `prescription.yaml:385-388` (exclusions de l'option iSGLT2 : `DFG < 20`,
`symptomes_glucotoxicite`, `cetonemie` — pas `infections_uro_genitales_recidivantes`) vs `:900-905`
(alerte). C'est exactement la « paire 5 » déjà identifiée par
`docs/decision/validation/chantier-2026-07-26/inventaire-alertes.md` (classée C — « devrait devenir une
alerte d'option »), **non corrigée à ce jour** (vérifié : aucun commit ne l'a touchée depuis). Je ne la
compte pas comme une découverte nouvelle mais je confirme qu'elle est toujours reproductible sur le banc
réaliste : **74 / 1840 profils (4 %)**.

**Correction suggérée** : celle déjà proposée dans l'inventaire — transformer en alerte d'option
(`option.alertes`) sur l'option iSGLT2, ou ajouter l'exclusion si le référent tranche pour un retrait dur.

---

### MOYENNE-2 — Sulfamide et gliptine « à égalité » malgré une alerte qui déconseille explicitement le sulfamide (paire 6, déjà documentée, non corrigée, vérifiée toujours vivante)

**Profil patient** (nœud `prescription`) : naïf de traitement de « place résiduelle » (aucune classe à
bénéfice d'organe en cours ni indiquée) ; **`classes_a_benefice_indisponibles: true`**,
**`risque_hypoglycemie_schema: eleve`**, `age: 78`, reste neutre (pas de comorbidité IC/rénale/ASCVD/
obésité).

**Sortie observée** : `applicable` contient « Gliptine (sitagliptine) — […] » et « Sulfamide (gliclazide
MR ou glimépiride) — […] », **toutes deux au rang 3** (`rangs.get(...) === 3` pour les deux) → même
groupe d'égalité de tête de la famille exclusive « Agent à ajouter » → `computeBadges`
(`lib/optionBadges.ts:47-59`) leur attribue **toutes les deux** le badge « Recommandée ». `alertes`
contient « Risque d'hypoglycémie élevé + place résiduelle : **DÉCONSEILLER le sulfamide**, préférer la
gliptine […] ».

**Pourquoi MOYENNE et pas HAUTE** : le sulfamide reste une option cliniquement utilisée (pas une
contre-indication absolue à ce DFG), et le texte de l'option elle-même porte déjà la réserve
(« Déconseillé chez le sujet à risque d'hypoglycémie élevé […] : préférer la gliptine », `:824`) — c'est
la mise en avant à ÉGALITÉ, pas l'apparition seule, qui pose problème (l'alerte dit explicitement
préférer l'autre, le rang ne le reflète pas).

**Règle en cause.** `prescription.yaml:780-784` (règles de `priorite` de la gliptine) et `:809-813`
(règles identiques pour le sulfamide) ne se différencient jamais sur `risque_hypoglycemie_schema` —
c'est la « paire 6 » de l'inventaire (classée C, non corrigée). Confirmé reproductible : **2 / 1840
profils (rare, condition étroite : aucune comorbidité d'organe + palette épuisée + risque hypo élevé +
`position_vs_cible != sous_objectif`, mais non nul)**.

**Correction suggérée** : ajouter une règle de `priorite` conditionnelle sur le sulfamide
(`quand: risque_hypoglycemie_schema == eleve, rang: 6` par ex.) pour le reléguer derrière la gliptine dans
ce cas précis, symétrique du mécanisme D14 déjà utilisé ailleurs dans ce même nœud (iSGLT2/AR GLP‑1).

---

### BASSE-1 — Gliptine ajoutable sans vérifier l'absence d'insuline (asymétrie de modélisation, pas un danger)

L'option « Gliptine (sitagliptine) — place résiduelle » (`prescription.yaml:767-795`) porte un `prerequis`
`ne_contient_pas gliptine/aGLP1/tirzepatide` mais **pas** `ne_contient_pas insuline`, contrairement à
« Sulfamide (place résiduelle) » qui, elle, porte les deux (`:802-804`). Vérifié : un patient déjà sous
insuline peut se voir proposer d'ajouter une gliptine (profil `traitements_en_cours: [metformine,
insuline]`, `classes_a_benefice_indisponibles: true`, reste neutre → « Gliptine (sitagliptine) »
applicable). Cliniquement, sitagliptine + insuline est une association usuelle et à faible risque (pas
d'hypoglycémie propre à la gliptine) — je ne retiens donc pas ceci comme un danger, seulement comme une
incohérence de modélisation entre deux options traitées différemment sans justification apparente dans le
contenu. Signalé pour mémoire, pas un correctif prioritaire.

---

## Vérifications ciblées qui n'ont RIEN trouvé (pour que l'absence compte)

### Paire 1/2 (inventaire-alertes.md) — sur-basalisation de l'insuline : VÉRIFIÉ CORRIGÉ

Hypothèse testée : le repli « Poursuivre le schéma d'insuline en cours et réévaluer » pourrait encore
s'afficher alors que `over_basalisation == true` et l'objectif n'est pas atteint (la contradiction
originale, « ne pas poursuivre la titration » vs carte « Titrer, +2 U », puis son déplacement documenté
vers le repli après le premier correctif). Deux profils construits à la main, aux bornes du domaine
(`poids: 70`, `dose_basale_actuelle: 40` → ratio 0,571 > 0,5), l'un sans MCG (`mcg_disponible: false`,
`GAJ: 1.5` hors cible), l'autre avec MCG et `profil_glycemique: []` (aucune case cochée, donc ni
« stable » ni aucun signal) : dans les deux cas, **« Ne pas sur-titrer la basale » est applicable**, le
repli n'apparaît jamais. Lecture du code confirme pourquoi : `over_basalisation == true` est un terme `OR`
**indépendant** dans les `conditions` de cette option (`insuline.yaml:293` — troisième disjonct, à côté
des deux branches MCG/GAJ), donc dès que `cible_atteinte == false`, soit « Corriger l'hypoglycémie »
(si TBR/CV/hypo nocturne), soit « Ne pas sur-titrer » (sinon, via ce terme) intercepte systématiquement —
le repli ne peut apparaître que si `cible_atteinte == true`, auquel cas son texte (« objectif atteint »)
est vrai et non contradictoire. Les 26 occurrences relevées par le premier balayage automatique
(heuristique large, non filtrée sur `cible_atteinte`) sont donc des faux positifs de ma propre méthode,
pas un défaut du produit — vérifié en isolant `cible_atteinte` dans le second passage.

### Statine, exclusion dialyse sur l'option haute intensité (paires 3/4) : VÉRIFIÉ CORRIGÉ (mais avec l'effet de bord documenté en HAUTE-4)

La contradiction textuelle originale (« ne pas INITIER » à côté de « Statine de haute intensité ») ne se
reproduit plus : l'exclusion `dialyse == true AND statine_deja_en_place == false`
(`statine.yaml:136-137`) retire bien l'option, et le texte de l'alerte a été reformulé pour ne plus
affirmer d'interdiction sur les deux autres options (« l'option de haute intensité […] n'est plus
proposée » — pas « ne pas initier de statine » en général). Le problème résiduel n'est pas un retour de
la contradiction textuelle, mais un problème différent et plus grave (HAUTE-4).

### Nœud `rhd` : exploré, rien trouvé

Deux options seulement (socle toujours affiché, perte de poids si IMC ≥ 27), aucune `exclusions`
déclarée dans tout le fichier, sélection `multi-options` sans hiérarchie de rang. Le seul risque de
sécurité identifiable (perte de poids sous insuline/sulfamide/glinide → hypoglycémie) est couvert par une
alerte de nœud inconditionnelle (`rhd.yaml:268-272`), sans option concurrente à contredire. Le nœud
« recommande, informe, oriente » (jamais un geste prescriptif direct) : la surface d'un danger direct y
est structurellement faible. Rien trouvé après lecture complète + construction de profils aux extrêmes
(IMC 70 + insuline, IMC 14 + tous les leviers).

### Nœud `cible-glycemique` : exploré, rien trouvé

Nœud `ordered-first-match` à 4 options, aucune `exclusions`, aucun couplage à un autre nœud au niveau du
moteur (R1 déjà appliqué : ne déduit plus rien d'une intention). Aucune option ne prescrit de geste
médicamenteux — seulement une cible chiffrée. Le seul défaut potentiel (l'ancienneté du diabète seule
n'ouvre plus `<= 8 %`) est documenté et assumé par le référent (`incertitudes`, choix conservateur) : ce
n'est pas un danger nouveau, c'est un choix délibéré déjà tracé.

### Balayage générique alerte-prohibitive × option applicable, sur les 5 nœuds (1200 profils/nœud) : pas d'autre couple trouvé au-delà de ceux ci-dessus

Le balayage automatique (mots « ne pas initier », « ne pas poursuivre », « ARRÊTER », « DÉCONSEILLER »,
« contre‑indiqué », « ne jamais » dans une alerte, croisés avec une option applicable nommant la même
classe) ne fait remonter, une fois les faux positifs mécaniques éliminés à la main (ex. « Arrêter la
gliptine redondante » qui EST la correction, pas une contradiction), que les motifs déjà listés ci-dessus.
Sur `cible-glycemique` : 0 alerte prohibitive (aucune `alertes` déclarée). Sur `insuline`, les deux
alertes au vocabulaire prohibitif (« arrêter le sulfamide/glinide à l'introduction de l'insuline »,
réserve rénale) ne contredisent aucune option de CE nœud (le sulfamide/la metformine n'y sont pas des
options).

---

## Zones non couvertes ou couvertes partiellement

- **Interactions médicamenteuses hors du domaine encodé** (ex. metformine + produit de contraste iodé,
  IEC/ARA2 + iSGLT2, anticoagulants) : hors du périmètre de ce qui est modélisé par les 5 nœuds — le nœud
  ne collecte pas ces classes, donc aucune sortie à red-teamer sur ce terrain ; signalé comme angle mort
  structurel plutôt que comme absence de défaut.
- **`genererProfilsPartiels` (profils incomplets, R7/D20)** : non exploré dans cette passe — la mission
  demandait explicitement les profils désormais RÉALISTES et COMPLETS (le nouveau filtre `min`/`max`
  s'applique aux deux générateurs, mais l'indétermination est un axe déjà couvert par la couche
  d'invariants I3 existante, `banc/invariants.test.ts`, que j'ai fait tourner en fin de session — verte).
- **Nœud `insuline`, situations `basale_plus_bolus` et `basal_bolus`** : parcourues par le banc générique
  (aucune violation détectée par mon balayage), mais pas construites à la main profil par profil comme
  `basale_seule` — le temps imparti a privilégié les zones où la lecture du YAML indiquait un risque
  concret (DFG, cétonémie, dialyse) plutôt qu'un balayage exhaustif de toutes les situations.
- **Vue UI réelle (`DecisionNodeScreen.tsx`)** : non ouverte (mission = moteur/contenu, lecture seule) —
  les findings HAUTE-1/2/3/4 sont vérifiés au niveau `evaluateNode`/`construireVueDecision`, pas par
  capture d'écran ; le texte cité est celui que `VueDecision` transmettrait tel quel à l'écran (même
  fonction que celle qui alimente le rendu réel, `lib/vueDecision.ts`).

---

## Décompte

| Sévérité | Nombre | Libellé court |
|---|---|---|
| HAUTE | 4 | Sulfamide DFG<30 « réduire » vs « arrêter » (44 % du sous-groupe concerné) · Metformine idem (3,5 %) · iSGLT2 en place + cétonémie sans option d'arrêt (25 %) · Dialyse+ASCVD → mislabel bas risque/prévention primaire (12,5 % du banc statine) |
| MOYENNE | 2 | iSGLT2 + infections uro (paire 5, déjà documentée, toujours vivante, 4 %) · Sulfamide/gliptine ex-aequo malgré alerte hypo (paire 6, déjà documentée, toujours vivante, rare) |
| BASSE | 1 | Gliptine ajoutable sans vérifier l'absence d'insuline (asymétrie de modélisation, pas un danger) |

**Les 4 HAUTE sont des découvertes de cette session** (aucune ne figure dans
`inventaire-alertes.md`/D21) — trois sont rendues visibles par le croisement de deux critères numériques
désormais bornés de façon réaliste (`DFG`, `dialyse`+`ASCVD_etablie`) que l'ancien banc, produisant des
DFG négatifs ou à 2000, ne pouvait pas isoler proprement de son bruit. Les 2 MOYENNE sont les deux paires
de l'inventaire du 2026-07-25 **non corrigées** à ce jour (sur les 6 initiales, 4 ont été effectivement
corrigées — vérifié dans « Vérifications ciblées qui n'ont rien trouvé » ci-dessus) ; je les revérifie
comme demandé et confirme qu'elles n'ont pas empiré ni changé de forme.

## Verdict

**Pas encore sûr à mettre entre les mains d'un généraliste sans supervision, à cause des HAUTE-1/2/3** :
ce sont des scénarios fréquents (insuffisance rénale sévère chez un patient déjà sous sulfamide ou
metformine — 44 % et 3,5 % du sous-groupe concerné ; iSGLT2 largement prescrit + surveillance de la
cétonémie de plus en plus répandue — 25 %), pas des cas d'école, et ils produisent des cartes qui
**affirment simultanément deux choses incompatibles** sur le même geste ou **taisent** un geste de
sécurité que le nœud connaît par ailleurs (le suspendre l'iSGLT2, documenté... dans un autre nœud). Un
généraliste pressé qui lit la carte la plus rassurante (« réduire » plutôt que « arrêter », ou qui ne voit
tout simplement aucune carte suggérant de suspendre l'iSGLT2) suivrait une conduite non sécurisée sans
qu'aucun signal ne l'alerte du choix à trancher entre les deux cartes. HAUTE-4 est plus insidieux (le patient reçoit quand même une statine, juste sous-dosée et
mal qualifiée) mais touche 12,5 % d'un sous-groupe à haut risque cardiovasculaire réel.

Les correctifs sont chacun **locaux et de faible risque de régression** (une `exclusions` ou une borne
`DFG` de plus sur 2-3 options, une option ou alerte supplémentaire pour HAUTE-3, une reformulation/alerte
pour HAUTE-4) — rien qui touche le moteur ni remette en cause les 468 tests existants. Le reste du module
(cible glycémique, RHD, la très large majorité du nœud `prescription` et du nœud `insuline`, les 4 paires
de l'inventaire déjà corrigées) tient bien à l'épreuve d'un banc réaliste : la structure d'exclusions/
garde-fous du moteur (D13/D20/D21) fonctionne comme conçue partout où elle a été appliquée avec la même
rigueur qu'aux endroits déjà audités par la recette du 2026-07-25.
