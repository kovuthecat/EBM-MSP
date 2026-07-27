# Vérification finale adversariale — nœud `statine` (lots du 2026-07-27)

**Domaine** : diabète de type 2 · **Nœud** : `statine` · **Date** : 2026-07-27
**Périmètre audité** : `content/noeuds/diabete-type-2/statine.yaml`,
`content/noeuds/diabete-type-2/statine.argumentaire.md`,
`src/features/decision/engine/evaluateNode.statine.test.ts`
**Méthode** : lecture en source primaire des deux PDF locaux (parcours NHS **et** NG238, ce dernier
ouvert page par page), re-vérification indépendante sur PubMed/PMC des références versées le
2026-07-27, et **traçage du moteur réel** sur 8 profils adversariaux (fichier de sonde temporaire créé
à la racine puis supprimé ; aucun fichier de `content/` ni de `src/` n'a été modifié — `git status`
propre côté périmètre audité).

---

## 1. Verdict global

**La bibliographie est exacte et le protocole de réintroduction est transcrit fidèlement, mais le
garde-fou CK — la seule règle du nœud qui retire une option, et la première dans l'ordre
d'évaluation — est calé sur un document périmé que le guide l'ayant remplacé contredit sur ses trois
points, et ce guide était dans le même dossier, non ouvert ; s'y ajoutent trois cartes fausses ou
dangereuses pour des profils atteignables et présents dans le golden master.**

4 findings HAUTE, 7 MOYENNE, 7 BASSE. Aucun n'est cosmétique : les quatre HAUTE produisent tous un
affichage erroné ou omis pour un patient réel.

---

## 2. Findings HAUTE

### HAUTE-1 — Le garde-fou CK suit un document remplacé ; le guide qui l'a remplacé est dans le même dossier et dit l'inverse sur les trois points arbitrés

**Citations contestées**

`statine.yaml:172-175` (commentaire du critère `CK_x_normale`) :
> « […] qui se rattache à CG181 — la recommandation que NG238 a remplacée en décembre 2023 — et qui
> porte "Review date: Jan 2024". Il a donc dépassé sa propre date de révision et renvoie à un
> référentiel remplacé. Le référent a décidé de l'utiliser malgré cela […] : **rien de plus récent ne
> la remplace.** »

Repris à l'identique en `statine.yaml:240` (option 1, `inconvenients`), `statine.yaml:841`
(`incertitudes`) et `statine.argumentaire.md:226-227` (« Rien de plus récent ne le remplace à ce jour »).

`statine.yaml:181-184` (arbitrage référent n° 2) :
> « SEUIL À L'INITIATION — **4 N, pas 5.** […] Le référent a retenu le seuil le PLUS BAS, donc le plus
> prudent […] »

**Ce que dit réellement la source** — `docs/decision/sources/NICE 2023.pdf` = **NG238**,
« Cardiovascular disease: risk assessment and reduction, including lipid modification », publié le
**14 décembre 2023**, p. 4 : « **This guideline replaces CG181.** » C'est donc le référentiel courant
sur exactement la question arbitrée, et il est **postérieur de 16 mois** au parcours (janvier 2022).

| Point arbitré | Parcours NHS/AAC (jan. 2022, rattaché à CG181) | **NG238 (mai 2023, courant)** | Ce que fait le nœud |
|---|---|---|---|
| Seuil avant initiation | « If CK levels are > 4x ULN do not start statin » | **§1.5.7** : « more than **5 times** the ULN, **re-measure creatine kinase after 7 days**; if still 5 times the ULN, do not start statin treatment » | bloque à **> 4**, **sans re-dosage** |
| CK élevée mais sous le seuil, avant initiation | (non traité) | **§1.5.7** : « raised but **less than 5 times** the ULN, **start statin treatment at a lower dose** » | à 4,1-5,0 N : **carte « Statine indisponible »** |
| CK 4-5 N **sous** traitement, symptômes musculaires | « Intolerable symptoms and/or clinical concern and/or CK > 4x and < 10x ULN → Stop statin for 4-6 weeks » | **§1.11.4** : « […] creatine kinase level **less than 5 times** the ULN, **reassure them that their symptoms are unlikely to be due to the statin** and explore other possible causes » | **interrompt 4 à 6 semaines** |
| Ne pas doser chez l'asymptomatique | p. 2, verbatim | **§1.11.5**, verbatim également | appliqué ✔ (mais sourcé sur le seul document périmé) |
| Protocole de dé-challenge / re-challenge | flowchart p. 1 | **§1.9.2-1.9.4** : arrêt puis reprise, switch dans le même groupe d'intensité (rosuva si déjà atorva), réduction de dose, passage à une statine de moindre intensité ; **§1.9.3** viser l'intensité maximale tolérée ; **§1.9.4** « any statin at any dose reduces CVD risk » | encodé depuis le seul parcours |
| Alternatives si statine impossible | p. 2 | **§1.10.1-1.10.4** : ézétimibe (TA385) → **acide bempédoïque AVEC ézétimibe** (TA694) → alirocumab / évolocumab / inclisiran | ordre compatible (cf. BASSE-6) |

**Impact sur la décision clinique.** Deux situations atteignables où l'outil fait le contraire de ses
**deux** sources citées :

1. *CK à 4,5 N, pas encore de statine.* Le nœud affiche « **Statine indisponible** — alternatives
   hypolipémiantes ». NG238 §1.5.7 dit de **démarrer la statine à dose plus faible** ; la reco
   française fixe la contre-indication à **> 5 N**, donc ne contre-indique pas non plus. Vérifié au
   moteur (profil F du traçage). Un diabétique à haut risque CV se voit refuser la classe la mieux
   démontrée du dossier sur une valeur qu'aucune des deux sources ne retient.
2. *CK à 4,5 N, sous statine, douleurs musculaires.* Le nœud affiche en **première** option
   « **Interrompre la statine 4 à 6 semaines** ». NG238 §1.11.4 dit de **rassurer** — les symptômes
   sont peu probablement dus à la statine — et de chercher une autre cause.

L'argument d'arbitrage (« le seuil le PLUS BAS, donc le plus prudent ») ne tient pas : il n'est
prudent que du côté musculaire, il est imprudent du côté du risque cardiovasculaire, et il n'est
soutenu par aucune des deux recommandations. Et la prémisse qui l'autorise (« rien de plus récent ne
la remplace »), écrite quatre fois, est **fausse** — d'autant que `sources.reco_officielle`
(`statine.yaml:795`) cite explicitement « NG238 lui-même dans `NICE 2023.pdf` ». Le document a été
téléchargé, référencé, et non lu.

**Ce que le finding NE dit PAS** : que le parcours NHS soit inutilisable. Il reste la source la plus
détaillée sur les bandes hautes (10-50 N, > 50 N) et sur les doses de reprise, que NG238 ne chiffre
pas. La correction porte sur le seuil, sur le re-dosage à 7 jours, et sur la prémisse « rien de plus
récent ».

---

### HAUTE-2 — L'alerte affichée annonce « 5 fois la normale » alors que la porte est à 4, et attribue la contre-indication à une source dont le seuil est 5

**Citation contestée** — `statine.yaml:420-428`, alerte de l'option terminale :
> `quand: "CK_x_normale > 4 AND statine_deja_en_place == false"`
> « Cette carte est atteinte parce que les CK **dépassent 5 fois la normale** AVANT toute initiation
> — ce qui, dans la recommandation française 2026, est une contre-indication à la statine. »

**Ce que dit réellement la source.** La reco SFE/SFD/NSFA/SFC 2026 §6.1 écrit « CK levels **>5-fold**
higher than normal are contraindications for statin therapy » (verbatim re-vérifié :
`redteam-intolerance-statine.md:246`). Le déclencheur de l'alerte est `> 4`.

**Vérifié au moteur** (profil F : `CK_x_normale = 4.5`, `statine_deja_en_place = false`,
`ASCVD_etablie = true`) : la carte terminale s'affiche avec ce message intégral.

**Impact.** Pour tout patient entre 4,1 et 5,0 N, le message énonce **deux faits faux sur le dossier
qu'il commente** : les CK ne dépassent pas 5 N, et la reco française ne contre-indique pas à cette
valeur. C'est un reliquat du booléen `CK_sup_5N` remplacé le soir même. Le même reliquat existe dans
`population_cible`, affiché en haut de l'écran (cf. MOYENNE-4).

**Aggravant** : deux vignettes **verrouillent** cette chaîne au lieu de la détecter —
`evaluateNode.statine.test.ts:367` (`expect(...includes('5 fois la normale')).toBe(true)`) et `:334`
(la même chaîne en négatif). L'attente y a été manifestement lue sur le texte du YAML, pas posée par
le référent.

---

### HAUTE-3 — Un patient dont le dossier déclare une intolérance AVÉRÉE reçoit une carte qui lui prescrit de réintroduire une statine

**Citations contestées** — `statine.yaml:230-236`, option 1 (première du nœud) :
> `conditions: ["CK_x_normale > 4 AND statine_deja_en_place == true"]` — **aucune `exclusions`**
> « Réintroduction ensuite […] On reprend alors à dose BASSE ou MODÉRÉE d'une statine de haute
> intensité — atorvastatine 10 ou 20 mg, ou rosuvastatine 5 ou 10 mg — puis on titre à 8 semaines
> d'intervalle. »

contre `statine.yaml:95-97` (`population_cible`, **affiché à l'écran**,
`DecisionNodeScreen.tsx:226`) :
> « il n'existe **plus** de profil à qui cet outil propose une statine que le dossier du patient
> déclare contre-indiquée »

et `statine.yaml:66-67` : « `averee` = intolérance établie, qui rend la classe **indisponible** pour
ce patient et RETIRE les options de statine ».

**Vérifié au moteur** (profil D : `intolerance_statine = 'averee'`, `statine_deja_en_place = true`,
`CK_x_normale = 6`, `ASCVD_etablie = true`) :
> OPTION RETENUE : *Interrompre la statine 4 à 6 semaines et réévaluer*
> ALERTES DE NŒUD : **(aucune)** · ALERTES DE L'OPTION : **(aucune)**

**Impact.** L'option 1 est en tête de l'`ordered-first-match` et ne porte aucune exclusion. Un patient
à intolérance **avérée** y est routé dès que ses CK dépassent 4 N sous traitement, et la carte lui
détaille la réintroduction d'une statine. **Rien à l'écran ne mentionne son intolérance avérée** :
l'alerte de nœud a été reciblée le 2026-07-27 sur la seule valeur `rapportee`, et l'option terminale
n'est jamais atteinte. C'est exactement la configuration que D21 existe pour interdire, et le défaut
que ce lot prétend avoir corrigé — déplacé d'une option à une autre par l'insertion de la nouvelle
option 1 en tête. L'affirmation de `population_cible` est donc réfutée par le nœud lui-même.

*(Reproductible aussi à CK 60 N — profil E : même carte de réintroduction, plus l'alerte rhabdomyolyse.)*

---

### HAUTE-4 — CK à 10-50 N ou > 50 N chez un patient sans statine en cours : ni alerte rénale, ni alerte de rhabdomyolyse

**Citation contestée** — `statine.yaml:255-272` : les deux alertes de bande haute sont portées par
**l'option 1**, dont la condition exige `statine_deja_en_place == true`. Elles sont donc structurellement
inatteignables pour un patient non traité.

**Vérifié au moteur** (profils A, B, C) — `CK_x_normale = 60`, `statine_deja_en_place = false` :
> OPTION RETENUE : *Statine indisponible — alternatives hypolipémiantes*
> ALERTE DE L'OPTION : « […] La conduite est donc d'abord **DIAGNOSTIQUE** — chercher la cause de
> cette élévation — avant de conclure que la classe est définitivement indisponible pour ce patient. »

Aucune mention de rhabdomyolyse, aucune d'urgence, aucune de fonction rénale. Idem à 20 N (profil C).

**Ce que dit réellement la source** — `statin-intolerance-pathway.pdf`, p. 2, tableau de
classification SRM (Alfirevic 2014) : **SRM 5 = Rhabdomyolyse = « CK elevation >10x ULN with evidence
of renal impairment + muscle symptoms **or** CK >50x ULN »**. La définition ne comporte **aucune
condition d'exposition en cours à une statine**. Et p. 2 : « If rhabdomyolysis (SRM5) is suspected,
immediately stop statins, **urgently refer to inpatient assessment** and management **including
intravenous rehydration** as required to preserve renal function. Do not wait for measurement of
urinary myoglobin. »

**Impact.** Un patient présentant des CK à 60 fois la normale — une urgence médicale — reçoit une
carte de choix d'hypolipémiant et un conseil de temporisation diagnostique. Le nœud lui-même sait
formuler l'urgence : le message existe, mot pour mot, dans l'alerte `CK_x_normale > 50` de l'option 1,
et ne s'affiche que si une statine est déjà en cours.

**Présent dans le golden master** : `caracterisation.statine.txt` contient **11 profils**
`statine_deja_en_place=false ; CK_x_normale=60` (5 `rapportee`, 6 `averee`) — dont le profil 20, dont
la sortie enregistrée est bien la carte terminale sans alerte d'urgence. Le comportement est donc
gelé, pas accidentel.

---

## 3. Findings MOYENNE

### MOYENNE-1 — Deux taux de reprise affichés, non sourcés, dont l'un ne mesure pas ce que la carte lui fait dire — et que les `incertitudes` du même fichier déclarent non affichés

`statine.yaml:241-246`, `effet_attendu` de l'option 1 :
> « deux cohortes rétrospectives donnent **72,5 % et 70,7 % de reprise après réintroduction** »

contre `statine.yaml:840`, `incertitudes` (c) :
> « (c) le taux de reprise d'une statine après réintroduction **n'est pas affiché** […] **n'en encoder
> aucun comme "le" chiffre** »

et `redteam-intolerance-statine.md:481` (finding 6) : « **N'encoder ni l'un ni l'autre** comme "le"
chiffre. »

**Ce que disent réellement les sources** (`preuve-intolerance-statine.md:96-98` et `:112`) :
- Mampuya 2013 (PMID 24016512) : **72,5 % ont toléré un nouvel essai de statine** — bien un taux de
  reprise tolérée.
- Zhang 2017 : **70,7 % (19 989 / 28 266) ont POURSUIVI une statine** après un effet indésirable.
  Ce n'est **pas** un taux de reprise après réintroduction : c'est une proportion de continuation dans
  une cohorte rétrospective, avec confusion par indication majeure que la collecte signale elle-même
  (« à citer comme cohérence, jamais comme preuve d'effet »).

**Ni Mampuya 2013 ni Zhang 2017 ne figurent dans `sources.references_primaires`**, ni dans les
`references` de l'option 1 (`kraut-2023`, `aebi-2025`, `samson`, `statinwise`, `gauss-3`,
`ctt-symptomes-musculaires`) — aucune de ces six ne porte ces chiffres. C'est précisément le
décrochage que le lot « base consolidée » déclare avoir supprimé.

**Impact** : deux chiffres affichés en `effet_attendu`, dont l'un mal étiqueté, sans source
vérifiable, tendant à sur-rassurer sur le succès d'une réintroduction.

### MOYENNE-2 — Bande 10-50 N : le renvoi spécialisé est omis, et l'urgence est sous-dite en cas d'atteinte rénale

`statine.yaml:258-266` : « Si le débit de filtration glomérulaire est stable et normal, la conduite
**reste l'interruption de 4 à 6 semaines** décrite ci-dessus. S'il est altéré, évoquer une
rhabdomyolyse et **demander un avis spécialisé**. »

**Ce que dit réellement la source** (pathway p. 2) : « **When SRM4 is suspected** [CK >10x <50x ULN],
**without evidence of impaired renal function, discontinue statin therapy immediately and refer for
outpatient assessment.** Assess and treat possible contributory factors and re-assess the need for a
statin. » — c'est-à-dire un **renvoi spécialisé même quand la fonction rénale est normale**, absent du
nœud. Et en cas d'atteinte rénale, la situation **est** un SRM5 : la source impose « **urgently**
refer to **inpatient** assessment » + réhydratation IV, là où le nœud dit seulement « avis
spécialisé ». Le nœud sait écrire l'urgence (alerte > 50 N) mais ne la reprend pas ici.

L'affirmation du commentaire (`statine.yaml:186-189`, « les bandes 4-10 N ET 10-50 N convergent vers
la même case ») est vraie **de l'organigramme p. 1** et fausse de la p. 2, qui sépare explicitement
SRM 1-3 (« manage according to pathway ») de SRM 4.

### MOYENNE-3 — Le protocole de réintroduction est déclaré hors périmètre et non encodé… et constitue la première option du nœud

Trois passages du même fichier, tous incompatibles :
- `statine.yaml:99-102` (`population_cible`, **affiché à l'écran**) : « Hors périmètre : […] et
  **PROTOCOLE de réintroduction en aveugle (lavage, seuils, paliers de dose) — sa seule source
  détaillée n'a pas pu être ouverte**, et le red-team a demandé de ne pas l'encoder de seconde main ».
- `statine.yaml:840` (`incertitudes` a) : « le PROTOCOLE de réintroduction en aveugle **n'est pas
  encodé** — la seule source qui le détaille (**NICE NG238** : lavage 4-6 semaines, seuils ALAT/CK,
  réintroduction **atorvastatine 20 → 40 mg**) est restée en 403 ».
- `statine.yaml:192-195` + `:235` : « LE PROTOCOLE DE RÉINTRODUCTION **EST ENCODÉ** » — et il l'est,
  en détail, dans l'option 1.

L'entrée `incertitudes` (a) est donc périmée sur trois points à la fois : elle nie un encodage
réalisé, elle attribue le protocole à NG238 alors que l'entrée suivante (`:841`) démontre le
contraire, et elle répète les chiffres « atorvastatine 20 → 40 mg » que la même entrée suivante
déclare faux. `population_cible` étant rendu en tête d'écran, la contradiction est visible par le
prescripteur.

### MOYENNE-4 — `population_cible`, affiché à l'écran, annonce un seuil de 5 N

`statine.yaml:94-95` : « ainsi que la contre-indication biologique par des **CK > 5 N** avant
initiation. » La règle encodée est `> 4`. Même reliquat que HAUTE-2, sur le canal le plus visible
(`DecisionNodeScreen.tsx:226`).

### MOYENNE-5 — Les deux argumentaires décrivent un gate d'âge que le référent a explicitement rejeté et que le nœud n'a pas

- `statine.argumentaire.md:14` : « **Prévention primaire** (le cas standard, diabétique **≥ 40 ans**
  ou plus jeune à risque) → statine d'intensité modérée ».
- `statine.yaml:577-579` (argumentaire synthétique) : « statine d'intensité modérée pilotée par le
  risque (**≥ 40 ans**, ou plus jeune avec facteurs de risque / diabète ancien), et décision partagée
  **chez le sujet jeune** à bas risque ».

Or `age` n'intervient dans **aucune** condition d'option ; le gate `age >= 40` a été **rejeté** par le
référent le 2026-07-26 (F-statine §9.4), décision tracée trois fois dans le YAML
(`:106-114`, `:848`, changelog `:1043-1052`) et correctement rendue par le §3 du même argumentaire
(« l'âge n'intervient pas dans cette bascule »). Le tier « discuter » n'a pas non plus de condition de
jeunesse : un patient de 70 ans, diabète récent non compliqué sans FDR, l'atteint. Les deux
argumentaires décrivent donc un comportement que le nœud n'a pas — et l'argumentaire exhaustif se
contredit d'un § à l'autre.

### MOYENNE-6 — Kraut : « environ un tiers **réellement** intolérants à la statine » — le nœud applique à cette méta la lecture qu'il refuse (à raison) à GAUSS-3

Formulation présente **quatre fois** : `statine.yaml:534-535` (alerte affichée), `:590-591`
(argumentaire synthétique), `:743` (référence `kraut-2023`), `statine.argumentaire.md:204-205`.

**Ce que dit réellement la source** (PMC10735036, vérifié : 8 ECR, ~906/911 par bras) : **36 %
intolérants sous statine vs 26 % sous placebo**, RR 1,40 (1,23-1,60), **NNH 10** — c'est-à-dire un
**excès net d'environ 10 points**, soit **1 patient sur 10**, pas « un tiers ». Le score
symptomatique ne diffère pas (DM 1,08 [−1,51 à 3,67]).

Pour GAUSS-3, le nœud fait exactement la bonne opération (`statine.argumentaire.md:210-211` : « excès
net d'environ **16 points**, et non 42,6 % ») — parce que le red-team l'y a forcé (HAUTE-2). La même
structure statistique, dans la même section, est lue à l'arme brute pour Kraut. Le mot **« réellement »**
est ce qui rend l'énoncé faux : on ne peut pas être « réellement intolérant à la statine » à 36 %
quand 26 % le sont au placebo. L'énoncé triple la fraction attribuable, dans l'alerte même qui sert à
dissuader d'écarter la classe trop vite.

### MOYENNE-7 — L'option « haute intensité » cite HPS par son nom et son NNT, sans le déclarer en `references`

`statine.yaml:277` (« NNT ~12-20 sur 5-6 ans dans les sous-groupes de prévention secondaire (CARE,
**HPS**, LIPID) ») et `:283-285` (« **HPS ~20** ») ; `references` de l'option (`:290-299`) :
`ctt-diabete`, `ctt-more-vs-less`, `care`, `lipid`, `quatre-s`, `tnt`, `prove-it`, `quatre-d`,
`aurora` — **pas `hps`**, qui existe pourtant (`:606`) et est déclaré par le repli. L'invariant I8 ne
mord pas (il n'exige qu'**une** référence), mais c'est le décrochage exact que le lot « base
consolidée » visait.

---

## 4. Findings BASSE

- **BASSE-1 — Vignettes dont l'attente vient du moteur, pas du référent.** `evaluateNode.statine.test.ts:360`
  et `:370` s'intitulent « **CK > 5 N** » alors que le seuil est 4 ; F-19 pose en réalité `CK = 3`, soit
  ni > 4 ni > 5. F-18 (`:367`) et F-15 (`:334`) assertent sur la chaîne littérale « 5 fois la normale »,
  verrouillant l'erreur HAUTE-2 au lieu de la détecter. Ces titres et ces assertions ont été calés sur le
  texte observé du YAML.
- **BASSE-2 — Trous de couverture.** Aucune vignette ne couvre : CK > 10 N **sans** statine en cours
  (HAUTE-4) ; la bande 4-5 N (HAUTE-1/HAUTE-2) ; `intolerance_statine == averee` combiné à `CK > 4` sous
  statine (HAUTE-3) ; la borne `CK == 4` pile (vérifiée correcte au moteur : l'initiation reste offerte,
  conforme au « > 4x ULN » du parcours). Les trois premiers sont précisément les trous par lesquels
  passent les findings HAUTE.
- **BASSE-3 — Le commentaire « PORTÉE ÉCRITE DEUX FOIS » ne décrit pas le mécanisme réel.**
  `statine.yaml:201-205` justifie le terme redondant par le fait que `visible_si` n'est pas lu par le
  moteur. Mais `visible_si` porte sur `intolerance_statine != non`, alors que le terme redondant porte
  sur `statine_deja_en_place` : **aucune** expression du nœud ne redouble la portée réellement déclarée.
  Ce qui protège effectivement est générique et non mentionné : `reinitialiserChampsMasques`
  (`lib/formLayout.ts:126-161`) remet les champs masqués à leur défaut. Sans risque en l'état, mais le
  raisonnement écrit est faux et servirait de modèle ailleurs.
- **BASSE-4 — Tableau §6bis incomplet.** `statine.argumentaire.md:244-249` : la colonne « avant
  initiation » porte « — » pour les bandes 10-50 N et > 50 N, alors que la règle `> 4 N` s'y applique
  aussi (l'initiation y est bloquée). Le tableau laisse croire que la règle est bornée à 4-10 N.
- **BASSE-5 — Asymétrie sur la mortalité de CLEAR.** `statine.argumentaire.md:274-276` (« Ce qu'il ne
  faut jamais en dire : qu'il réduit la mortalité ») ne mentionne pas la strate prévention primaire, où
  décès CV **HR 0,61 (0,41-0,92)** et toutes causes **HR 0,73 (0,54-0,98)** sont nominalement
  significatifs (JAMA 2023, vérifié). Le YAML porte pourtant ce fait (`:713`, « signal fragile, non
  revendiqué »). L'écart va dans le sens conservateur, mais l'argumentaire est moins complet que la
  bibliographie qu'il est censé distiller.
- **BASSE-6 — Acide bempédoïque présenté comme agent autonome.** NG238 §1.10.2/§1.10.4 ne le recommande
  qu'**avec ézétimibe** (TA694), et le périmètre de remboursement français que le nœud cite lui-même
  (`:415`) exige « au moins l'ézétimibe ». L'option terminale (`:386`) le présente seul, sur ses propres
  données d'essai. Cohérent avec le fait que CLEAR l'a testé en monothérapie chez la plupart, mais la
  paire n'est pas dite.
- **BASSE-7 — ODYSSEY ALTERNATIVE : comparateurs non précisés.** `statine.yaml:738` juxtapose « LDL
  −45,0 % vs −14,6 % » (vs **ézétimibe**, critère principal) et « événements musculo-squelettiques
  HR 0,61 (0,38-0,99) » (vs **atorvastatine**, bras de rechallenge). Vérifié en source (PMID 26687696).
  Entrée bibliographique, non affichée comme revendication.

---

## 5. Ce qui est confirmé

Ce n'est pas du remplissage : la majorité de ce lot tient.

**Fidélité au parcours NHS, point par point** (`statin-intolerance-pathway.pdf` lu intégralement) —
l'option 1 est transcrite avec une exactitude inhabituelle :
- « Stop statin for 4-6 weeks / Document time to symptom onset and time to resolution » → rendu exact ;
- les **trois** conditions cumulatives de reprise (CK normalisées → symptômes résolus → asymptomatique
  ≥ 2 semaines) sont bien les trois losanges successifs de l'organigramme, dans l'ordre ;
- « Offer low or moderate dose of a higher intensity statin (**Atorvastatin 10 or 20 mg OD, or
  Rosuvastatin 5 or 10 mg OD**) » → verbatim ; « Titrate at **8 weeks** intervals » → verbatim. La
  correction annoncée du « atorvastatine 20 → 40 mg » de la collecte est **juste**, et importante ;
- « Therapy with a lower dose statin is preferred to no statin » ; « alternate day or twice-weekly
  dosing is a good option » ; « Rosuvastatin and atorvastatin have longer half-lives » → tous exacts ;
- « **cardiovascular benefits have not been proven for all the above approaches** » → cité fidèlement,
  et le nœud n'en tire pas plus que la source ;
- « **SINAM = la seule situation où le parcours proscrit la réexposition** » → exact : SRM 6 est bien la
  seule ligne portant « avoidance of re-exposure to statins » ;
- alerte > 50 N : « urgently seek specialist advice and inpatient assessment », « Do not wait for
  measurement of urinary myoglobin » → rendus exactement, réhydratation comprise ;
- provenance : « Dr Rani Khatib & Dr Dermot Neely on behalf of the AAC Clinical Subgroup. **Jan 2022.
  Review date: Jan 2024.** Pathway endorsed by NICE **Dec 2021** » → verbatim. La **correction
  d'attribution est juste** : le parcours n'est pas dans NG238 (confirmé par lecture du sommaire et des
  §1.5/1.9/1.10/1.11 de NG238), et NG238 remplace bien CG181 le 14 décembre 2023 (p. 4, verbatim).

**Références versées le 2026-07-27, re-vérifiées indépendamment en source primaire** — 6 sur 13
re-contrôlées ligne à ligne, **6/6 exactes** :

| id | Vérification |
|---|---|
| `clear-outcomes` (36876740) | 13 970 ; 40,6 mois ; 11,7 % vs 13,3 % ; HR 0,87 (0,79-0,96) ; IDM 0,77 ; revasc 0,81 ; goutte 3,1 vs 2,1 % ; lithiase 2,2 vs 1,2 % ✔ |
| `clear-diabete` (38061370) | Lancet D&E 2024 ; n = 6 373 (45,6 %) ; HR 0,83 (0,72-0,95) ; **ARR 2,4 %** ; p interaction 0,42 ; suivi médian 3,4 ans ✔ |
| `clear-primaire` (PMC10336623) | JAMA 2023 ; n = 4 206 ; ARR 2,3 % ; **NNT 43** ; décès CV 0,61 (0,41-0,92) ; toutes causes 0,73 (0,54-0,98) ✔ |
| `kraut-2023` (PMC10735036) | RR 1,40 (1,23-1,60) ; NNH 10 ; 36 % vs 26 % ; DM 1,08 (−1,51 à 3,67) ✔ *(cf. MOYENNE-6 sur l'interprétation)* |
| `aebi-2025` (PMC12698018) | 13 ECR / 1 868 participants ; symptômes OR 1,19 (0,86-1,64) NS ; arrêt OR 1,48 (1,03-2,12) ✔ |
| `improve-it-diabete` (29263150) | n = 4 933 (27 %) ; HR 0,85 (0,78-0,94) ; 5,5 % absolu à 7 ans ; p interaction 0,02 ✔ |
| `odyssey-alternative` (26687696) | critère principal = **% de baisse du LDL à S24** ; −45,0 % vs −14,6 % ; muscle HR 0,61 (0,38-0,99) ; intolérance **éprouvée** (≥ 2 statines, run-in placebo + bras rechallenge) ✔ |
| `ctt-bas-risque` (22607822) | CTT *Lancet* 2012, **27 essais** ; RR 0,79 / mmol/L ✔ |

**`type_critere` — aucune erreur trouvée.** En particulier `odyssey-alternative` est bien étiqueté
`substitution` (son critère principal EST le LDL) — c'est précisément le piège cherché, et il est
évité. `ctt-symptomes-musculaires`, `kraut-2023`, `aebi-2025`, `samson`, `statinwise`, `gauss-3` en
`substitution` : l'étiquette est un peu étirée (ce sont des critères de tolérance, pas des
substituts d'un bénéfice CV), mais l'énumération du schéma n'offre rien de mieux et le classement en
`dur` aurait été trompeur. `ewtopia-75`, `improve-it-diabete`, `lodestar`, `fourier-diabete` en `dur`
sont corrects.

**`niveau_preuve` — les 5 options respectent la règle « certitude, pas force de recommandation ».**
Option 1 `faible` (le parcours dit lui-même que le bénéfice CV n'est pas démontré) ; option 2 `eleve`
(CTT + ECR de prévention secondaire) ; option 3 `faible` (population définie par l'**absence** des
facteurs d'enrichissement des ECR → indirectness GRADE, pas « recommandation faible ») ; option 4
`modere` (CLEAR = 1 grand ECR, sous-groupe préspécifié) ; option 5 `modere`. Aucune ne rate dans le
sens interdit (aucune option n'est notée bas parce que la recommandation est molle). Réserve de
lecture, pas un finding : l'option 4 tient son `modere` de l'acide bempédoïque alors que son
`avantage` de tête est l'**ézétimibe seul**, dont l'option écrit elle-même qu'aucun essai de critère
dur ne l'a testé chez l'intolérant. `delai_benefice` est présent partout où la grammaire l'exige.

**Sécurité structurelle.** Aucune sortie vide n'est possible (le repli `default` ne porte aucune
exclusion et est toujours atteignable) ; la précédence `AND` > `OR` est confirmée dans
`engine/conditions.ts` (docstring + `splitTopLevel`), donc la condition de l'option terminale se lit
bien `averee OR (CK > 4 AND !statine)` ; le raisonnement sur les exclusions mortes du repli est
correct et bien documenté ; les 27 vignettes passent ; F-07 (82 ans + ASCVD → pas d'alerte > 75 ans)
et F-11/F-12 (alerte ASCVD restaurée après l'exclusion dialyse) protègent des comportements
réellement subtils. Le traçage des profils dialyse × statine × intolérance (profil H) est correct.

**Verbatims de la reco française 2026** confirmés par le red-team sur PDF intégral et cohérents avec
le nœud : « >5-fold […] are contraindications », « stopped permanently » au-delà de 10 N, « ezetimibe
alone may be considered », « last-resort treatment option », le caractère **non gradué** de cette
dernière mention, et la propriété de prodrogue hépatique. La nuance « écart de place, pas écart de
rang » face à l'ESC est correctement conservée dans les trois canaux.

---

## 6. Ce que je n'ai pas pu vérifier

- **Texte intégral de la reco SFE/SFD/NSFA/SFC 2026** (PMID 41651737) : pas de PDF local dans
  `docs/decision/sources/`, revue sous accès payant. Les verbatims utilisés ci-dessus proviennent du
  red-team du 2026-07-27, qui déclare avoir extrait le PDF intégral. **Non contourné** (invariant 7).
  Conséquence : le seuil « >5-fold » et le « stopped permanently » sont vérifiés **de seconde main**.
  Ils convergent toutefois avec NG238 sur le 5 N, ce qui renforce HAUTE-1.
- **Avis HAS NILEMDO** (dates du 12/02/2025 et 12/12/2025, ASMR V, périmètre restreint) : non ouvert,
  repris du red-team qui l'a extrait en PDF.
- **`sources/NICE 2023.pdf`** : lu aux pages 1-8, 18-21 et 36-42 (les sections qui portent le sujet du
  lot). Les §1.6/1.7 (traitement en prévention primaire/secondaire, y compris d'éventuelles
  recommandations diabète) **n'ont pas été lus** — hors périmètre du lot audité, mais à ouvrir avant de
  reprendre HAUTE-1, car ils pourraient porter d'autres divergences avec la stratification du nœud.
- **7 des 13 références versées** (`ewtopia-75`, `fourier-diabete`, `odyssey-outcomes-diabete`,
  `samson`, `statinwise`, `gauss-3`, ainsi que les 19 références antérieures au lot) : non
  re-vérifiées une à une. Le red-team du 2026-07-27 déclare 26/26 PMID conformes, et les 8 que j'ai
  re-contrôlées se sont toutes révélées exactes, ce qui donne une confiance raisonnable — pas une
  vérification.
- **Chiffres de l'option 2 et du repli** (CTT 2008 RR 0,79, CARE NNT ~12, TNT HR 0,75, CARDS HR 0,63,
  HPS RRR 33 %…) : validés référent le 2026-07-23 et hors périmètre des quatre lots audités ; non
  re-vérifiés.
- **Rendu écran réel** : je n'ai pas lancé le navigateur (règle du dépôt : la validation visuelle est
  humaine). Les sorties citées viennent du moteur et de `construireVueDecision`, pas d'une capture.

---

## 7. Sources

**Locales**
- `docs/decision/sources/statin-intolerance-pathway.pdf` — NHS England / AAC Clinical Subgroup,
  *Statin Intolerance Pathway*, Khatib R. & Neely D., Jan 2022, review date Jan 2024, endorsed by NICE
  Dec 2021. Lu intégralement (p. 1 organigramme, p. 2 classification SRM 0-6 + encadrés).
- `docs/decision/sources/NICE 2023.pdf` — **NICE NG238**, *Cardiovascular disease: risk assessment and
  reduction, including lipid modification*, publié le 14/12/2023, remplace CG181.
  Pages lues : 1-8 (identité, sommaire, « replaces CG181 »), 18-21 (**§1.5.7** CK avant initiation),
  36-42 (**§1.8** IRC, **§1.9.1-1.9.4** optimisation/rechallenge, **§1.10.1-1.10.4** alternatives,
  **§1.11.3-1.11.5** quand doser les CK).
- `docs/decision/validation/chantier-2026-07-27/preuve-intolerance-statine.md` (l. 85-135, 161, 317)
- `docs/decision/validation/chantier-2026-07-27/redteam-intolerance-statine.md` (l. 1-120, 230-270,
  370-415, 428-430, 481-482, 617)
- `content/noeuds/diabete-type-2/statine.yaml` · `.argumentaire.md`
- `src/features/decision/engine/evaluateNode.statine.test.ts` ·
  `src/features/decision/engine/banc/__snapshots__/caracterisation.statine.txt` ·
  `src/features/decision/engine/conditions.ts` · `src/features/decision/lib/formLayout.ts` ·
  `src/features/decision/screens/DecisionNodeScreen.tsx` · `schema/noeud.schema.json`

**En ligne (source primaire, ouvertes pour cet audit)**
- CLEAR Outcomes — https://pubmed.ncbi.nlm.nih.gov/36876740/
- CLEAR Outcomes, sous-groupe diabète — https://pubmed.ncbi.nlm.nih.gov/38061370/
- CLEAR Outcomes, strate prévention primaire — https://pmc.ncbi.nlm.nih.gov/articles/PMC10336623/
- Kraut 2023 (rechallenge en aveugle) — https://pmc.ncbi.nlm.nih.gov/articles/PMC10735036/
- Aebi 2025 — https://pmc.ncbi.nlm.nih.gov/articles/PMC12698018/
- IMPROVE-IT, sous-groupe diabète — https://pubmed.ncbi.nlm.nih.gov/29263150/
- ODYSSEY ALTERNATIVE — https://pubmed.ncbi.nlm.nih.gov/26687696/
- CTT 2012 (bas risque) — https://pubmed.ncbi.nlm.nih.gov/22607822/

---

## 8. Ordre de traitement suggéré

1. **HAUTE-1** — décision référent nécessaire : le seuil d'initiation reste-t-il à 4 N contre NG238 et
   contre la reco française, et le re-dosage à 7 jours est-il ajouté ? Toute la chaîne (critère,
   option 1, exclusions, condition terminale, alertes, argumentaires, vignettes) en dépend.
2. **HAUTE-3** puis **HAUTE-4** — deux exclusions/alertes à poser, sans arbitrage de fond nécessaire.
3. **HAUTE-2** et **MOYENNE-4** — reliquats « 5 N » à corriger avec HAUTE-1, plus les deux vignettes
   qui les verrouillent (BASSE-1).
4. **MOYENNE-1/2/3/5/6/7** — cohérence entre canaux ; MOYENNE-6 mérite l'attention du référent
   (formulation affichée à l'écran).

*Aucun fichier de `content/`, de `src/` ni aucun rapport existant n'a été modifié par cet audit.*
