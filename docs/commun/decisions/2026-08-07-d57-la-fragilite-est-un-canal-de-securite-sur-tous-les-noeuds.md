# 2026-08-07 — D57 · `fragilite` est un canal de sécurité sur les cinq nœuds qui la déclarent

### Décision

Tranche l'**arbitrage 2** laissé ouvert par la matrice des faits de sécurité du domaine
(`docs/decision/validation/criteres-communs-2026-08-06.md` §6).

`fragilite` devient un **canal de sécurité** — une alerte `niveau: attention` — sur **`insuline`** et
**`cible-glycemique`** aussi, en plus des trois nœuds qui en portaient déjà un (`prescription`,
`rhd-activite-physique`, `rhd-alimentation`). Harmonisation **complète** sur les **cinq** nœuds du
domaine qui déclarent ce fait.

**Décision référent, en conversation, le 2026-08-07** : « *passons en sécurité partout* ».

**Le mandat porte sur le CANAL, jamais sur le FAIT.** `fragilite` reste `partage: true`, encodée à
l'identique sur les cinq nœuds — I19/I32 restent verts. Ce qui change, c'est qu'elle **a désormais une
voix propre** partout, et non plus seulement un effet mécanique noyé dans un dérivé.

### Contexte

`fragilite` était déclarée à l'identique (`partage: true`, `type: bool`, même absence de
`presomption_non`) sur les cinq nœuds, et servait de canal de sécurité sur **trois** d'entre eux :
`prescription` (quatre alertes + une exclusion sulfamide), `rhd-activite-physique` (alerte),
`rhd-alimentation` (deux exclusions). Sur `insuline` et `cible-glycemique`, elle n'était lue que par des
dérivés ou des `conditions` consommées par des options `role: geste` — jamais un canal explicite au sens
de **R8**.

La matrice avait posé la question sans la trancher, faute de pouvoir dire si c'était une différence
*voulue* (ces deux nœuds n'ont peut-être aucun geste dont la fragilité change la sécurité) ou un *oubli*
du même ordre que `cetonemie`/`hypo_severe_recurrente` — les deux réponses exigeaient un jugement
clinique sur ce que la fragilité *devrait* changer, que le diagnostic ne pouvait pas produire seul.

**Un invariant avait déjà posé la même question, avant que quiconque ne la formule.** Le registre
`DRAPEAUX_SANS_VOIX_PROPRE_CONNUS` de l'invariant **I14** (« un drapeau qui n'agit qu'à travers un
`derive` n'a pas de voix propre ») listait `insuline.fragilite` avec ce commentaire, écrit **avant**
l'arbitrage :

> « Trouvé PAR CET INVARIANT, hors recette. `fragilite` n'agit qu'à travers le dérivé de cible
> assouplie. **QUESTION AU RÉFÉRENT** : l'écran doit-il DIRE que la cible est assouplie PARCE QUE le
> patient est fragile ? Le nœud `prescription`, lui, porte bien une alerte sur ce terrain. »

### Raison du choix — le trou que ça ferme

**Sur `insuline`**, avant cette décision, `fragilite` n'avait d'effet visible **que** via
`risque_hypoglycemique_eleve`, lui-même limité à la seule situation `basal_bolus` (carte
« Désintensifier / alléger le schéma »). Pour un patient fragile en situation `naif`, `basale_seule` ou
`basale_plus_bolus`, **sans capteur**, `fragilite` n'avait **strictement aucun effet à l'écran**. Trois
situations sur quatre où le praticien cochait une case sans que rien ne s'ensuive.

**Sur `cible-glycemique`**, `fragilite` assouplissait déjà **mécaniquement** la cible (elle est l'une des
branches du `OR` de « Cible ≤ 8 % » et le garde négatif de « Cible ~6,5 % »), mais l'écran ne **disait**
pas pourquoi. La nouvelle alerte explicite le motif clinique — sur-traitement, hypoglycémie — plutôt que
de laisser le praticien déduire la causalité d'une carte.

**Rien d'inventé : chaque clause des deux alertes est sourcée par du texte déjà présent et validé dans le
nœud concerné**, sans un chiffre nouveau (CLAUDE.md invariant 6). Sur `cible-glycemique`, les chiffres
sont repris mot pour mot de l'`effet_attendu` et des `avantages` de l'option « Cible ≤ 8 % » (mortalité
toutes causes non réduite, 1,04 non significatif ; hypoglycémie sévère × 2 à 2,5 — Boussageon 2,33,
Turnbull/CONTROL 2,48). Sur `insuline`, du `posologie_detail` de « Initier une insuline basale » (choix de
molécule piloté par le risque hypoglycémique, SFD 2025 Avis 18 bis), de l'alerte
`hypo_severe_recurrente` voisine, et de deux mécanismes déjà existants du nœud.

**`fragilite == true` seul, pas un dérivé agrégé — et le motif fait règle.** Les deux dérivés candidats
ont été considérés puis écartés :

- `risque_hypoglycemique_eleve` agrège aussi `age >= 75`, `esperance_vie == limitee`,
  `risque_hypoglycemie_schema == eleve` et `hypo_severe_recurrente`. L'employer aurait (a) **dilué** le
  signal précis que l'arbitrage demande d'élever dans quatre autres faits, et (b) fait **doublonner**
  la nouvelle alerte avec l'alerte `hypo_severe_recurrente` juste au-dessus — un même fait cité deux
  fois sous deux formes, côte à côte ;
- `terrain_cible_assouplie` sert un objet différent (repère de cible MCG, `niveau: info`) et n'est actif
  que si `mcg_disponible == true` — ce qui aurait laissé sans aucun signal, à nouveau, le patient fragile
  **sans capteur**.

`fragilite == true` seul isole exactement le fait visé, sur le même principe que les quatre alertes
`fragilite` déjà en place dans `prescription`, toutes conditionnées sur le fait nu.

### Aucune exclusion ajoutée — et c'est un résultat, pas une omission

Ni `cible-glycemique` ni `insuline` n'ont reçu de nouvelle `exclusions`. Lecture attentive des deux
nœuds : aucun geste **précis et nommé** n'apparaît comme cliniquement inapproprié chez un patient fragile
sans être déjà couvert. Sur `cible-glycemique`, il n'y a qu'un choix de cible, pas un geste
thérapeutique — rien à exclure. Sur `insuline`, la fragilité **oriente** déjà (molécule à l'initiation,
allègement en basal-bolus, cibles MCG) sans qu'aucune option ne prescrive un geste identifiable comme
dangereux chez le sujet fragile *en tant que tel* — à la différence de `prescription`, où le sulfamide,
hypoglycémiant par construction, est explicitement exclu sur `fragilite == true`.

### Ce qui reste interdit

1. **Toucher au FAIT pour changer le CANAL.** `fragilite` reste `partage: true` et encodée à l'identique
   sur les cinq nœuds ; ajouter un canal ne justifie jamais de diverger sur la définition (R14).
2. **Conditionner une alerte de fait de sécurité sur un dérivé agrégatif** quand c'est le fait précis
   qu'on veut rendre visible — sous peine de diluer le signal et de doublonner une alerte voisine.
3. **Étendre cette décision aux trois autres branches du même `OR`** (`comorbidite_grave`,
   `esperance_vie == limitee`, `ASCVD_etablie`) sans arbitrage propre : elles restent silencieuses, hors
   du mandat rendu le 2026-08-07.

### Conséquences

- **Contenu** : `cible-glycemique.yaml` v2.18 → v2.19 (première section `alertes` du nœud, une entrée) ;
  `insuline.yaml` v0.57 → v0.58 (une alerte insérée après celle sur l'hypoglycémie sévère récurrente,
  même registre).
- **Dette I14 résorbée** : l'entrée `insuline.fragilite` quitte `DRAPEAUX_SANS_VOIX_PROPRE_CONNUS`
  (`engine/banc/invariants-contenu.test.ts`), remplacée par un commentaire « dette résorbée » — le fait a
  désormais une citation hors `derive`. C'est la troisième résorption de ce registre, sur le même modèle
  que les deux précédentes.
- **Golden master** : les quatre snapshots concernés régénérés, diff vérifié **par script** — retrait du
  seul texte de la nouvelle alerte, puis comparaison **octet à octet** au fichier antérieur : identique.
  Aucune carte n'apparaît ni ne disparaît, aucun rang ne change, aucun motif d'écartement ne bouge.
- **Grammaire** : l'écart mesuré (un même fait servant de canal de sécurité sur 3 nœuds sur 5) est un cas
  d'application de **R15** — la question ne se pose au niveau du domaine que si quelqu'un regarde le
  domaine.
- **N1 humain** : l'affichage des deux nouvelles alertes au niveau `attention`, leur rang parmi les
  autres alertes, et l'absence de doublon visuel chez un patient qui en cumule plusieurs — à vérifier au
  navigateur.
