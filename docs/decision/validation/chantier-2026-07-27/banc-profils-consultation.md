# Banc de profils de consultation — module Décision, domaine DT2

**Objet.** Une liste de situations cliniques à rejouer à l'écran, dans le navigateur,
contre l'outil réel. Le banc est fait pour être exécuté **tel quel**, plusieurs fois,
après chaque lot — pas pour être lu une fois.

**État au moment de l'écriture (2026-07-27).** L'outil est en cours de modification par
un autre agent. Le banc est donc écrit pour **survivre au remaniement** : il désigne les
champs par leur **libellé affiché à l'écran**, jamais par un nom de variable ni un
chemin de code, et il ne suppose aucune structure de résultat particulière. Si un
libellé change, seul le tableau de correspondance du §2 est à mettre à jour.

**Ce que le banc ne fait pas.** Il ne fixe pas de « bonne réponse » clinique. Je ne suis
pas compétent pour décider qu'une carte devrait ou ne devrait pas sortir. Le banc
contrôle donc deux choses seulement :

1. des **invariants de cohérence** (§3), vérifiables sans jugement médical — un écran
   qui se contredit lui-même, réclame l'impossible, ou cache quelque chose ;
2. des **questions cliniques** (repérées `?REF`), que le profil fait remonter et qui
   sont **rendues au référent médical**, sans arbitrage de ma part.

---

## 1. Comment exécuter le banc

### Navigation

Il n'y a ni routeur ni URL (décision D9) : on atteint un nœud par
**Accueil → Décision → Diabète de type 2 → *nœud***. Les deux nœuds RHD passent par un
sous-menu **Règles hygiéno-diététiques**.

### Remise à zéro entre deux profils — impérative

**Sortir du nœud (« ← Domaine : Diabète de type 2 ») puis y revenir.** Le composant est
remonté, le formulaire repart vierge. Recharger la page renvoie à l'accueil et efface
tout. Ne jamais enchaîner deux profils sans ce passage : les valeurs du précédent
subsistent et faussent tout.

### Deux pièges de manipulation, vérifiés à mes dépens

- **Ne pas enchaîner plusieurs clics dans un même bloc de script.** React groupe les
  mises à jour et les sélections atterrissent sur la mauvaise valeur (constaté : un
  profil « Optimiser + Au-dessus » s'est retrouvé sur « Initier + À l'objectif »).
  Cliquer un par un, ou espacer les clics d'au moins ~60 ms.
- **Relire l'état du formulaire avant de conclure.** Les champs apparaissent et
  disparaissent selon les réponses déjà données : un repère de champ capturé avant une
  case cochée peut désigner un autre champ après. Constaté : trois valeurs destinées à
  « Glycémie à jeun / Poids / Dose de basale » ont atterri dans « TBR / TBR sévère /
  Coefficient de variation ». **Toujours relever la liste champ = valeur avant de lire
  le résultat**, et la recopier dans la feuille de relevé.

### Feuille de relevé

Pour chaque profil, noter : les champs réellement saisis (relus à l'écran), les cartes
affichées avec leur badge, le contenu du bloc « en attente », le compteur « Reco
provisoire — N critères… », les alertes, et le verdict sur chaque invariant du §3.
Gabarit en §8.

---

## 2. Inventaire des champs, par nœud

Relevé à l'écran le 2026-07-27. **À revalider après le lot en cours.**

### A — Fixer la cible d'HbA1c
| Champ | Type | Valeurs |
|---|---|---|
| Âge | nombre | 18–105 |
| Ancienneté du diabète (ans) | nombre | |
| Espérance de vie | choix | Longue · Intermédiaire · Limitée |
| Fragilité | case | |
| Antécédent cardiovasculaire | case | |
| Comorbidité grave | case | |

### B — Traiter : initier, optimiser, intensifier
| Champ | Type | Valeurs |
|---|---|---|
| Intention thérapeutique | choix | Initier · Intensifier · Optimiser · Déprescrire |
| Traitements en cours | 8 cases | Metformine · iSGLT2 · AR GLP-1 · Tirzépatide · Sulfamide · Gliptine · Insuline · Glinide |
| Dose metformine | nombre | |
| HbA1c actuelle (%) | nombre | 4–18 |
| Par rapport à l'objectif | choix | À l'objectif · Au-dessus · Nettement au-dessus · En dessous (sur-traitement probable) |
| Maladie cardiovasculaire athéromateuse établie | case | |
| Insuffisance cardiaque | case | |
| DFG (mL/min/1,73 m²) | nombre | 3–150 |
| Albuminurie | choix | Normo · Micro · Macro |
| IMC (kg/m²) | nombre | |
| Symptômes de glucotoxicité | case | |
| Cétonémie | case | |
| Hypoglycémie récente | case | |
| Dénutrition / carence | case | |
| Infections génito-urinaires récidivantes | case | |
| Intolérance à un traitement en cours | case | |
| Âge · Fragilité · Espérance de vie · Risque hypoglycémique du schéma | nombre / case / choix / choix | Longue·Intermédiaire·Limitée / Faible·Élevé |
| Préférence vis-à-vis de l'injectable | choix | Indifférent · Accepte · Refuse |
| iSGLT2 et AR GLP-1 tous deux inutilisables | case | |

> « Traitements en cours », « Hypoglycémie récente » et « Intolérance à un traitement »
> **disparaissent** quand l'intention est « Initier ».

### C — Insulinothérapie du DT2
| Champ | Type | Valeurs |
|---|---|---|
| Situation d'insulinothérapie | choix | Naïf d'insuline · Basale seule · Basal-plus / bolus · Basal-bolus |
| Âge · HbA1c actuelle · HbA1c cible · DFG | nombres | 18–105 / 4–18 / 6–9,5 / 3–150 |
| Fragilité · Hypoglycémies sévères récurrentes / non-perception · Symptômes de glucotoxicité | cases | |
| Espérance de vie · Risque hypoglycémique du schéma · Préférence injectable | choix | |
| Traitements en cours | 9 cases | … · Insuline basale · Insuline rapide |
| MCG disponible | case | |
| TBR (<70) · TBR sévère (<54) · Coefficient de variation | nombres | 0–100 |
| Profil glycémique (AGP) | cases | Hypoglycémie nocturne · Phénomène de l'aube · Excursions post-prandiales · Stable · Hypo interprandiale |
| Glycémie à jeun (g/L) · Poids (kg) · Dose de basale (U/j) · Dose de rapide (U/j) | nombres | 0,4–5 / 35–250 / 0–150 / |

> Le bloc MCG + doses **disparaît** sur « Naïf d'insuline ». « Hypo interprandiale » et
> « Dose de rapide » n'apparaissent que dans les schémas comportant un bolus.

### D — Prescrire une statine dans le DT2
| Champ | Type | Valeurs |
|---|---|---|
| Âge · Ancienneté du diabète · Autres facteurs de risque cardiovasculaire | nombres | |
| Maladie cardiovasculaire athéromateuse établie · Diabète compliqué · Dialyse · Statine deja en place | cases | |
| Intolérance aux statines | choix | Non · Rapportee · Averee |
| CK, en multiples de la normale (0 = non dosé) | nombre | *n'apparaît que si intolérance ≠ Non* |

### E — RHD, Alimentation
Terrain : Fragilité, Traitements en cours (8 cases).
| Champ | Valeurs |
|---|---|
| Frequence boissons sucrees / ultratransformes / restauration rapide / grignotage | Jamais · Occasionnel · Frequent · Quotidien |
| Matiere grasse cuisson | Beurre graisses animales · Melange · Huile olive ou colza |
| Regularite repas | Reguliers · Irreguliers |
| Acces alimentation | Sans difficulte · Quelques difficultes · Difficultes importantes |
| Frequence fruits a coque / legumineuses / poisson | Jamais · Occasionnel · Regulier |
| Frequence viande rouge charcuterie | Jamais · Occasionnel · Regulier · Quotidien |
| Signe restriction puis craquage · Signe manger cache ou culpabilite · Signe antecedent regime restrictif | cases |
| Difficulte estimation portions | Facile · Difficile · Ne sait pas |
| Alimentation emotionnelle | Jamais · Occasionnel · Frequent |
| Consommation vin | Jamais · Occasionnel · Un a six verres semaine · Sept verres ou plus semaine |

### F — RHD, Activité physique
| Champ | Valeurs |
|---|---|
| Frequence activite structuree | Jamais · Une fois semaine · Deux a trois fois semaine · Quatre fois ou plus semaine |
| Duree seance | Moins 10 min · Dix a trente min · Plus 30 min |
| Mode deplacement courts trajets | Actif pied ou velo · Motorise ou assis · Mixte |
| Temps assis quotidien | Moins 4h · Quatre a huit h · Plus 8h |
| Fragilité · Rupture sedentarite habituelle · Limitation physique connue · Symptomes ischemie effort · Retinopathie non stabilisee ou proliferante · Neuropathie ou mal perforant plantaire · Difficulte acces activite · Offre proximite connue · Experience activite negative | cases |
| Traitements en cours | 8 cases |

---

## 3. Grille d'invariants — appliquée à CHAQUE profil

Ces dix contrôles ne demandent aucun jugement clinique. Un manquement est un défaut,
quelle que soit la justesse médicale du contenu.

| # | Invariant | Comment le constater |
|---|---|---|
| **I1** | **Tout critère réclamé est saisissable à l'écran.** | Prendre chaque nom de critère cité dans le bloc « en attente » et le chercher dans le formulaire au-dessus. Aucun ne doit manquer. |
| **I2** | **Aucune carte ne contredit une donnée saisie.** | Une carte « poursuivre le traitement en cours » chez un patient sans traitement ; « réévaluer, objectif atteint » alors que « Au-dessus de l'objectif » est déclaré ; un geste sur l'insuline chez un naïf. |
| **I3** | **Rien n'est replié.** | Aucun bouton du type « Autres pistes possibles (N) ». Toutes les cartes applicables visibles sans action. |
| **I4** | **Le compteur « N critères décisifs non confirmés » est résoluble.** | Compter les repères « · à confirmer » + les boutons « Rien à signaler » restants. Si le compteur est > 0 et qu'aucun repère ni bouton ne subsiste, le praticien est bloqué sans savoir sur quoi. |
| **I5** | **Chaque option du nœud est dans exactement une zone.** | Cartes proposées + bloc « en attente » + panneau « Pourquoi pas d'autres options ? » doivent couvrir l'inventaire complet du nœud, sans doublon ni disparition. |
| **I6** | **Les valeurs aberrantes et les combinaisons impossibles sont refusées ou signalées.** | Bornes des champs nombre ; et surtout les incohérences **entre** champs (voir §7). |
| **I7** | **Les libellés affichés sont du français rédigé.** | Pas d'identifiant brut, accents présents. *Écart connu : les deux nœuds RHD affichent « Frequence boissons sucrees », « Regularite repas », « Melange », « Un a six verres semaine »… ; `statine` affiche « Statine deja en place », « Rapportee », « Averee ».* |
| **I8** | **Les doses calculées correspondent aux valeurs saisies.** | Recalculer à la main (0,1 et 0,2 U/kg ; bolus ≈ 10 % de la basale ; basale −20 %). Si une dose n'est pas calculable, la carte doit le **dire** plutôt que se taire. |
| **I9** | **Le « pourquoi » d'une carte ne cite que des faits vrais chez ce patient.** | Lire « Proposé parce que… » et « Ce rang tient compte de… » : chaque terme cité doit correspondre à une valeur réellement saisie. *Point de vigilance : « Ce rang tient compte de : Maladie cardiovasculaire établie **ou** IMC ≥ 30 » s'affiche même quand la maladie cardiovasculaire est déclarée absente.* |
| **I10** | **Une carte de sécurité est atteignable sans manœuvre.** | Profils L1, L2, F4, H3 : la carte de sécurité doit être visible d'emblée, en haut, sans dépliage. |

**Contrôle de rang, à part** : noter **dans quel ordre** les cartes apparaissent et
**combien de défilements** séparent la première carte de la première carte cohérente
avec l'intention déclarée. *Mesure faite le 2026-07-27 sur le profil G1 : 1,5 écran
avant le premier geste de désintensification, alors que l'intention saisie était
« Déprescrire ».*

---

## 4. Profils courants — la consultation de tous les jours

> But : vérifier que l'outil est utilisable et juste sur ce qui représente l'essentiel
> de l'activité. Un défaut ici coûte plus cher que dix défauts sur un cas rare.

### C1 — Découverte de DT2, patient jeune, sans comorbidité
**Nœud B.** Homme 52 ans, DT2 découvert sur bilan, aucun traitement, IMC 32.
`Intention = Initier un traitement` · `HbA1c actuelle = 7,9` · `Par rapport à l'objectif
= Au-dessus de l'objectif` · `DFG = 90` · `Albuminurie = Normoalbuminurie` · `IMC = 32`
· tous les signaux d'alerte : **Rien à signaler**.
→ *Contrôles* : I1, **I2** (aucune carte ne doit parler de « poursuivre le traitement en
cours » : le patient n'en a aucun, et le champ n'est même pas affiché), I5, I9.
**Anomalie déjà constatée sur ce profil (variante `IMC = 27`, `DFG = 88`, `HbA1c 8,1`) :
la carte « Poursuivre le traitement en cours et réévaluer » sort avec le badge
« Recommandée », et son argumentaire affirme « objectif atteint » alors que
« Au-dessus de l'objectif » vient d'être saisi. À rejouer en priorité.**

### C2 — Le même, à IMC normal
**Nœud B.** Femme 49 ans, IMC 24, reste identique à C1.
→ *Contrôles* : I2, I5. Fait varier le seul IMC pour isoler ce qui déclenche les
incrétines.

### C3 — Intensification banale sous metformine seule
**Nœud B.** Homme 61 ans, metformine 2 000 mg, HbA1c 8,5, aucune comorbidité.
`Intention = Intensifier` · `Traitements = Metformine` · `Dose metformine = 2000` ·
`HbA1c = 8,5` · `Au-dessus de l'objectif` · `DFG = 80` · `Normoalbuminurie` · `IMC = 27`
· **Rien à signaler** partout.
→ *Contrôles* : I3, I5, **contrôle de rang**. C'est le profil de mesure de densité :
noter le **nombre de cartes** et la **hauteur de chacune en écrans**.
*Relevé 2026-07-27 : 5 cartes, 0,7 à 1,1 écran pièce en fenêtre étroite, page totale
8,5 écrans.*

### C4 — Coronarien sous metformine
**Nœud B.** Homme 66 ans, IDM il y a 3 ans, metformine, HbA1c 7,8.
`Intention = Intensifier` · `Metformine` · `Dose = 2000` · `HbA1c = 7,8` · `Au-dessus` ·
`Maladie cardiovasculaire athéromateuse établie` · `DFG = 72` · `Normoalbuminurie` ·
`IMC = 28` · **Rien à signaler**.
→ *Contrôles* : I9 (le « pourquoi » doit citer la maladie athéromateuse, réellement
présente), I5.

### C5 — Prévention primaire, la question statine la plus fréquente
**Nœud D.** Femme 55 ans, DT2 depuis 6 ans, HTA traitée (= 1 autre facteur de risque),
pas d'atteinte d'organe.
`Âge = 55` · `Maladie cardiovasculaire établie = non` · `Ancienneté = 6` · `Autres
facteurs de risque = 1` · `Diabète compliqué = non` · `Dialyse = non` · `Statine deja en
place = non` · `Intolérance = Non`.
→ *Contrôles* : I4, I9.
`?REF` **Question au référent** : sur ce profil, l'outil recommande une statine dont le
seul motif affiché est « **Option par défaut** : retenue en l'absence de toute autre
option plus spécifique applicable ». L'option « Discuter la statine (décision partagée) »
n'apparaît qu'avec **zéro** autre facteur de risque. Est-ce le seuil voulu, et
« option par défaut » est-il une justification acceptable pour un traitement à vie ?

### C6 — Prévention secondaire, statine
**Nœud D.** Homme 62 ans, coronaropathie, pas d'intolérance.
`Âge = 62` · `Maladie cardiovasculaire établie = oui` · `Ancienneté = 8` · `Autres
facteurs = 2` · `Diabète compliqué = non` · `Dialyse = non` · `Statine deja en place =
non` · `Intolérance = Non`.
→ *Contrôles* : I1 (aucun champ CK ne doit apparaître tant que l'intolérance est
« Non »), I2. **C'est le profil du défaut de production corrigé au lot 1 : à rejouer
après chaque lot.**

### C7 — Fixer la cible chez l'adulte d'âge moyen
**Nœud A.** Homme 68 ans, DT2 depuis 12 ans, autonome, pas d'antécédent cardiovasculaire.
`Âge = 68` · `Ancienneté = 12` · `Espérance de vie = Longue` · **Rien à signaler**.
→ *Contrôles* : I4, I9.
`?REF` **Question au référent** : `Âge` et `Ancienneté du diabète` sont saisis et
affichés « sans effet sur la reco actuelle » ; **aucune option du nœud n'utilise l'âge**.
Par ailleurs la légende « Suggestion auto (âge, fragilité, comorbidité grave, antécédent
CV) — à valider » est affichée sous « Espérance de vie » **mais aucune suggestion n'est
jamais produite** : les trois choix restent éteints quel que soit le remplissage.

### C8 — Cible chez le coronarien
**Nœud A.** Même patient que C7, mais `Antécédent cardiovasculaire = oui`.
→ `?REF` : ce seul critère fait passer la cible de ≤ 7 % à **≤ 8 %**, au motif d'ACCORD.
Est-ce l'intention, pour un patient de 68 ans par ailleurs autonome et à espérance de vie
longue ?

### C9 — Initiation d'insuline basale
**Nœud C.** Homme 60 ans, naïf d'insuline, HbA1c 9 malgré trithérapie orale.
`Situation = Naïf d'insuline` · `Âge = 60` · `HbA1c = 9` · `HbA1c cible = 7` ·
`DFG = 80` · `Metformine` · **poids laissé vide dans un premier temps**, puis
`Poids = 82`.
→ *Contrôles* : **I8** (sans poids, la carte doit annoncer « Doses non calculées … à
renseigner : Poids » ; avec poids, 0,1 U/kg ≈ 8 U/j et 0,2 U/kg ≈ 16 U/j), I1.

### C10 — Sur-basalisation, sans capteur
**Nœud C.** Homme 64 ans, glargine 60 U/j, poids 95 kg, HbA1c 8,4, glycémies du matin
correctes, **pas de MCG**.
`Situation = Basale seule` · `Âge = 64` · `HbA1c = 8,4` · `HbA1c cible = 7` · `DFG = 70` ·
`Espérance de vie = Longue` · `Risque hypoglycémique = Faible` · `Metformine` +
`Insuline basale` · `MCG disponible = non` · `Glycémie à jeun = 1,05` · `Poids = 95` ·
`Dose de basale = 60`.
→ *Contrôles* : **I1**, I8.
**Anomalie déjà constatée : deux options restent en permanence « en attente » de `TBR`,
`TBR sévère` et `Coefficient de variation` — trois mesures qu'un patient sans capteur ne
peut pas fournir. Le bloc ambre ne peut jamais être résolu, et le compteur « Reco
provisoire » ne retombe jamais à zéro.** À rejouer en priorité.

### C11 — Alimentation, le recueil bref
**Nœud E.** Patient sous metformine, boissons sucrées quotidiennes, plats industriels
fréquents, repas irréguliers, grignotage.
`Metformine` · `boissons sucrees = Quotidien` · `ultratransformes = Frequent` ·
`restauration rapide = Occasionnel` · `Matiere grasse = Melange` · `Regularite repas =
Irreguliers` · `grignotage = Frequent` · `Acces alimentation = Sans difficulte` ·
`fruits a coque = Jamais` · `legumineuses = Occasionnel` · `poisson = Occasionnel` ·
`viande rouge charcuterie = Regulier` · repérage : **Rien à signaler** · `portions =
Facile` · `Alimentation emotionnelle = Jamais` · `vin = Un a six verres semaine`.
→ *Contrôles* : **I7** (libellés sans accents), **contrôle de rang**.
**Anomalie déjà constatée : 10 cartes s'affichent, les 10 badgées « Recommandée », sans
aucune priorisation** — alors que le chapô du nœud annonce un recueil bref et des pistes
« négociables ». `?REF` : combien de pistes un praticien peut-il proposer en une
consultation, et laquelle en premier ?

### C12 — Activité physique, patient sédentaire sans limitation
**Nœud F.** Employé de bureau, 8 h assis, aucun sport, trajets motorisés.
`Frequence activite structuree = Jamais` · `Duree seance = Moins 10 min` · `Mode
deplacement = Motorise ou assis` · `Temps assis = Plus 8h` · toutes les cases de
limitation : **Rien à signaler**.
→ *Contrôles* : I5, I7, contrôle de rang.

---

## 5. Profils complexes — versant fragilité

> But : le terrain où une recommandation d'ajout mal placée fait le plus de dégâts.

### G1 — Sur-traitement du sujet âgé, motif « déprescrire »
**Nœud B.** Femme 82 ans, fragile, metformine + gliclazide, HbA1c 6,3, malaise
hypoglycémique la semaine passée.
`Intention = Déprescrire` · `Metformine` + `Sulfamide` · `HbA1c = 6,3` · `En dessous de
l'objectif (sur-traitement probable)` · `DFG = 50` · `Normoalbuminurie` · `IMC = 24` ·
`Hypoglycémie récente = oui` · `Âge = 82` · `Fragilité = oui`.
→ *Contrôles* : **contrôle de rang**, I2, I9.
**Anomalie déjà constatée : les deux premières cartes proposées sont « Introduire un
iSGLT2 » (badge « Recommandée ») et « Introduire un AR GLP-1 » ; il faut défiler
1,5 écran pour atteindre le premier geste de désintensification.** Le nœud affiche bien
un avertissement expliquant qu'un geste d'ajout peut apparaître malgré l'intention —
mais il est placé **avant** les cartes, et l'ordre reste inchangé.
`?REF` : chez une patiente de 82 ans fragile en hypoglycémie, l'ajout d'un iSGLT2 pour
un DFG à 50 sans albuminurie est-il l'intention ?

### G2 — Sujet très âgé, espérance de vie limitée
**Nœud A.** Femme 89 ans, EHPAD, démence évoluée.
`Âge = 89` · `Ancienneté = 20` · `Espérance de vie = Limitée` · `Fragilité = oui` ·
`Comorbidité grave = oui`.
→ *Contrôles* : I5.
**Point de forme relevé : le panneau « Pourquoi pas d'autres options ? » affiche une
condition d'exclusion qui, une fois satisfaite, ne produit pas l'option annoncée.**
Espérance limitée **seule** → cible ≤ 8 % ; espérance limitée **+ fragilité** → cible
< 9 %. Or le panneau annonçait « Cible < 9 % : Espérance de vie = Limitée ». À rejouer :
poser `Espérance = Limitée` **sans** fragilité, lire le panneau, puis cocher `Fragilité`.

### G3 — Dénutrition chez le sujet fragile sous incrétine
**Nœud B.** Homme 79 ans, IMC 21, perte de poids récente, metformine + sémaglutide,
HbA1c 7,6.
`Intention = Optimiser` · `Metformine` + `AR GLP-1` · `HbA1c = 7,6` · `Au-dessus` ·
`DFG = 55` · `Normoalbuminurie` · `IMC = 21` · `Dénutrition / carence = oui` ·
`Âge = 79` · `Fragilité = oui` · `Espérance de vie = Intermédiaire`.
→ *Contrôles* : **I10** (le garde-fou terrain « ne pas initier si IMC < 22 / dénutrition »
doit être visible sans dépliage), I2 (aucune carte ne doit proposer de **poursuivre** ou
**renforcer** l'incrétine sans porter l'alerte), I9.

### G4 — Insuffisance rénale sévère chez le sujet âgé
**Nœud B.** Femme 85 ans, DFG 26, metformine + gliclazide toujours prescrits, HbA1c 7,9.
`Intention = Optimiser` · `Metformine` + `Sulfamide` · `Dose metformine = 1700` ·
`HbA1c = 7,9` · `Au-dessus` · `DFG = 26` · `Microalbuminurie` · `IMC = 23` · `Âge = 85` ·
`Fragilité = oui`.
→ *Contrôles* : **I10** (metformine contre-indiquée sous 30, sulfamide de même : les
cartes d'arrêt doivent être en tête et visibles), **I2** (aucune carte ne doit proposer
d'ajouter un agent contre-indiqué à ce DFG), I5.

### G5 — Hypoglycémies sévères sous basal-bolus chez le sujet âgé
**Nœud C.** Homme 84 ans, basal-bolus depuis 6 ans, deux hypoglycémies sévères en
3 mois, non-perception des hypoglycémies, HbA1c 6,8.
`Situation = Basal-bolus` · `Âge = 84` · `HbA1c = 6,8` · `HbA1c cible = 8` · `DFG = 45` ·
`Fragilité = oui` · `Hypoglycémies sévères récurrentes / non-perception = oui` ·
`Espérance de vie = Limitée` · `Risque hypoglycémique = Élevé` · `Insuline basale` +
`Insuline rapide` · `MCG disponible = non` · `Glycémie à jeun = 0,80` · `Poids = 62` ·
`Dose de basale = 32` · `Dose de rapide = 18`.
→ *Contrôles* : **I10**, **I2** (aucune carte d'intensification ne doit sortir),
**I1** (si des mesures de capteur sont réclamées alors qu'il n'y a pas de capteur, c'est
l'anomalie de C10 qui se répète sur un terrain plus dangereux), I8.

### G6 — Fragilité + refus de l'injectable
**Nœud B.** Femme 80 ans, fragile, refuse toute injection, metformine seule, HbA1c 8,6.
`Intention = Intensifier` · `Metformine` · `HbA1c = 8,6` · `Nettement au-dessus` ·
`DFG = 58` · `Normoalbuminurie` · `IMC = 26` · `Âge = 80` · `Fragilité = oui` ·
`Risque hypoglycémique = Élevé` · `Préférence vis-à-vis de l'injectable = Refuse`.
→ *Contrôles* : I2 (les options injectables doivent être écartées et **dites** écartées,
pas silencieusement absentes — cf. I5), I5.

### G7 — Statine chez le sujet âgé dialysé
**Nœud D.** Homme 76 ans, dialysé depuis 2 ans, pas de statine en cours, coronarien.
`Âge = 76` · `Maladie cardiovasculaire établie = oui` · `Ancienneté = 18` · `Autres
facteurs = 3` · `Diabète compliqué = oui` · `Dialyse = oui` · `Statine deja en place =
non` · `Intolérance = Non`.
→ *Contrôles* : **I10** et **I2** — c'est la configuration que le lot du 2026-07-26 dit
avoir corrigée sur ce nœud (« l'alerte interdisait ce que rien ne retirait »). Vérifier
qu'aucune carte ne **prescrit** une statine que l'alerte interdit d'initier.

### G8 — Activité physique chez le sujet fragile à risque podologique
**Nœud F.** Femme 78 ans, neuropathie avec mal perforant cicatrisé, rétinopathie
proliférante non stabilisée, sédentaire.
`Frequence activite structuree = Jamais` · `Duree seance = Moins 10 min` · `Mode
deplacement = Motorise ou assis` · `Temps assis = Plus 8h` · `Fragilité = oui` ·
`Neuropathie ou mal perforant plantaire = oui` · `Retinopathie non stabilisee ou
proliferante = oui` · `Limitation physique connue = oui`.
→ *Contrôles* : **I10** (les contre-indications à l'effort doivent être visibles
d'emblée), I2 (aucune carte ne doit proposer une activité que les cases déclarées
contre-indiquent).

---

## 6. Profils complexes — difficiles à équilibrer

> But : les situations où plusieurs contraintes se contredisent et où l'outil doit
> arbitrer — ou dire qu'il ne peut pas.

### H1 — Échec de la trithérapie orale
**Nœud B.** Homme 57 ans, metformine + sitagliptine + gliclazide à doses maximales,
HbA1c 10,2, pas de comorbidité, accepte les injections.
`Intention = Intensifier` · `Metformine` + `Gliptine` + `Sulfamide` · `Dose metformine =
3000` · `HbA1c = 10,2` · `Nettement au-dessus de l'objectif` · `DFG = 85` ·
`Normoalbuminurie` · `IMC = 31` · `Âge = 57` · `Préférence injectable = Accepte`.
→ *Contrôles* : I5 (à ce niveau d'HbA1c, l'insuline et les incrétines doivent toutes
figurer quelque part — proposées ou écartées, jamais absentes), I9,
**contrôle de rang**.

### H2 — Obésité sévère et refus catégorique de l'injectable
**Nœud B.** Femme 46 ans, IMC 41, HbA1c 9,4, metformine seule, refuse toute injection.
`Intention = Intensifier` · `Metformine` · `HbA1c = 9,4` · `Nettement au-dessus` ·
`DFG = 95` · `Normoalbuminurie` · `IMC = 41` · `Âge = 46` · `Préférence injectable =
Refuse`.
→ *Contrôles* : I2, I5. Le refus doit fermer les injectables **explicitement** ; l'écran
ne doit pas se retrouver sans aucune proposition sans le dire.

### H3 — Tout est contre-indiqué
**Nœud B.** Homme 72 ans, insuffisance cardiaque NYHA III, DFG 22, macroalbuminurie,
antécédent de gangrène de Fournier, infections urinaires récidivantes, HbA1c 8,8,
metformine + gliptine.
`Intention = Intensifier` · `Metformine` + `Gliptine` · `HbA1c = 8,8` · `Au-dessus` ·
`Maladie cardiovasculaire établie = oui` · `Insuffisance cardiaque = oui` · `DFG = 22` ·
`Macroalbuminurie` · `IMC = 29` · `Infections génito-urinaires récidivantes = oui` ·
`Âge = 72`.
→ *Contrôles* : **I10**, **I5** (chaque exclusion doit être **nommée** : c'est le profil
qui teste si « écarté » est distingué de « non indiqué »), I2 (la metformine doit être
retirée à ce DFG, pas seulement assortie d'une alerte).

### H4 — Basal-bolus à forte dose, mal équilibré et instable
**Nœud C.** Femme 55 ans, basal-bolus 78 + 42 U/j, poids 108 kg, HbA1c 9,1, capteur en
place montrant une forte variabilité et des hypoglycémies nocturnes.
`Situation = Basal-bolus` · `Âge = 55` · `HbA1c = 9,1` · `HbA1c cible = 7,5` ·
`DFG = 78` · `Espérance de vie = Longue` · `Risque hypoglycémique = Élevé` ·
`Metformine` + `Insuline basale` + `Insuline rapide` · `MCG disponible = oui` ·
`TBR = 6` · `TBR sévère = 2` · `Coefficient de variation = 42` · `Profil glycémique =
Hypoglycémie nocturne` **et** `Excursions post-prandiales` · `Glycémie à jeun = 1,90` ·
`Poids = 108` · `Dose de basale = 78` · `Dose de rapide = 42`.
→ *Contrôles* : **I8** (vérifier chaque dose calculée à la main), I2 (une HbA1c à 9,1
avec hypoglycémies nocturnes : aucune carte ne doit proposer d'augmenter la basale sans
traiter d'abord l'hypoglycémie), I5, **contrôle de rang**.

### H5 — Intolérance avérée aux statines en prévention secondaire
**Nœud D.** Homme 64 ans, coronarien, myalgies invalidantes sous deux statines
différentes, CK à 3 fois la normale.
`Âge = 64` · `Maladie cardiovasculaire établie = oui` · `Ancienneté = 11` · `Autres
facteurs = 2` · `Diabète compliqué = oui` · `Dialyse = non` · `Statine deja en place =
non` · `Intolérance = Averee` · `CK = 3`.
→ *Contrôles* : **I2** (aucune carte ne doit prescrire une statine que le dossier
déclare impossible), I5, I9. Puis rejouer avec `CK = 4,5`, `CK = 6`, `CK = 12`,
`CK = 60` — **c'est le jeu de bandes du §7 (L7)**.

### H6 — Glucotoxicité franche chez un patient déjà polymédiqué
**Nœud B.** Homme 58 ans, metformine + gliclazide, amaigrissement de 8 kg, polyurie,
cétonémie positive, coronarien, insuffisance cardiaque, HbA1c 9.
`Intention = Intensifier` · `Metformine` + `Sulfamide` · `HbA1c = 9` · `Nettement
au-dessus` · `Maladie cardiovasculaire établie = oui` · `Insuffisance cardiaque = oui` ·
`Cétonémie = oui` · `Symptômes de glucotoxicité = oui` · `DFG = 70` · `IMC = 25` ·
`Âge = 58`.
→ *Contrôles* : **I10** et **I3** — la carte d'insuline d'initiation (état catabolique)
doit être en tête, visible sans dépliage. **C'est le cas de contrôle de la
non-régression du repli d'affichage : à rejouer après chaque lot.**

### H7 — Grossesse et périmètre du nœud
**Nœud B, puis D.** Femme 34 ans, DT2, projet de grossesse en cours.
Il n'existe **aucun champ** pour le déclarer, alors que les deux nœuds annoncent dans
leur chapô « hors grossesse » et que la statine y est dite contre-indiquée.
→ *Contrôle* : **I1 à l'envers** — un critère d'exclusion majeur, revendiqué par le
texte, n'est pas saisissable. `?REF` : est-ce assumé (le praticien s'en charge) ou
faut-il un garde-fou ?

### H8 — Cible et traitement en désaccord
**Nœuds A puis B, à la suite.** Homme 77 ans, fragile : le nœud A donne une cible ≤ 8 %.
Reporter cette cible dans le nœud B avec `HbA1c actuelle = 7,6` et `Par rapport à
l'objectif = À l'objectif`, puis rejouer en déclarant `Au-dessus de l'objectif`.
→ *Contrôle* : **I2** et cohérence inter-nœuds. Rien ne relie les deux nœuds : la
position vis-à-vis de l'objectif est **déclarée à la main**, sans que l'outil vérifie sa
compatibilité avec l'HbA1c saisie ni avec la cible qu'il vient lui-même de recommander.
`?REF` : faut-il que le nœud B recalcule ou au moins signale l'incohérence ?

---

## 7. Profils limites et adversariaux

> But : ce que fait l'outil quand on le pousse. Aucun de ces profils n'est réaliste ;
> tous sont atteignables par une faute de frappe en consultation.

| # | Nœud | Saisie | Ce qu'on observe |
|---|---|---|---|
| **L1** | C | `Situation = Basale seule`, `TBR = 1`, **`TBR sévère = 95`**, `CV = 60` | **Impossible par définition** : le temps sous 54 mg/dL est inclus dans le temps sous 70. *Constaté le 2026-07-27 : accepté sans un mot, et trois cartes « Recommandée » en découlent.* |
| **L2** | C | Tout comme L1 mais `MCG disponible = non` | *Constaté : les mesures de capteur pilotent la recommandation alors qu'aucun capteur n'est déclaré.* Vérifier si le lot en cours corrige. |
| **L3** | B | `HbA1c = 4` puis `= 18` (bornes du champ) | Les bornes acceptent-elles ? Une HbA1c à 4 avec « Nettement au-dessus de l'objectif » doit-elle passer ? |
| **L4** | B | `HbA1c = 6,0` + `Par rapport à l'objectif = Nettement au-dessus` | **Contradiction inter-champs** volontaire. L'outil suit-il le champ déclaratif sans jamais regarder le chiffre ? |
| **L5** | B | `DFG = 3` (borne basse), `Metformine` cochée, `Intention = Intensifier` | La carte d'arrêt doit primer sur toute carte d'ajout. |
| **L6** | C | `Poids = 35` (borne basse) + `Dose de basale = 150` (borne haute) → 4,3 U/kg | Les doses calculées (bolus ≈ 10 %, basale −20 %) restent-elles affichées sans réserve ? |
| **L7** | D | `Intolérance = Rapportee` avec `CK` = 0 ; 3 ; **4,5** ; **5,5** ; 12 ; 60 | Balayage des bandes. Les deux seuils (4 N et 5 N) portent des conduites différentes : vérifier qu'à chaque valeur **une seule** conduite sort et que son intitulé correspond à la bande. *La bande 10–50 N n'est couverte par aucun profil du golden master (noté dans le YAML) — L7 la couvre.* |
| **L8** | D | `Intolérance = Averee` puis retour à `Non`, plusieurs allers-retours | Le champ CK doit apparaître/disparaître et **sa valeur ne doit pas rester active** une fois masqué. |
| **L9** | B | Cocher **les 8 traitements en cours** simultanément | Combinaison absurde mais atteignable. Les garde-fous d'association (gliptine + AR GLP-1, saxagliptine + IC) doivent tous se déclencher. |
| **L10** | B | `Intention = Initier` **et** cocher des traitements avant de changer d'intention | Changer d'intention **après** avoir coché : les traitements sont masqués — sont-ils **oubliés** par le moteur, ou conservés en mémoire et toujours actifs ? *C'est le mécanisme qui a produit l'anomalie de C1 : à instrumenter précisément.* |
| **L11** | A | `Ancienneté = 4` + `Espérance de vie = Limitée` + `Fragilité` | Deux options s'opposent (cible ~6,5 % pour l'ancienneté < 5 ; cible < 9 % pour le terrain). Laquelle gagne, et le dit-elle ? |
| **L12** | E | Tous les champs au maximum défavorable + les 3 signes d'appel cochés | Combien de cartes ? Le repérage TCA prend-il le pas sur les 10 pistes alimentaires, ou s'ajoute-t-il ? |
| **L13** | tous | Remplir un formulaire, sortir du nœud, y revenir | Le formulaire doit être **vierge**. Vérifier qu'aucune valeur ne survit. |
| **L14** | tous | Sur formulaire vierge | Aucun choix ne doit être allumé ; aucune carte ne doit porter « Recommandée ». |

---

## 8. Gabarit de relevé

À recopier pour chaque profil exécuté.

```
PROFIL : ....         NŒUD : ....         DATE : ....        COMMIT : ....

SAISIE RELUE À L'ÉCRAN (champ = valeur, recopiée depuis le formulaire) :
  ...

RÉSULTAT :
  Bandeau        : « Options applicables » / « — provisoire », compteur = ....
  Cartes         : 1. .... [badge ....]   2. ....
  En attente     : ....
  Alertes        : ....
  Écartées       : ....  (panneau ouvert : oui / non)

INVARIANTS : I1 .. I2 .. I3 .. I4 .. I5 .. I6 .. I7 .. I8 .. I9 .. I10 ..
RANG        : nb de défilements avant la 1re carte cohérente avec l'intention = ....

ÉCART CONSTATÉ (le cas échéant) : description + capture
QUESTION AU RÉFÉRENT (?REF)     : ....
```

---

## 9. Ordre d'exécution conseillé

1. **Les six profils de non-régression d'abord** — C1, C6, C10, G7, H6, L14. Ce sont
   ceux qui ont déjà attrapé un défaut. S'ils passent, le lot n'a rien cassé de connu.
2. **Les profils courants** C2 → C12, dans l'ordre. C'est le volume réel d'usage.
3. **La fragilité** G1 → G8. C'est là que le coût d'une erreur est le plus élevé.
4. **Les difficiles à équilibrer** H1 → H8.
5. **Les limites** L1 → L13, en dernier : ils cassent le formulaire et demandent une
   remise à zéro après chacun.

---

## 10. Anomalies que ce banc doit re-vérifier

Constatées à l'écran le 2026-07-27 sur le commit `7a14689` (+ `c69241e`, docs seuls).
**Le lot en cours peut en avoir corrigé une partie** — d'où le banc.

| Anomalie | Profil qui la rejoue |
|---|---|
| « Poursuivre le traitement en cours » proposée à un patient naïf en cours d'initiation, avec un argumentaire affirmant « objectif atteint » alors que « Au-dessus » est saisi | **C1** |
| Deux options en attente permanente de mesures de capteur chez un patient sans capteur | **C10**, G5, L2 |
| « Nature de l'intolérance » réclamée alors que le champ n'existe nulle part | G1 (variante `Intention = Optimiser`, `DFG = 45`, dose metformine vide) |
| Bloc MCG affiché en entier sur formulaire vierge | L14 sur le nœud C |
| Les gestes d'ajout affichés avant les gestes de retrait quand l'intention est « Déprescrire » | **G1** |
| Condition d'exclusion affichée qui, satisfaite, ne produit pas l'option annoncée | **G2** |
| 10 cartes toutes « Recommandée » sans priorisation | **C11** |
| Compteur « N critères décisifs non confirmés » sans repère correspondant à l'écran | C5, C7 |
| Aucune suggestion produite malgré la légende « Suggestion auto … — à valider » | **C7** |
| Libellés bruts sans accents sur les deux nœuds RHD et sur `statine` | C11, C12 |
| Incohérence inter-champs acceptée sans réserve (TBR sévère > TBR) | **L1** |
| Boutons de choix sans état accessible (`aria-pressed` absent) | L14, tous nœuds |

---

## 11. Passe ciblée du 2026-07-27 sur `def7cc1` — classes et invariants proposés

**Conditions.** Sept profils joués à l'écran, `HEAD = def7cc1` **avant et après** la passe,
arbre de travail propre (seul ce fichier était non suivi). Sous-ensemble choisi pour ne
toucher aucun des fichiers modifiés dans le lot en cours : rien sur le compteur, rien
sur les repères « à confirmer », rien sur l'état accessible des boutons, rien sur les
bandes CK de `statine`, rien sur la famille « champ réclamé mais invisible » (couverte
depuis par `banc/impasse.test.ts`, I11).

**Résultat : 7 profils joués, 7 classes distinctes confirmées.** Aucune n'est rattrapée
par le banc moteur actuel — et j'explique pour chacune *pourquoi*, ce qui est le seul
point qui compte pour décider d'un nouvel invariant.

---

### K1 — Une option de continuation est applicable sans l'état qu'elle continue

**Profil C1.** `Intention = Initier un traitement` · `HbA1c actuelle = 8,1` ·
`Au-dessus de l'objectif` · `DFG = 88` · `Normoalbuminurie` · `IMC = 27` · signaux
d'alerte confirmés « Rien à signaler ». Aucun traitement coché — et le champ
« Traitements en cours » **n'est pas affiché**, l'intention « Initier » le masque.

À l'écran : **« Poursuivre le traitement en cours et réévaluer »**, badge
**« Recommandée »**, motif « Option par défaut : retenue en l'absence de toute autre
option plus spécifique applicable ». Son argumentaire ajoute : *« objectif atteint sans
agent iatrogène à optimiser »* — alors que « Au-dessus de l'objectif » vient d'être saisi.

*Pourquoi le banc passe* : `couverture.test.ts` vérifie que chaque règle **se déclenche**
au moins une fois ; ici elle se déclenche, c'est donc un succès. `invariants.test.ts` #1
ne contrôle que les `exclusions`. Rien n'affirme qu'une option de repli ne doit pas
s'appliquer quand son propre présupposé est faux.

> **Invariant proposé K1 → I12 (mécanisation de R9, « savoir si le geste est déjà fait »).**
> La règle existe déjà dans `GRAMMAIRE-NOEUD.md` ; elle n'est pas outillée. Version
> vérifiable sans nommer aucun nœud : **toute option dont l'intitulé porte un verbe de
> continuation** (`poursuivre`, `maintenir`, `continuer`, `réévaluer` seul) **doit
> déclarer un `prerequis`**, et ce `prerequis` doit être faux pour au moins un profil du
> banc (sinon il ne mord pas — `couverture.test.ts` sait déjà tester ça). Liste de verbes
> en constante, pas d'id de nœud. Coût : faible. Corrige C1 par le contenu.

---

### K2 — Un critère est réclamé alors que le contexte déclaré le rend impossible à fournir

**Profil C10.** `Situation = Basale seule` · `Âge = 64` · `HbA1c = 8,4` · `cible = 7` ·
`DFG = 70` · `Espérance = Longue` · `Risque hypo = Faible` · `Metformine` +
`Insuline basale` · **`MCG disponible` décoché** · `Glycémie à jeun = 1,05` ·
`Poids = 95` · `Dose de basale = 60`.

À l'écran, en permanence : deux options « en attente » de `TBR`, `TBR sévère` et
`Coefficient de variation`. Le compteur reste bloqué à « 4 critères décisifs non
confirmés ». Un patient sans capteur ne produira jamais ces trois mesures.

*Pourquoi I11 passe* — c'est le point important : **I11 ne flague que les critères
`enAttente` qui ne sont pas rendus par le formulaire.** Or `TBR`, `TBR_severe` et
`CV_glycemique` sont gardés par `visible_si: "situation_insuline != naif"`, **sans aucune
mention de `mcg_disponible`** (vérifié dans `insuline.yaml`). Les champs *sont* affichés.
I11 est donc vert, et l'impasse survit. Ce n'est pas la même classe que le défaut G :
là c'était « champ invisible », ici c'est « champ visible mais inobtenable ».

> **Invariant proposé K2 → I13, répondabilité.** Généralisation d'I11 d'un cran :
> introduire sur un critère une déclaration `obtenable_si` (expression), distincte de
> `visible_si`. I13 : *aucune option en attente ne réclame un critère dont `obtenable_si`
> est faux dans l'état courant.* Même mécanique et mêmes profils partiels qu'I11 — le
> fichier existant peut l'accueillir. Sur `insuline`, `TBR`/`TBR_severe`/`CV_glycemique`
> reçoivent `obtenable_si: "mcg_disponible == true"`.

---

### K3 — Aucune validation croisée entre critères

**Profil L1.** Suite du précédent, `MCG disponible` coché cette fois, puis `TBR = 1` ·
**`TBR sévère = 95`** · `Coefficient de variation = 60`.

Le temps passé sous 54 mg/dL est par définition **inclus** dans le temps passé sous
70 mg/dL : 95 % contre 1 % est impossible. L'écran l'accepte sans un mot et en tire
**trois cartes « Recommandée »**, dont « Ajouter un bolus au repas principal » — chez un
patient que la saisie décrit comme passant 95 % du temps en hypoglycémie sévère.

*Pourquoi le banc passe* : le générateur (`banc/profils.ts`) tire chaque critère
**indépendamment**, dans ses bornes `min`/`max`. Aucune contrainte n'existe *entre*
critères, ni dans le schéma, ni à la saisie. Un auteur de vignettes, lui, n'écrit que des
profils plausibles — la combinaison ne peut donc venir que de l'écran ou de vrais doigts.

> **Invariant proposé K3 → I14, plausibilité inter-champs.** Ajouter au schéma de nœud une
> liste `contraintes` (expressions devant rester vraies, ex. `TBR_severe <= TBR`), et
> l'appliquer aux **deux** bouts : refus/alerte à la saisie, et filtrage dans
> `genererProfils` pour que le banc ne perde pas son temps sur des profils impossibles.
> I14 : *toute `contrainte` déclarée est violable par au moins un profil* (sinon elle est
> morte) *et aucune option n'est applicable sur un profil qui la viole.*

---

### K4 — Le rang des cartes ignore l'intention déclarée

**Profil G1.** `Intention = Déprescrire` · `Metformine` + `Sulfamide` · `HbA1c = 6,3` ·
`En dessous de l'objectif (sur-traitement probable)` · `DFG = 50` · `Normoalbuminurie` ·
`IMC = 24` · `Hypoglycémie récente` · `Âge = 82` · `Fragilité`.

Ordre obtenu à l'écran :

1. Metformine (socle)
2. **[Recommandée] Introduire un iSGLT2**
3. Introduire un AR GLP-1
4. [Recommandée] Désintensifier : alléger / arrêter le sulfamide…
5. [Recommandée] Réduire la posologie du sulfamide

**Distance mesurée : 1,51 écran** entre la première carte et le premier geste de retrait.
Le nœud affiche bien un avertissement expliquant qu'un geste d'ajout peut apparaître
malgré l'intention — mais il est **au-dessus** des cartes, et l'ordre reste inchangé.

*Pourquoi le banc passe* : aucun test n'affirme quoi que ce soit sur l'**ordre**. Toutes
les assertions portent sur l'appartenance à un ensemble.

> **Invariant proposé K4 → I15, rang vs intention.** Là où le nœud porte un critère
> d'intention (générique : un critère `enum` déclaré `pilote_le_rang: true`), *la première
> option applicable doit appartenir à la famille correspondant à l'intention déclarée*,
> la correspondance étant portée par le contenu (`familles` ont déjà des libellés :
> « Traitement à alléger », « Agent à ajouter »). Testable sur le moteur seul, sans DOM.

---

### K5 — Aucune priorisation quand tout est recommandable

**Profil C11.** Nœud RHD Alimentation, profil réaliste (boissons sucrées quotidiennes,
ultratransformés fréquents, repas irréguliers, grignotage, peu de légumineuses/poisson/
fruits à coque, viande rouge régulière).

**10 cartes, 10 badges « Recommandée »**, sans hiérarchie, alors que le chapô du nœud
annonce un recueil bref et des pistes « négociables ».

*Pourquoi le banc passe* : chaque option se déclenche légitimement ; c'est même ce que
`couverture.test.ts` demande. Rien ne borne le **nombre** d'options simultanément portées
au même niveau de recommandation.

> **Invariant proposé K5 → I16, budget de recommandation.** Par nœud, déclarer un
> `max_recommandations_simultanees` dans le contenu ; I16 vérifie qu'aucun profil du banc
> ne le dépasse. Le seuil est une décision de contenu (référent), pas de code — l'invariant
> ne fait que le rendre opposable. `?REF` : combien de pistes en une consultation, et
> laquelle en premier ?

---

### K6 — La position vis-à-vis de l'objectif est déclarative et jamais confrontée aux nombres

**Profil H8, en deux temps.**
Nœud A — `Âge = 77` · `Ancienneté = 15` · `Espérance de vie = Intermédiaire` ·
`Fragilité` → l'outil recommande **« Cible ≤ 8 % »**.
Nœud B — même patient, `HbA1c actuelle = 7,6`, et je déclare **« Au-dessus de
l'objectif »**. L'outil intensifie : **iSGLT2 et AR GLP-1 tous deux « Recommandée »**.

7,6 % est pourtant *sous* la cible que l'outil vient lui-même de recommander. Il détient
les deux nombres et ne les rapproche jamais.

*Pourquoi le banc passe* : `position_vs_objectif` est un critère d'entrée comme un autre.
`coherence-inter-noeuds.test.ts` (S7) vérifie qu'un critère partagé a un **encodage**
unique, pas que les valeurs saisies dans deux nœuds soient **compatibles**.

> **Invariant proposé K6 → I17, cohérence déclaratif ↔ calculable.** Quand un nœud porte à
> la fois une mesure et une position déclarée sur cette mesure, la position doit être
> **dérivable** (le mécanisme `derive` existe déjà, `engine/deriveCritere.ts`) ou, à
> défaut, l'écran doit signaler la discordance. I17 : *aucun profil ne peut porter une
> position déclarée contredite par la mesure et la cible disponibles.*
> `?REF` : faut-il calculer la position, ou seulement alerter ?

---

### K7 — Un critère d'exclusion revendiqué par le chapô n'est pas saisissable

**Profil H7.** Les quatre nœuds testés annoncent « hors grossesse » dans leur chapô, et
`statine` précise « statines contre-indiquées pendant la grossesse ». **Aucun des quatre
n'offre de champ pour la déclarer** (vérifié sur le formulaire rendu : `Fixer la cible`,
`Insulinothérapie`, `Prescrire une statine` — le mot n'apparaît que dans le chapô).

*Pourquoi le banc passe* : le périmètre est du texte libre, jamais confronté aux critères
d'entrée.

> **Invariant proposé K7 → I18, périmètre opposable.** Structurer le périmètre
> (`hors_perimetre: [...]` en liste d'items) et vérifier que chaque item est **soit**
> adossé à un critère d'entrée qui le rend saisissable, **soit** explicitement marqué
> `a_la_charge_du_praticien: true`. Rend la décision visible au lieu de la laisser implicite.
> `?REF` : la grossesse relève-t-elle du garde-fou outil ou du praticien ?

---

### Récapitulatif — ce que la passe rapporte

| Classe | Profil | Invariant proposé | Nature du travail |
|---|---|---|---|
| K1 option de continuation sans son état | C1 | I12 (R9 mécanisé) | test + `prerequis` de contenu |
| K2 critère inobtenable | C10 | I13 (`obtenable_si`) | schéma + test, extension d'I11 |
| K3 pas de validation croisée | L1 | I14 (`contraintes`) | schéma + saisie + générateur |
| K4 rang vs intention | G1 | I15 | test moteur seul |
| K5 pas de priorisation | C11 | I16 (budget) | contenu (`?REF`) + test |
| K6 position déclarative non confrontée | H8 | I17 | `derive` existant + test |
| K7 périmètre non opposable | H7 | I18 | schéma + test |

**Trois des sept (K4, K5, K6) sont testables sur le moteur seul** une fois l'invariant
formulé : elles ne demanderont plus jamais de passe navigateur. K1, K2, K3 et K7 demandent
d'abord une petite extension du schéma de contenu. **Aucune des sept ne nécessite de
piloter un navigateur en intégration continue** — ce qui était l'objet de la question :
le navigateur sert à trouver la classe, pas à la surveiller.

Restent hors de portée de tout test et donc réservés à une passe humaine courte : la
**densité** (une carte ≈ 1 écran, page à 8,5 écrans en fenêtre étroite) et la lisibilité
d'ensemble en consultation.

---

## 12. Seconde passe du 2026-07-27 sur `def7cc1` — la sécurité en situation saturée

**Conditions identiques** : cinq profils, `HEAD = def7cc1` avant et après, arbre propre.
Question posée : **un garde-fou survit-il quand les contraintes s'empilent ?**

### Ce qui tient — à dire aussi, c'est un résultat

- **G4** (85 ans, DFG 26, metformine + gliclazide toujours prescrits) : les deux cartes
  **« Arrêter la metformine »** et **« Arrêter le sulfamide »** arrivent **en tête**,
  toutes deux « Recommandée », avant les gestes d'ajout. L'ordre est donc bien
  sécurité-consciente ici.
  → **Cela restreint K4** : le défaut de rang n'est pas général, il est propre au chemin
  « Déprescrire ». L'invariant I15 doit être formulé en conséquence.
- **H3** (DFG 22, insuffisance cardiaque, macroalbuminurie, infections génito-urinaires
  récidivantes, metformine + gliptine) : arrêt de la metformine en tête ; l'iSGLT2 est
  **affiché mais non recommandé**, avec l'alerte des infections génito-urinaires ; la
  non-association incrétine se déclenche. Trois alertes, toutes pertinentes. Le principe
  « écarté ≠ non indiqué » est respecté.
- **G5** (84 ans, basal-bolus, hypoglycémies sévères récurrentes, HbA1c 6,8 pour une cible
  à 8) : **une seule carte, « Désintensifier / alléger le schéma »**, Recommandée. Aucune
  intensification. Le garde-fou tient parfaitement.

### K8 — Quatre drapeaux de sécurité de portées différentes fondus en un seul verrou

**Profil G8**, nœud RHD Activité physique. `Frequence activite structuree = Jamais` ·
`Duree seance = Moins 10 min` · `Mode deplacement = Motorise ou assis` · `Temps assis =
Plus 8h` · `Fragilité` · `Limitation physique connue` · `Neuropathie ou mal perforant
plantaire` · `Retinopathie non stabilisee ou proliferante`.

Résultat : **9 cartes, 9 « Recommandée »**, dont en tête « Remplacer un trajet motorisé
par **la marche ou le vélo** » et « Suivre son **nombre de pas** et chercher à en faire un
peu plus ».

**Expérience de discrimination.** Décocher puis recocher
`Retinopathie non stabilisee ou proliferante` : **aucun changement** — mêmes 9 cartes,
mêmes 2 alertes. Cocher `Symptomes ischemie effort` : **aucun changement** non plus.

**Vérification dans le contenu avant de conclure** (`rhd-activite-physique.yaml`, l. 139-148) :
ces critères ne sont **pas morts**. Les quatre drapeaux alimentent un dérivé unique —

```
verrou_effort = limitation_physique_connue OR symptomes_ischemie_effort
             OR retinopathie_non_stabilisee_ou_proliferante OR neuropathie_ou_mal_perforant_plantaire
```

— si bien qu'une fois **l'un** d'eux vrai, les autres n'ont plus aucun effet observable.
`couverture.test.ts` (R5) est donc légitimement vert. **Le contenu assume d'ailleurs la
limite** : l'alerte neuropathie écrit « L'outil retire ici la famille "pratique
structurée" dans son ensemble, faute de recueillir de quoi distinguer les pistes par
segment corporel ».

**Ce qui reste néanmoins observable à l'écran, et qui est le constat :** une rétinopathie
proliférante non stabilisée, un mal perforant plantaire et des symptômes d'ischémie à
l'effort produisent **exactement le même écran**. Seule l'alerte neuropathie s'affiche ;
**aucune alerte ne mentionne l'ischémie d'effort ni la rétinopathie**, et le patient qui
les porte se voit recommander en tête d'augmenter son nombre de pas.

`?REF` **Question au référent, que je ne tranche pas** : ces trois situations appellent-elles
la même conduite ? Un patient déclarant des symptômes d'ischémie à l'effort peut-il
recevoir cet écran sans qu'un avis cardiologique soit nommé ?

> **Invariant proposé K8 → I19, distinguabilité des drapeaux de sécurité.** Marquer les
> critères concernés (`securite: true`) et vérifier que **chacun**, pris isolément, modifie
> la sortie : pour tout critère de sécurité, il doit exister deux profils identiques à ce
> critère près dont les cartes **ou** les alertes diffèrent.
> **La mécanique existe déjà** : c'est exactement la forme du test #6 de
> `invariants.test.ts` (« à `fragilite` près, toutes choses égales par ailleurs, `fragilite=true`
> ne produit jamais PLUS d'options “Agent à ajouter” »). Il n'y a qu'à le généraliser.
> Coût : faible. C'est, de tous les invariants proposés aujourd'hui, celui dont le
> rapport valeur/effort est le meilleur.

### K9 — La portée d'un garde-fou est la famille, pas la modalité

Même profil G8. Le verrou retire la famille **« pratique structurée »** — et le dit. Mais
deux cartes proposant de la **marche en charge** subsistent, recommandées et en première
position, parce qu'elles appartiennent à d'autres familles (« Déplacements actifs »,
activité informelle). L'alerte, elle, restreint « marche prolongée, course ».

Je ne sais pas si « remplacer un trajet motorisé par la marche » relève de la « marche
prolongée » : **c'est un jugement clinique, il revient au référent**. Ce que je constate
est structurel : **le retrait opère par famille, alors que la contre-indication porte sur
une modalité** (l'appui en charge), laquelle traverse plusieurs familles.

> **Invariant proposé K9 → I20.** Introduire une `modalite` sur les options (ex. `appui_en_charge`)
> et permettre à un verrou de retirer par modalité et non seulement par famille. I20 :
> *aucune option ne porte une modalité que le verrou actif retire.*

### K10 — Une alerte formulée en termes que les cartes voisines semblent démentir

**Profil G4.** L'alerte affiche : « Position déclarée AU-DESSUS de l'objectif, avec une
intention d'OPTIMISATION : l'outil s'en tient à ce qui est déclaré et **ne propose donc
pas d'ajout d'agent glycémique** ». Juste en dessous : **« [Recommandée] Introduire un
iSGLT2 »** et « Introduire un AR GLP-1 ».

**Vérifié avant de conclure** : ce n'est **pas** une contradiction logique. Le « pourquoi »
de l'iSGLT2 est « DFG < 60 et Albuminurie ≠ Normoalbuminurie et Remplacement d'un agent
sans bénéfice » — c'est un ajout **protecteur**, pas glycémique. L'alerte dit vrai.

Le constat est donc de **forme, pas de fond** : la distinction tient au seul mot
« glycémique », au milieu d'un paragraphe de cinq lignes, à un écran de deux cartes
« Introduire… ». En consultation, cela se lit comme une contradiction alors que ce n'en
est pas une. Pas d'invariant à en tirer — c'est une question de rédaction, `?REF`.

### Bilan de la seconde passe

| Nœud | Verdict sécurité |
|---|---|
| `prescription` — DFG 26 (G4) | **tient** : arrêts en tête |
| `prescription` — saturation (H3) | **tient** : arrêt en tête, iSGLT2 affiché non recommandé, 3 alertes justes |
| `insuline` — hypo sévères (G5) | **tient** : désintensification seule |
| `rhd-activite-physique` (G8) | **classe nouvelle K8/K9** : trois situations de sécurité indiscernables |

Et **K2 se confirme sur un second terrain** : G5 laisse lui aussi une option en attente
permanente de `TBR`/`TBR sévère`/`CV` chez un patient sans capteur, cette fois chez une
personne de 84 ans à hypoglycémies sévères. La classe n'est pas anecdotique.
