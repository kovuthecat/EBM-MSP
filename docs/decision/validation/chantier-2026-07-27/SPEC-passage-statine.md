# Spécification du passage `statine.yaml` — arbitrages A1 + A2

> **Objet** : décrire, avant de l'écrire, le passage unique sur `statine.yaml` qui applique A1 (aligner
> sur NG238) et A2 (scinder « Interrompre »). Rédigée le 2026-07-27 (soir), après la recette visuelle.
> **Statut : à relire par le référent. Quatre points ne sont PAS tranchés par A1/A2 et ne peuvent pas
> l'être par moi — ils sont en §3.**
> Rien n'est modifié dans le contenu tant que ces quatre points n'ont pas de réponse.

---

## 0. Pourquoi ce passage est le prochain, et pourquoi il ne peut pas attendre

C'est la seule chose **cliniquement fausse encore en ligne**. Le moteur déclenche à **4 N** pendant que
deux textes visibles à l'écran annoncent **5 N** — la recette visuelle vient de le confirmer *sur
l'écran*, pas seulement dans le YAML (`recette-visuelle-lot1.md`, hors périmètre 1). Et un patient dont
les CK sont à 4,5 N avant initiation reçoit aujourd'hui **« statine indisponible »** là où NG238 demande
de **débuter à dose plus faible** : ce n'est pas un défaut d'affichage, c'est une **sous-prescription**
chez un patient dont le risque cardiovasculaire, lui, n'a pas bougé.

A1 et A2 sont indissociables et portent sur le même fichier (§2.0 du plan) : les appliquer séparément
laisserait le nœud dans un état intermédiaire incohérent.

## 1. État actuel — les cinq options, dans leur ordre

Le nœud est en **`ordered-first-match`** : la première option satisfaite l'emporte, et l'ORDRE porte ici
une garantie de sécurité explicitement documentée dans le fichier (commentaire du repli, `:450`).

| # | option | condition d'entrée |
| --- | --- | --- |
| 1 | Interrompre la statine 4 à 6 semaines et réévaluer | `intolerance_statine != non AND CK_x_normale > 4 AND statine_deja_en_place == true` |
| 2 | Statine de haute intensité — prévention secondaire | `ASCVD_etablie == true` |
| 3 | Discuter la statine (décision partagée) — bas risque | ancienneté < 10 ET 0 FDRCV ET non compliqué |
| 4 | Statine indisponible — alternatives hypolipémiantes | `intolerance_statine == averee OR intolerance_statine != non AND CK_x_normale > 4 AND statine_deja_en_place == false` |
| 5 | Statine (prévention primaire) | `default` |

Les options 2 et 3 portent en outre les exclusions `intolerance_statine == averee` et
`… CK_x_normale > 4 AND statine_deja_en_place == false`.

## 2. Ce que le passage fait, et qui ne demande aucun arbitrage

### 2.1 — Le seuil : 4 N → 5 N (A1‑a)

**Six expressions** portent `CK_x_normale > 4`. Toutes passent à `> 5` :

| ligne | rôle |
| --- | --- |
| `:232` | condition de l'option 1 |
| `:321` | exclusion de l'option 2 |
| `:333` | exclusion de l'option 3 |
| `:383` | condition de l'option 4 |
| `:420` | `quand` de l'alerte d'option 4 |
| `:230` | l'INTITULÉ de l'option 1 (« au-dessus de 4 fois la normale ») |

Les bandes **10 N** et **50 N** sont **inchangées** (A1 : le parcours NHS en reste seule source, NG238
ne les couvre pas). Elles deviennent mécaniquement 5‑10 / 10‑50 / > 50.

**A1 ajoute un re-dosage à 7 jours** — à porter dans le texte de l'option 1 (NG238 §1.5.7).

### 2.2 — Les textes qui annonçaient déjà 5 N deviennent vrais

Aucun changement à faire : le chapô (`:94`) et le message d'alerte (`:423`) disent **déjà** « 5 N ».
C'est l'incohérence que la recette a vue à l'écran ; elle se referme d'elle-même.

**En revanche** deux textes disent encore « 4 fois » et doivent suivre : l'intitulé de l'option 1
(`:230`) et le chapô de la quatrième situation (`:587` et `:596`).

### 2.3 — Ce qui ne bouge pas, et qu'il faut vérifier après coup

Le `visible_si` de `CK_x_normale` (`intolerance_statine != non`) et les gardes de portée répétés dans
chaque expression (R8 / I10) : **inchangés**. I10 et I11 doivent rester verts — c'est justement ce nœud
qui a produit le défaut de production du lot 1.

## 3. Les quatre points que je ne peux pas trancher

### Q1 — La bande basse commence à quel multiple ? **(le plus important)**

A1 écrit « à l'initiation, 4‑5 N → débuter à dose plus faible », parce que 4‑5 N est la bande qui reçoit
aujourd'hui la mauvaise réponse. Mais **NG238 ne dit pas 4‑5 N** : elle écrit *« raised but < 5× ULN »*
— c'est-à-dire **toute élévation** sous 5 N.

Les deux lectures ne recouvrent pas la même population :

| lecture | condition | qui change de conduite |
| --- | --- | --- |
| **(a) littérale NG238** | `CK_x_normale > 1 AND <= 5` | tout patient aux CK élevées sous 5 N — y compris **1‑4 N**, qui reçoit aujourd'hui une statine à dose pleine |
| **(b) restreinte au plan** | `CK_x_normale > 4 AND <= 5` | seulement la bande qui reçoit aujourd'hui « indisponible » |

**(a)** est fidèle à la source et cohérente avec « aligner sur NG238 » ; elle **modifie la conduite de
patients qui ne posaient aucun problème**, dans le sens de la prudence (dose plus faible plutôt que dose
pleine). **(b)** ne corrige que le défaut constaté et ne touche à rien d'autre.

*Je ne recommande pas* : c'est un choix de périmètre clinique, et il déborde ce que la recette a montré.

### Q2 — « Rassurer » : quel canal ?

A1‑c : sous traitement, CK < 5 N → **rassurer**. Ce n'est pas un geste thérapeutique, c'est une
information — D21 dirait donc une **alerte**, pas une option. Mais alerte de **nœud** (vue quelle que
soit la carte affichée) ou alerte d'**option** ?

**Ma recommandation : alerte de NŒUD**, `quand: "intolerance_statine != non AND CK_x_normale > 1 AND
CK_x_normale <= 5 AND statine_deja_en_place == true"`. Motif : le patient concerné peut atterrir sur
plusieurs cartes différentes (haute intensité, bas risque, repli) selon son profil ; accrocher le
message à l'une d'elles le ferait disparaître pour les autres.

⚠ La borne basse de cette alerte dépend de **Q1**.

### Q3 — La scission A2 coupe l'accès aux alternatives, et il faut le vouloir

A2 scinde l'option 1 en deux :

- « Interrompre et réévaluer » — intolérance **non avérée** ;
- « Interrompre — la classe reste indisponible » — intolérance **avérée**.

En `ordered-first-match`, la seconde gagne **avant** l'option 4 (« Statine indisponible — alternatives
hypolipémiantes »). Un patient à intolérance avérée et CK > 5 N sous traitement recevrait donc une carte
qui lui dit que la classe est fermée — **sans jamais voir l'orientation ézétimibe / acide bempédoïque /
anti‑PCSK9** qui est précisément la conduite à tenir ensuite.

Ce n'est **pas une régression** (aujourd'hui l'option 1 gagne déjà et produit le même effet), mais la
scission rend le trou beaucoup plus visible : on affirme explicitement « la classe reste indisponible »
sans dire par quoi la remplacer.

**Ma recommandation : porter l'orientation dans la carte « la classe reste indisponible »**, plutôt que
de déplacer l'ordre des options — l'ordre est ce qui protège le repli, et le fichier avertit
explicitement de ne pas y toucher. Reste à décider si l'on duplique le contenu ou si l'on renvoie à
l'autre carte ; la première solution est plus sûre à l'écran, la seconde évite une divergence de
contenu future.

### Q4 — Le nœud écrit quatre fois « rien de plus récent ne remplace le parcours ». C'est faux.

NG238 porte **son propre protocole de réintroduction** (§1.9.2‑1.9.4) et une section entière
« *Treatment if statins are contraindicated or not tolerated* » (§1.10). Le nœud s'appuie pourtant sur
le *Statin Intolerance Pathway* NHS/AAC de janvier 2022 — rattaché à CG181, **remplacée par NG238**, et
dont la date de révision est dépassée.

Deux décisions distinctes, à ne pas confondre :

1. **retirer les quatre affirmations fausses** (`:175`, `:240`, `:841`, et la note `:845`) — cela ne se
   discute pas, elles sont contredites par la source primaire ;
2. **changer de source pour le protocole de réintroduction** — cela, si.

⚠ Basculer sur NG238 rouvrirait les **trois autres arbitrages** rendus ce matin sur ce même dossier
(bandes 10 N / 50 N, arrêt temporaire vs définitif, protocole de réintroduction chiffré) : ils ont tous
été rendus *sur le parcours NHS*. Je ne fais rien de plus que le point 1 sans votre décision.

## 4. Contrôles de sortie du passage

- `npx tsc -b --noEmit`, `npm test`, `npm run build` ;
- **I9** — la dette « l'alerte annonce 5 N sous un déclencheur à 4 N » doit **expirer d'elle-même**
  (l'invariant échoue si on la laisse alors qu'elle n'a plus lieu d'être) ;
- **I10 / I11** — verts, gardes de portée intacts ;
- **couverture** — chaque nouvelle option applicable pour ≥ 1 profil, chaque exclusion mordante pour
  ≥ 1 profil ; la bande 10‑50 N n'est couverte par AUCUN profil figé (note `:843`), la vignette F‑24 la
  tient seule — à ne pas casser ;
- **golden master** — mesure §4bis : combien de profils gagnent ou perdent une option, et lesquels ;
- **D5** — bump de version + changelog dans le fichier ;
- `VALIDATION.md` — points de recette visuelle pour le référent.
