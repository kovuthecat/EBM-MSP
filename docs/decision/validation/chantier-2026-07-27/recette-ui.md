# Recette UI sur le déployé — 2026-07-27

> **Rôle** : source unique de vérité de cette recette. Défauts observés sur `ebm-msp.vercel.app`,
> cause racine vérifiée dans le code, arbitrages référent rendus le 2026-07-27, et ce qui reste ouvert.
> **Autosuffisant** : aucun élément ne suppose d'avoir suivi la session de recette.
> **Origine** : recette référent du 2026-07-27, nœuds `prescription` et `insuline`, version déployée
> `f6d36fe` (= `origin/main` au moment de la recette).
> **Portée** : défauts de MODÈLE et d'INTERFACE. Aucune erreur EBM relevée — même constat qu'à la
> recette élargie du 25-26/07 (`CONSTRUIRE-UN-MODULE.md` §0).

---

## Vue d'ensemble

| # | défaut | gravité | nature | statut |
|---|---|---|---|---|
| **A** | Le primer n'est jamais `touched` — 4 symptômes en cascade | 🔴 sécurité | moteur/UI | à corriger |
| **B** | Le repli `["default"]` s'affiche alors que des options sont EN ATTENTE | 🔴 sécurité | moteur/UI | à corriger |
| **C** | Une `liste` ne peut pas être indéterminée ⇒ sortie fausse | 🔴 sécurité | moteur | arbitré |
| **D** | Le repli affirme « objectif atteint » sans tester la cible | 🔴 sécurité | contenu | à corriger |
| **E** | « Corriger l'hypoglycémie » réduit la basale sans savoir si le bolus est en cause | 🔴 sécurité | contenu | arbitré |
| **F** | `visible_si` ne sait pas masquer UNE valeur d'une `liste` | 🟠 | schéma | arbitrage ouvert |
| **G** | `nature_intolerance` : garde non répété ⇒ « en attente » fantôme | 🟠 | contenu | à corriger |
| **H** | Le socle metformine préempte tout l'écran (repli d'affichage) | 🟠 | contenu + UI | arbitrage ouvert |
| **I** | « Pourquoi pas d'autres options » pollué par le hors-périmètre | 🟠 | moteur/UI | arbitrage ouvert |
| **J** | Un `calculs` non calculable disparaît en silence | 🟠 | moteur/UI | à corriger |
| **K** | TBR > 4 % ne déclenche aucune alerte | 🟠 | contenu | arbitré |
| **L** | `hypo_nocturne` n'encode pas le bon concept clinique | 🟠 | contenu | arbitré |
| **M** | Libellés AGP non parlants, descriptions en `title` natif | 🟡 | UI | arbitré |
| **N** | L'argumentaire par défaut écrase la lisibilité des options | 🟡 | UI | proposition |
| **O** | Champs sans effet : estomper, masquer ou replier ? | 🟡 | UI | proposition |
| **P** | Code couleur et réorganisation du formulaire | 🟡 | UI | proposition |

---

# 1. Défauts de sécurité

## A — Le primer n'est jamais `touched` (défaut racine)

**Le plus rentable de la liste : une ligne de correctif, quatre symptômes.**

### Mécanisme

`valeurParDefaut` renvoie la **première valeur déclarée** d'un `enum`
([`lib/formLayout.ts:54`](../../../../src/features/decision/lib/formLayout.ts)). Le rendu allume le
segment sur la seule égalité de valeur :

```ts
data-on={String(criteria[critere.nom] ?? '') === valeur || undefined}
```
([`components/CriteriaForm.tsx`](../../../../src/features/decision/components/CriteriaForm.tsx), bloc `segmente`)

Le primer s'affiche donc **sélectionné dès le chargement**, sans clic. Mais `touched` n'est alimenté
que par un `onChange` réel — donc le critère n'entre pas dans `renseignes`, et le moteur le tient
pour **indéterminé** (D20/R7).

> **L'écran affirme une chose, le moteur en croit une autre.** Tout le reste en découle.

Le même défaut vaut pour le rendu `<select>` (enum > 4 valeurs), qui affiche aussi sa première option.

### Symptômes constatés

| # | nœud | symptôme |
|---|---|---|
| A1 | `prescription` | « Traitements en cours » reste affiché alors que l'intention est **Initier** — le `visible_si: "intention != initier"` ([`prescription.yaml:67`](../../../../content/noeuds/diabete-type-2/prescription.yaml)) ne se déclenche jamais |
| A2 | `insuline` | Bloc MCG, GAJ et doses affichés chez un **naïf** — les **8 `visible_si: "situation_insuline != naif"`** du lot T4/(a) (26/07) sont intégralement neutralisés |
| A3 | `insuline` | Les **9 options** passent en attente, chacune réclamant « Situation d'insulinothérapie » — un champ que l'écran montre comme déjà répondu |
| A4 | `insuline` | « Poursuivre le schéma d'insuline en cours » proposé chez un **naïf** (conséquence de A3 + défaut B) |

`champEstVisible` applique le repli « fail open » de R7 (`!== false`) : condition indéterminée ⇒ champ
**visible**. Le comportement est correct pris isolément ; c'est son entrée qui est fausse.

### Correctif

1. `data-on` (et la valeur du `<select>`) doivent exiger `touched.has(critere.nom)` — aucun segment
   allumé tant qu'on n'a pas répondu. L'écran dit alors la vérité sur ce que le moteur sait.
2. Étendre le marqueur « à confirmer » aux `enum` : `estAConfirmer`
   ([`CriteriaForm.tsx`](../../../../src/features/decision/components/CriteriaForm.tsx)) n'accepte
   aujourd'hui que `nombre` et `bool` + `confirmation_requise`. Sans ça, rien ne signale que le primer
   manque.

### Vérification attendue

Sur `insuline`, formulaire vierge : aucune situation allumée, le bloc MCG **masqué**, et le primer
marqué « à confirmer ». Après clic sur « Naïf d'insuline » : le bloc MCG reste masqué, « Initier une
insuline basale » devient applicable.

---

## B — Le repli s'affiche alors que des options sont EN ATTENTE

**Constaté** : sur l'écran `insuline` naïf, les 9 options en attente **et** la carte « Poursuivre le
schéma d'insuline en cours » rendue avec le badge **« Recommandée »**.

Le moteur suspend explicitement son jugement (`enAttente`) et l'écran conclut quand même. C'est la
violation frontale de **R7** (« le moteur ne se prononce jamais sur ce qu'il ignore »), et elle est
**générique — tous nœuds, tous domaines**.

### Correctif

`enAttente` non vide ⇒ ni repli `["default"]`, ni badge « Recommandée ». Le bloc EN ATTENTE est alors
la seule sortie, ce qui est déjà son rôle déclaré
([`DecisionNodeScreen.tsx`](../../../../src/features/decision/screens/DecisionNodeScreen.tsx), commentaire
du bloc : *« sur formulaire vierge, c'est ce bloc qui prend le relais du panneau de résultats vide »*).

⚠ Interaction avec **D** : une fois B corrigé, le repli ne s'affichera plus à tort dans ce cas précis —
mais D reste à corriger pour tous les autres.

---

## C — Une `liste` vide est lue comme une réponse (⇒ sortie cliniquement fausse)

### Le cas

Situation « basale seule », patient **hors cible**, MCG disponible, `profil_glycemique` **non renseigné** :

- « Titrer la basale » exige `profil_nocturne_permet_titration` = *contient* `stable` **ou** `phenomene_aube`
- « Ne pas sur-titrer » exige `profil_nocturne_a_cible` = *contient* `excursions_postprandiales` (ou `over_basalisation`)

Liste vide ⇒ les deux dérivés valent **`false`** (déterminé, pas indéterminé : le fold de R7/D20 traite
`bool` et `liste` comme toujours déterminés) ⇒ aucune option ⇒ le repli l'emporte et affirme
**« objectif atteint »** chez un patient qui ne l'est pas.

### Ce qui rend le cas instructif

Le contenu **visait l'inverse et le dit** ([`insuline.yaml:184-189`](../../../../content/noeuds/diabete-type-2/insuline.yaml)) :

> une liste VIDE n'est PAS un profil « stable » […] absence de coche = ne pas se prononcer, jamais une
> lecture rassurante

La lettre est tenue (le dérivé reste faux). Mais **« ne pas se prononcer » n'existe pas dans le
système** : tomber au repli *est* une prononciation. La règle 2.1 de `CONSTRUIRE-UN-MODULE.md`
(« sur une `liste`, l'absence de coche n'est pas la valeur rassurante ») est respectée au niveau du
critère et défaite au niveau de la sortie.

L'erreur de raisonnement est dans la phrase suivante du même commentaire — *« ceci est une question de
contenu clinique, pas de saisie manquante »* — qui écarte `confirmation_requise`. **C'est bien une
saisie manquante.**

### ✅ Arbitrage référent (2026-07-27)

> **`profil_glycemique` devient OBLIGATOIRE dès lors que la MCG est disponible.**

Forme retenue :

```yaml
- nom: profil_glycemique
  type: liste
  visible_si: "situation_insuline != naif AND mcg_disponible == true"
  confirmation_requise: true
```

Deux prérequis techniques :

1. **Étendre `confirmation_requise` au type `liste`** (schéma + `estAConfirmer`, aujourd'hui limité à
   `nombre` et `bool`).
2. **Vérifier qu'un champ masqué ne compte pas comme manquant** — sinon un patient sans MCG aurait
   toutes ses options en attente indéfiniment. À couvrir par un test.

---

## D — Le repli affirme « objectif atteint » sans jamais tester la cible

[`insuline.yaml:700`](../../../../content/noeuds/diabete-type-2/insuline.yaml) :

```yaml
- intitule: "Poursuivre le schéma d'insuline en cours et réévaluer"
  conditions: ["default"]        # aucun prerequis, aucun garde-fou
  avantages:
    - "Aucun ajustement n'est indiqué : objectif atteint, sans hypoglycémie ni variabilité…"
```

Le texte énonce un **fait faux sur le patient** dès que `cible_atteinte == false`. Même B et C
corrigés, il reste faux à chaque nouveau trou de couverture.

### Deux voies (à trancher)

- **rendre le repli muet sur la cible** — réécriture de prose seule, sans effet moteur ;
- **le scinder en deux** : « à l'objectif → poursuivre » / « hors objectif, données insuffisantes pour
  trancher → renseigner X ». La seconde branche recoupe le registre `enAttente` (défaut B) et fait donc
  double emploi une fois B corrigé.

Recommandation : **voie 1**, B couvrant déjà la seconde. Vérifier que le nœud `prescription` ne porte
pas la même formulation sur son propre repli.

---

## E — « Corriger l'hypoglycémie » réduit la basale sans savoir si le bolus est en cause

[`insuline.yaml:346`](../../../../content/noeuds/diabete-type-2/insuline.yaml) — l'option recommande
**« réduire la basale de −2 à −4 U »** avec `calculs: dose_basale_actuelle * 0.8`, **sans condition**,
alors qu'elle se déclenche sur `TBR > 4` y compris en `basale_plus_bolus`, où l'hypoglycémie peut être
post-bolus.

Le nœud **sait déjà** faire la distinction : `hypo_interprandiale` « accuse le BOLUS, pas la basale »
([`:686`](../../../../content/noeuds/diabete-type-2/insuline.yaml)), et une autre option énonce la règle
complète en prose (« hypo nocturne → réduire la basale ; hypo interprandiale → réduire le bolus »).
L'option de correction l'ignore.

**Ce n'est pas une maladresse de libellé : c'est un chiffre de dose faux remis au praticien.**

### ✅ Arbitrage référent (2026-07-27)

> **Scinder « Corriger l'hypoglycémie ou la variabilité » : l'agent à réduire dépend du profil
> glycémique (basale vs rapide).**

Cadres opposables déjà écrits : **R3** (le verdict sur une ligne est une décision à part entière) et
checklist **2.2** de `CONSTRUIRE-UN-MODULE.md` (« son intitulé ne nomme qu'UNE classe ou molécule » —
ici, une insuline). Le regroupement paraissait économique ; il produit un défaut de sécurité, exactement
comme le couple sulfamide/glinide du 27/07.

---

# 2. Défauts fonctionnels

## F — `visible_si` ne masque pas UNE valeur d'une `liste`

**Constaté** : chez un patient déclaré **naïf d'insuline**, « Insuline basale » et « Insuline rapide »
restent cochables dans `traitements_en_cours`.

Le contenu ne peut rien y faire, et le dit déjà
([`insuline.yaml:156`](../../../../content/noeuds/diabete-type-2/insuline.yaml)) :

> `visible_si` porte sur un champ entier : impossible de masquer UNE valeur d'une liste dont les quatre
> autres restent pertinentes

Contournement déjà employé **deux fois** : scinder la valeur en critère propre (`hypo_interprandiale`,
27/07). Ne passe pas à l'échelle pour `traitements_en_cours`, critère partagé avec `prescription`.

Une alerte de nœud couvre déjà l'incohérence de saisie
([`insuline.yaml:726`](../../../../content/noeuds/diabete-type-2/insuline.yaml)) — mais par **R8**, une
alerte ne retire rien : elle commente une saisie qu'il faudrait empêcher.

### Arbitrage ouvert

| voie | pour | contre |
|---|---|---|
| **`visible_si` par valeur de `liste`** (schéma) | générique, sert aussi le cas AGP et tout futur domaine | évolution de schéma + moteur de formulaire |
| scission en critère propre | déjà éprouvée | ne passe pas à l'échelle, duplique un critère partagé |
| alerte de cohérence | zéro coût | R8 : ne retire rien — commente au lieu d'empêcher |

**Recommandation** : la première. Troisième occurrence du même manque ⇒ le mécanisme vaut son coût.

---

## G — `nature_intolerance` : garde non répété ⇒ « en attente » fantôme

**Constaté** sur `prescription` : « Réduire la posologie de la metformine — à renseigner : *Nature de
l'intolérance* », alors qu'aucune intolérance n'est déclarée et que le champ est masqué.

[`prescription.yaml:378`](../../../../content/noeuds/diabete-type-2/prescription.yaml) :

```yaml
- "DFG >= 45 AND DFG < 60 AND dose_metformine > 2000
   OR DFG >= 30 AND DFG < 45 AND dose_metformine > 1000
   OR nature_intolerance == digestive"     # ← branche sans son garde
```

`nature_intolerance` porte `visible_si: "intolerance_traitement == true"`
([`:155`](../../../../content/noeuds/diabete-type-2/prescription.yaml)). Champ masqué ⇒ jamais
`touched` ⇒ **indéterminé** ⇒ `false OR false OR indéterminé = indéterminé` ⇒ option en attente sur un
champ que l'écran n'affiche pas.

C'est **exactement le piège écrit dans R8** (`GRAMMAIRE-NOEUD.md`, dernier paragraphe) : *un critère dont
la portée est conditionnelle doit répéter cette condition dans chaque expression qui le lit.* La règle
avait été écrite pour un cas de sécurité (`CK_sup_5N`) ; le même mécanisme produit ici un faux
« en attente ».

### Correctif

`intolerance_traitement == true AND nature_intolerance == digestive`.

**À balayer dans le même lot** — mêmes lectures non gardées de `nature_intolerance` :
[`:796`](../../../../content/noeuds/diabete-type-2/prescription.yaml),
[`:808`](../../../../content/noeuds/diabete-type-2/prescription.yaml) (réduire AR GLP‑1 / tirzépatide)
et l'alerte [`:1119`](../../../../content/noeuds/diabete-type-2/prescription.yaml).

### Invariant de banc à ajouter

> Tout critère porteur d'un `visible_si` voit ce garde répété dans **chaque** expression qui le lit.

Mécaniquement vérifiable, aurait attrapé les quatre occurrences.

---

## H — Le socle metformine préempte tout l'écran

**Constaté** : une seule carte dépliée (« Metformine — instaurer ou poursuivre »), les 6 autres options
repliées sous « Autres pistes possibles (6) » — donc la seule option visible d'emblée est celle qui
n'appelle aucune action.

Cause : le repli d'affichage ne garde dépliées que les options du **meilleur rang**
(`meilleur = min(rangs)`, [`lib/replierAffichage.ts`](../../../../src/features/decision/lib/replierAffichage.ts)).
Le socle est seul à `priorite: 0` ⇒ tout le reste part au rang ≥ 1.

Le repli suppose que le rang hiérarchise des gestes **comparables** ; un socle permanent à rang 0 défait
l'hypothèse.

### Trois volets, indépendants

1. **Affichage** — `partitionnerAffichage` devrait exclure les options `["toujours"]` du calcul du
   meilleur rang (ou partitionner sur un compte plutôt qu'un rang). Sans ça, le défaut revient dès
   qu'une option de sécurité solitaire occupe le meilleur rang.
2. **Contenu (arbitrage ouvert)** — position du référent : *« poursuivre » n'est pas une action ; ne
   l'afficher que lorsque c'est la seule option, pour ne pas laisser un vide.* C'est la sémantique
   `["default"]`, que la metformine avait **avant D16** (23/07, arbitrage inverse : « proposer en base,
   les autres en parallèle »). ⚠ Le nœud porte **déjà** un repli `["default"]` (« Poursuivre le
   traitement en cours et réévaluer ») : deux `default` demandent un arbitrage explicite (fusion ? le
   socle devient-il un cas du repli existant ?).
3. **Intitulé** — « **instaurer** ou poursuivre » alors que le nœud *sait* que la metformine est cochée :
   cas d'école **R9**. L'information est disponible, l'intitulé ne s'en sert pas.

---

## I — « Pourquoi pas d'autres options ? » pollué par le hors-périmètre

Sur 18 lignes listées, la majorité disent « Traitements en cours comprend Sulfamide / Gliptine /
Insuline… » chez un patient qui n'en prend aucun. Ce n'est pas une explication clinique, c'est un
constat de périmètre.

Cause : `nonRetenues` enregistre la première expression fausse parmi `conditions` **+** `prerequis`
confondus ([`engine/evaluateNode.ts`](../../../../src/features/decision/engine/evaluateNode.ts)), et dans
le contenu la présence de la ligne est écrite en **`condition`**
(ex. [`prescription.yaml:713`](../../../../content/noeuds/diabete-type-2/prescription.yaml)).

### Arbitrage ouvert

| voie | pour | contre |
|---|---|---|
| **(a)** passer les tests de présence en `prerequis` + rendre un `prerequis` faux silencieux | c'est ce que R6 livraison 2 annonce (« garde-fous de cohérence, silencieux à l'écran ») | frottement avec **R3** : la présence de la ligne EST le déclencheur du verdict ; la vider des `conditions` laisse ces options sans « pourquoi » montrable une fois applicables (garde explicite dans `evaluateNode`) |
| **(b)** masquer de « pourquoi pas » les options dont l'expression fausse est un `contient` sur un critère de type `liste` | générique **par le type**, aucun nom en dur (invariant 5) ; le moins invasif | heuristique implicite |
| **(c)** nouveau champ de contenu déclarant l'objet du geste | explicite | évolution de schéma |

**Recommandation** : **(b)** pour livrer, en consignant **(a)** comme forme propre à terme.

---

## J — Un `calculs` non calculable disparaît en silence

Sur `insuline`, l'option « Initier une insuline basale »
([`:278`](../../../../content/noeuds/diabete-type-2/insuline.yaml)) porte :

```yaml
calculs:
  - { libelle: "Dose initiale (0,1 U/kg)", expression: "poids * 0.1", unite: "U/j" }
  - { libelle: "Dose initiale (0,2 U/kg)", expression: "poids * 0.2", unite: "U/j" }
```

Les `calculs` non calculables sont **omis** de la carte (`construireVueDecision`). Or `poids`
n'apparaît **ni** dans `enAttente` (ce registre ne couvre que `conditions`/`prerequis`/`exclusions`)
**ni** dans le marqueur « à confirmer ». Résultat : la carte s'affiche **sans aucune dose**, et rien
n'indique qu'un poids la ferait apparaître. Le repli « 10 U le soir » n'existe qu'en prose dans
`effet_attendu`.

Angle mort du registre `enAttente` : un critère qui n'alimente qu'un `calculs` est **décisif à l'écran
sans être décisif pour le moteur** — même famille que la nuance R5 déjà consignée (« changer l'écran,
pas la sortie du moteur »).

### Correctif

Faire entrer les critères d'un `calculs` non résoluble dans les critères réclamés (registre `enAttente`
ou marqueur « à confirmer », à choisir), pour l'option concernée seulement.

---

## K + L + M — Le bloc MCG

### ⚠ Correction d'une affirmation fausse émise pendant la recette

Il a été dit en séance que TBR, TBR sévère et CV « n'apparaissent qu'en `exclusions` ». **C'est faux** :
ils sont aussi **déclencheurs positifs** dans quatre options
([`:364`](../../../../content/noeuds/diabete-type-2/insuline.yaml),
[`:528`](../../../../content/noeuds/diabete-type-2/insuline.yaml),
[`:581`](../../../../content/noeuds/diabete-type-2/insuline.yaml),
[`:690`](../../../../content/noeuds/diabete-type-2/insuline.yaml)). Ne pas propager.

Ce qui reste vrai : **ils n'aident jamais à *choisir* entre titrer et ne pas titrer.** Ce routage
positif repose à 100 % sur `profil_glycemique` — d'où la gravité de **C**.

### Ce que conditionne réellement `CV_glycemique > 36` (cinq rôles)

| rôle | portée |
|---|---|
| **Déclenche** « Corriger l'hypoglycémie ou la variabilité » (seul suffit) | basale seule + basale-plus-bolus |
| **Déclenche** « Ajouter un GLP‑1 d'abord » et « Ajouter un bolus » | en **basale seule** : « la basale ne peut plus être titrée, escalader autrement » |
| **Exclut** « Titrer la basale » et « Ne pas sur-titrer » | basale seule |
| **Exclut** les deux options d'escalade | en **basale-plus-bolus** : le bolus existe déjà ⇒ corriger, pas escalader |
| **Déclenche** l'alerte d'orientation spécialiste | avec TBR sévère > 1 et hypo sévère récurrente |

En une phrase : **CV > 36 % = « la basale n'est plus titrable en sécurité »**. Réserve à afficher :
36 % est un **seuil de consensus** (Battelino/ATTD), pas un seuil validé sur critère dur — le nœud le
sait, l'écran ne le dit pas.

### K — ✅ Arbitrage : TBR et TBR sévère doivent déclencher une alerte

Aujourd'hui **TBR > 4 % ne déclenche aucune alerte** (seul TBR *sévère* nourrit l'alerte d'orientation).
Par **D21/R8**, un TBR > 4 % est vrai quel que soit le geste retenu ⇒ **alerte de nœud**.

### L — ✅ Arbitrage : `hypo_nocturne` n'encode pas le bon concept

Concept clinique visé, mots du référent : *une courbe qui descend toute la nuit, même sans hypoglycémie
au réveil (parce qu'on part de haut), montre une basale trop importante.* Ce n'est pas « hypoglycémie
nocturne » — c'est plus large, et c'est ce qui a une conséquence thérapeutique.

**Trois conséquences à ne pas manquer :**

1. la valeur est lue dans **une dizaine d'expressions** (conditions + exclusions) ;
2. l'option qu'elle déclenche s'intitule « Corriger **l'hypoglycémie** ou la variabilité » — **le titre
   devient faux** pour une descente sans hypoglycémie. À retitrer, et de toute façon à scinder (cf. **E**) ;
3. changer une valeur d'une `liste` **casse les fixtures gelées du banc** : appliquer la procédure §4bis
   de `CONSTRUIRE-UN-MODULE.md` (retrait manuel de la seule colonne concernée, régénération, relecture
   **valeur par valeur** du golden master — jamais sur la foi du diff).

**Sourçage** : rattacher l'interprétation AGP (descente nocturne = excès de basale) à une référence déjà
présente (référentiel MCG SFD / Battelino) — invariant 6.

### M — ✅ Arbitrage : libellés AGP non parlants

« Phénomène de l'aube » et les descriptions au survol ne parlent pas au non-initié. Décrire le **fait**,
pas le nommer : *« la glycémie remonte en fin de nuit / au petit matin »*.

⚠ Les descriptions passent par un `title` HTML natif (`describeEnumValue`) — **invisible au doigt**.
Pour une liste de 4 valeurs qui porte à elle seule tout le routage, **descendre les descriptions en clair
sous chaque case** plutôt que de les cacher derrière un survol.

---

# 3. Propositions d'ergonomie (non arbitrées)

## N — L'argumentaire par défaut écrase la lisibilité

**Proposition référent** : carte = intitulé + badges + « Proposé parce que » ; le corps actuel
(effet attendu, délai, avantages, inconvénients) derrière une icône « EBM » ; et le niveau intermédiaire
(`ArgumentPanel`) est peut-être de trop face à l'exhaustif, mieux structuré.

**Deux réserves avant câblage :**

- **`contre_indications` est aujourd'hui dans le corps de carte.** Le basculer derrière un survol le
  sort du champ visuel — or **D21/R8** pose qu'un fait de sécurité s'affiche avec son motif. À garder
  sur la carte, ou à traiter comme un canal distinct.
- **Le survol n'existe pas au doigt.** En consultation sur tablette, « survoler une icône EBM » n'est pas
  actionnable : il faut un clic/tap qui déplie, jamais un `title`.

## O — Champs sans effet : ni masquer, ni laisser tel quel

**Ne pas masquer sur `pertinents`.** Le moteur de pertinence porte une limite documentée
([`engine/relevance.ts`](../../../../src/features/decision/engine/relevance.ts)) : la perturbation teste
**un critère à la fois**, donc un critère décisif seulement **en conjonction** avec un autre critère
lui-même indéterminé n'est **pas détecté**. Sur formulaire vierge — l'état de départ normal — cette
classe de faux négatifs est à son maximum. Estomper un champ décisif est un inconfort ; **le masquer le
rend inatteignable**.

Second motif : `pertinents` est **contingent** (il change à chaque saisie) là où `visible_si` est
**déclaré et stable**. Masquer sur une valeur contingente ferait clignoter les champs pendant la frappe.

**Proposition : replier par SECTION.** Une section dont *tous* les champs sont non pertinents **et** non
saisis se réduit à une ligne (« *Terrain et préférences — aucun de ces critères ne change la reco
actuelle (4)* ▸ »). Le scroll tombe, tout reste atteignable en un clic, et une section bascule beaucoup
moins souvent qu'un champ isolé. Garde-fou : ne jamais replier une section contenant un champ `touched`
ou `aConfirmer`.

**Voie de fond** : convertir en `visible_si` tout ce qui est estompé pour une raison **sémantique**
(« cette question n'a pas d'objet ») plutôt que contingente. Ceux-là peuvent disparaître sans risque.

## P — Code couleur et réorganisation

### Principe non négociable

> **La couleur code l'état de la RÉPONSE, jamais la valeur clinique.**

Un DFG qui passerait au rouge à 28 serait un jugement clinique rendu par un **cinquième canal**, hors des
quatre de D21 : absent du YAML, non sourcé, invisible à la vérification bi-agents, intestable par le
banc. C'est le score caché qu'interdit l'invariant 2.

### Suggestions compatibles

1. **Rendre visible le troisième état de réponse.** D20 distingue `saisi` / `suggéré` / `indéterminé`,
   mais `suggéré` et `saisi` sont **identiques à l'écran** — or D20 pose qu'une valeur suggérée ne doit
   jamais être citée comme un fait du patient (défaut déjà survenu en recette). Bord pointillé + teinte
   légère sur `suggéré`.
2. **Une seule couleur pour « ce que l'outil attend de vous »** : l'ambre `--c-attention` du bord gauche,
   réservé strictement à *décisif et manquant*. Pas de troisième couleur sur ce bord.
3. **En-têtes de section porteurs d'état** : `TERRAIN ET PRÉFÉRENCES · 3/5 · ●`. C'est ce qui rend le
   scroll navigable — on voit d'en haut ce qu'il reste.
4. **Teinter par `groupe`, pas par valeur.** Cocher « Cétonémie » et cocher « Metformine » produisent
   aujourd'hui la même pastille indigo alors que l'une est un drapeau et l'autre un fait. Une teinte de
   fond par section, pilotée par le `groupe` **déclaré dans le contenu** — générique, aucun nom de
   critère dans le code (invariant 5).
5. **Le primer mérite un traitement à part** : surface accent décision, pleine largeur, détaché de la
   carte de formulaire.
6. **Seul rouge légitime : la valeur hors domaine.** Les bornes `min`/`max` existent mais une violation
   n'est pas signalée. Validité de donnée, pas jugement clinique.

### Réorganisation, par gain de scroll décroissant

1. **Sortir le résultat du bas de page** — rail collant à droite. Aujourd'hui chaque saisie impose un
   aller-retour pour voir l'effet. C'est le seul changement qui attaque la cause plutôt que la quantité.
   (Déjà la direction de la maquette 4a / T-026 Lot 4.)
2. **Le repli par section** de la proposition O.
3. **`traitements_en_cours` avant `HbA1c`** — c'est le champ de plus fort levier du nœud, et celui qu'on
   sait de tête avant de regarder la biologie.
4. **« Rien à signaler » remonté en tête de section** pour les drapeaux : aujourd'hui en pied, il oblige
   à parcourir les 6 cases avant de pouvoir répondre « non » d'un clic.

⚠ **Piège de séquencement** : tout flux par étapes (« l'intention d'abord, le reste ensuite ») suppose de
savoir si le primer a été *répondu*. **Le défaut A doit donc être corrigé avant**, pas en même temps.

---

# 4. Ordre de livraison suggéré

| lot | contenu | motif |
|---|---|---|
| **1** | **A** + **B** | Deux corrections d'UI/moteur qui referment à elles seules 5 symptômes observés, dont deux sorties cliniquement fausses. Restaurent la couche `visible_si` sur les deux nœuds. |
| **2** | **C** (+ extension `confirmation_requise` aux `liste`) · **D** · **G** + son invariant de banc | Sécurité et faux « en attente ». `C` dépend de `B` pour être pleinement visible. |
| **3** | **E** · **K** · **L** · **M** | Contenu `insuline` : un seul passage sur le fichier, une seule régénération du golden master (§4bis). |
| **4** | **H** · **I** · **J** | Affichage et registres — aucun impact clinique direct. |
| **5** | **N** · **O** · **P** | Ergonomie, après arbitrage référent. |

**Discipline applicable** (`CONSTRUIRE-UN-MODULE.md` §6) : des agents parallèles ne partagent jamais un
fichier. Les lots 2 et 3 touchent tous deux `insuline.yaml` ⇒ **à sérialiser**.

**Chaque lot passe par la piste B du §P6** (banc + invariants), y compris les correctifs : *« un correctif
est un changement de comportement comme un autre »* (§4bis). La mesure attendue n'est pas le nombre de
lignes changées mais **combien de profils gagnent ou perdent une option, et lesquels**.

---

# 5. Hors périmètre de ce document

- Aucune **erreur EBM** relevée pendant cette recette — le contenu clinique n'est pas en cause.
- La **validation clinique** de `prescription.yaml` (encore `brouillon` v0.9) et d'`insuline.yaml` reste
  due, indépendamment de ces correctifs.
- `prescrire 12.pdf` toujours vide, à re-fournir.
