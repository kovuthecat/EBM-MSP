# Sortir les sources de la ligne de lecture du panneau POSOLOGIE — instruction de la piste R4

> **Date** : 2026-08-11 · **Nature** : investigation et cadrage, **aucun fichier de contenu, de schéma
> ni de code n'a été modifié**. Ce document est le seul écrit produit.
> **Objet** : faisabilité, volume, plan technique et séquencement de la piste **R4** — faire passer
> `Option.posologie_detail` de `string[]` à `(string | { texte, sources? })[]`, où `sources[]` porte des
> **ids de `sources.references_primaires`** du nœud, rendus en note discrète plutôt qu'en incise.
> **Périmètre mesuré** : les 6 nœuds de `content/decision/noeuds/diabete-type-2/`, à l'état committé du
> 2026-08-11 (`main`, c44bebb) — `cible-glycemique` v2.19, `insuline` v0.60, `prescription` v0.74,
> `rhd-activite-physique` v0.21, `rhd-alimentation` v0.18, `statine` v1.30.
> **Ce document ne décide rien** : toute modification de nœud impose de toute façon bump de version +
> changelog + validation humaine (`DECISIONS.md` D5). Il est écrit pour permettre l'arbitrage, pas pour
> le préempter.

---

## 0. Le résultat en une phrase, parce qu'il change la question posée

L'exemple qui a motivé la piste — « Titrer la basale », `insuline.yaml` — est **le meilleur cas du
corpus, et il n'est pas représentatif**. Ses trois citations mappent proprement, parce que c'est
précisément l'option qui a reçu la correction D3 « MÉSATTRIBUTION » du 2026-07-29 et dont les ids ont
donc été mis en ordre. Sur l'ensemble des six nœuds, **15 citations inlinées sur 39 (38 %) mappent vers
un id de `references_primaires` du même nœud**. Les 24 autres n'ont **aucun id vers lequel pointer** :
14 désignent un texte de `sources.reco_officielle.references[]` — qui, au schéma, **ne porte pas de
champ `id`** et n'est donc pas citable —, 8 désignent une source qui **n'existe nulle part dans la
bibliographie du nœud**, 2 sont ambiguës.

R4 tel que spécifié est **techniquement simple et sans risque moteur**, mais il ne résorbe, en l'état,
qu'un tiers du défaut — et il le résorbe presque entièrement sur `insuline`, en ne touchant quasiment
pas `prescription` et pas du tout `statine`, qui sont les deux nœuds où les citations inlinées sont les
plus nombreuses. La question réelle à arbitrer n'est donc pas « R4 est-il faisable » (il l'est) mais
**« `sources[]` accepte-t-il, en plus des ids de `references_primaires`, une désignation des citations
de recommandation officielle ? »** — sans quoi la migration est partielle par construction.

---

## 1. Faisabilité du mappage, citation par citation

**Méthode.** Chargement des 6 YAML par `js-yaml` (même parseur que le build), extraction de tous les
`option.apercu` et `option.posologie_detail`, relevé manuel de chaque marque de citation, confrontation
au tableau `sources.references_primaires` **du même nœud** puis, en second recours, à
`sources.reco_officielle.references[]` du même nœud. Aucun id n'a été inventé ; aucune correspondance
plausible mais non vérifiable n'a été retenue comme acquise.

**Légende de la colonne « id trouvé »**
- `<id>` — l'id existe dans `references_primaires` du nœud : **mappage propre**.
- `RECO` — le libellé correspond à une entrée de `sources.reco_officielle.references[]` du nœud, qui
  **n'a pas d'id au schéma** (définition `citationReco` : `nom`, `lien`, `detail` — pas d'`id`).
  Non mappable par R4 tel que spécifié.
- `ABSENT` — le libellé ne correspond à **aucune** entrée, ni primaire ni officielle, du nœud.
- `À ARBITRER` — correspondance partielle ou contradictoire ; ce qui manque pour trancher est nommé.

### 1.1 `insuline.yaml` (v0.60) — 6 options concernées, 14 citations

| option (famille) | champ | libellé cité | id trouvé |
| --- | --- | --- | --- |
| **Insuline basale** *(Instaurer l'insuline)* | `posologie_detail[1]` | `(ebmfrance)` | `ebmfrance-insuline` ✔ |
| " | `posologie_detail[1]` | `(SFD 2025, Avis 18)` | `sfd-2025-avis18` ✔ |
| " | `posologie_detail[1]` | `(HAS 2024, R.87)` | `has-2024-r87` ✔ |
| " | `posologie_detail[4]` | `(SFD 2025, Avis 18 bis)` | **RECO** — `sfd-2025-avis18` couvre les Avis **18, 19 et 23**, pas l'**Avis 18 bis** (analogues de 2ᵉ génération), qui n'est nommé que dans `reco_officielle.references[0].detail` |
| " | `posologie_detail[4]` | `(BRIGHT, CONCLUDE)` | `bright` + `conclude` ✔ *(2 ids pour une marque)* |
| **Corriger l'hypoglycémie ou la variabilité** *(Sécurité)* | `posologie_detail[0]` | `(SFD 2025, Avis 18)` | `sfd-2025-avis18` ✔ |
| " | `posologie_detail[0]` | `(ebmfrance)` | `ebmfrance-insuline` ✔ |
| " | `posologie_detail[0]` | `(HAS 2024, R.87, qui écrit la règle dans les deux sens : …)` | `has-2024-r87` ✔ — **mais la parenthèse porte aussi une donnée clinique** (la symétrie « augmentée ou réduite »), cf. §4 |
| **Titrer la basale (augmenter la dose)** | `posologie_detail[0]` | `(ebmfrance)` | `ebmfrance-insuline` ✔ |
| " | `posologie_detail[0]` | `(SFD 2025, Avis 18)` | `sfd-2025-avis18` ✔ |
| " | `posologie_detail[0]` | `(HAS 2024, R.87 — accord d'experts)` | `has-2024-r87` ✔ — le **grade** est dans l'incise, pas dans l'id |
| **Basale** *(Ajuster le schéma en place, `action: reduire`)* | `posologie_detail[0]` | `(SFD 2025, Avis 18)` | `sfd-2025-avis18` ✔ |
| " | `posologie_detail[0]` | `(HAS 2024, R.87)` | `has-2024-r87` ✔ |
| **Bolus au repas principal** | `posologie_detail[1]` | `(FullSTEP : bande 4,0-7,2 mmol/L, pas de ± 1 U)` | `fullstep` ✔ — **mais la parenthèse porte aussi les chiffres de l'essai**, cf. §4 |

*Les `apercu` de ce nœud ne portent aucune citation. L'option « Désintensifier / alléger le schéma »
non plus.*

**Le point clé du §1 pour le référent.** Le commentaire YAML au-dessus de « Insuline basale » (lignes
957-961) dit que `ebmfrance-insuline`, `sfd-2025-avis18` et `has-2024-r87` ont été **délibérément
retirés d'`option.references` le 2026-08-06** (la ligne « D'après : » dépassait 250 mots), en actant que
« les trois dernières restent NOMMÉES, source par source, dans `posologie_detail` ci-dessous, **qui est
leur canal** ». **Vérifié : les trois existent toujours dans `sources.references_primaires` du nœud.**
R4 est donc, pour cette option, exactement l'outil qui manquait : il rend la traçabilité mécanique
(vérifiable par invariant) sans réinjecter les trois références dans une ligne « D'après : » que le
référent a explicitement voulu raccourcir.

*(Nota : l'option s'intitule aujourd'hui **« Insuline basale »**, pas « Initier une insuline basale » —
l'intitulé a changé, le commentaire de la mission cite l'ancien.)*

### 1.2 `prescription.yaml` (v0.74) — 21 options concernées, 20 citations

| option (famille · action) | champ | libellé cité | id trouvé |
| --- | --- | --- | --- |
| **Metformine** *(Socle · ajouter)* | `posologie_detail[5]` | `Assurance Maladie (ameli), mémo médecin « Prescription de metformine… »` | **ABSENT** — ni primaire, ni reco. Ligne de source **globale aux 5 items précédents** |
| " | `posologie_detail[6]` | `(RCP ANSM)` | **RECO** (`reco_officielle.references`, entrée « RCP ANSM », qui chiffre bien la metformine) |
| **Metformine (DFG < 30)** *(sécurité · arreter)* | `apercu` | `(KDIGO 2022)` | **RECO** — et l'entrée RECO du nœud dit elle-même « **Ne chiffre que la metformine et les iSGLT2** » |
| **Metformine** *(sécurité · reduire)* | `apercu` | `(KDIGO 2022 …)` | **RECO** |
| " | `apercu` | `(… / RCP ANSM)` | **RECO** |
| **Sulfamide (DFG < 30)** *(sécurité · arreter)* | `apercu` | `(RCP, rubrique 4.4)` | **À ARBITRER** — l'entrée RECO « RCP ANSM » énumère metformine, iSGLT2, incrétines, répaglinide ; **ni les sulfamides ni la rubrique 4.4 n'y figurent**. Manque : savoir de quel RCP de sulfamide il s'agit (gliclazide ? glimépiride ?) |
| " | `apercu` | `la SFD (2023/2025)` | **À ARBITRER** — « SFD 2025 » existe en RECO et porte bien le seuil DFG 30 ; **« 2023 » ne correspond à rien dans le nœud**. Manque : le millésime 2023 est-il un reliquat, ou une seconde prise de position à verser ? |
| **iSGLT2** *(sécurité · arreter)* | `apercu` | `(ACC 2020)` | **ABSENT** — trace uniquement dans le changelog (l. 3775 : « rapport OpenEvidence du 2026-08-02 »), jamais versé en bibliographie |
| **Insuline d'initiation** *(sécurité · ajouter)* | — | *aucune citation* | — |
| **iSGLT2** *(Le choix de l'agent · ajouter)* | `posologie_detail[3]` | `Source : RCP (EMA/ANSM) de chaque spécialité, rubrique 4.2.` | **RECO** — ligne de source **globale à l'item** |
| **AR GLP‑1** *(Le choix de l'agent)* | `posologie_detail[4]` | `RCP EMA/ANSM Victoza, Ozempic et Trulicity, rubrique 4.2` | **RECO** (entrée « RCP ANSM », mention « incrétines ») |
| " | `posologie_detail[4]` | `base de données publique des médicaments` | **ABSENT** |
| **Association iSGLT2 + AR GLP‑1** | `posologie_detail[2]` | `(EMA/ANSM, rubrique 4.2)` | **RECO** |
| **Envisager l'insuline** | — | *aucune citation* | — *(voir §4.4 : cette option a un défaut d'affichage indépendant)* |
| **Gliptine (redondante)** *(arreter)* | `apercu` | `(JAMA Cardiol 2020)` | **ABSENT** |
| **Sulfamide** *(Traitement à alléger · arreter)* | `apercu` | `(avis d'experts, JAMA Cardiol 2020)` | **ABSENT** |
| **Glinide** *(alléger · arreter)* | `apercu` | *aucune citation* (« aucune donnée sourcée » — **non-source explicite**) | — |
| **Insuline** *(alléger · reduire)* | `apercu` | `(avis d'experts, AAFP 2026 …)` | **ABSENT** |
| " | `apercu` | `(… / JAMA Cardiol 2020)` | **ABSENT** |
| **AR GLP‑1** / **Tirzépatide** *(alléger · reduire)* | `apercu` | *aucune citation* | — |
| **Sulfamide — réduire la posologie** | `apercu` | `(avis d'experts, JAMA Cardiol 2020)` | **ABSENT** |
| **Glinide — réduire la posologie** | `apercu` | *aucune citation* (non-source explicite) | — |
| **Metformine (désintensification)** | `apercu` | *aucune citation* (non-source explicite) | — |
| **Gliptine** *(Le choix de l'agent · ajouter)* | `posologie_detail[0]` | `(TECOS)` | `tecos` ✔ |
| " | `posologie_detail[1]` | `(SFD 2025, Avis n° 12 bis)` | **RECO** — l'entrée « SFD 2025 » nomme explicitement l'Avis 12 bis |
| **Sulfamide** *(Le choix de l'agent · ajouter)* | `posologie_detail[1]` | `(surmortalité relative, Simpson 2015)` | `simpson` ✔ |

**Constat qui dépasse R4.** Cinq sources — **ACC 2020**, **JAMA Cardiol 2020** (4 occurrences),
**AAFP 2026**, **Assurance Maladie / ameli**, **base de données publique des médicaments** — sont
**citées au praticien à l'écran sans exister nulle part dans la bibliographie déclarée du nœud**. Elles
sont réelles et tracées dans le changelog YAML, mais un lecteur ne peut ni les retrouver ni les
vérifier depuis l'écran. C'est un écart à l'invariant 6 de `CLAUDE.md` (« contenu sourcé… re-vérifier
sur la source primaire ») **indépendant de R4** — mais R4 est ce qui le rend mécanique : dès qu'une
citation doit être un id, une citation sans id devient un rouge de test au lieu d'une parenthèse
plausible.

### 1.3 `statine.yaml` (v1.30) — 4 options concernées, 5 citations

| option | champ | libellé cité | id trouvé |
| --- | --- | --- | --- |
| **Interrompre la statine 4 à 6 semaines et réévaluer** *(sécurité)* | `posologie_detail[0]` | `(parcours NHS England / AAC)` | **RECO** (entrée « NHS England / AAC 2022 — Statin Intolerance Pathway ») |
| " | `posologie_detail[1]` | `(parcours NHS England / AAC)` | **RECO** |
| **Débuter la statine à dose plus faible** | `posologie_detail[0]` | `reprise du parcours NHS England / AAC` | **RECO** |
| **Statine de haute intensité — prévention secondaire** | `posologie_detail[0]` | `(recommandation SFE/SFD/NSFA/SFC 2026, Table 4)` | **RECO** (entrée « Reco française 2026 ») |
| **Statine — prévention primaire** *(repli)* | `posologie_detail[0]` | `(recommandation SFE/SFD/NSFA/SFC 2026, Table 4)` | **RECO** |

**`statine` est le cas extrême : 0 citation sur 5 mappable par R4 tel que spécifié.** Et c'est
cohérent, pas accidentel — une posologie de statine vient d'un **texte de recommandation** (une table
de doses), jamais d'un essai. Les 32 `references_primaires` du nœud portent des **résultats**
(CARDS, CTT, CLEAR…), pas des schémas de dose. Aucun id de ce nœud ne peut légitimement porter
« atorvastatine 40 à 80 mg/j » ; forcer un mappage vers `ctt-diabete` serait fabriquer exactement la
mésattribution que D3 a corrigée sur `insuline`.

À noter : `posologie_detail[1]` de « Statine — prévention primaire » (le paragraphe CYP3A4 :
pravastatine/rosuvastatine/pitavastatine moins sujettes aux interactions, avec la liste des
co-prescriptions à risque) **ne porte aucune citation du tout**. C'est une affirmation
pharmacologique actionnable, non sourcée — à verser à la même liste que les cinq de `prescription`.

### 1.4 `rhd-activite-physique.yaml` (v0.21) — 6 options concernées, **0 citation**

Les 6 `apercu` (aucun `posologie_detail` sur ce nœud) sont **entièrement exempts de citation
inlinée** : « au moins une minute de mouvement par heure passée assis — un repère, pas un objectif à
atteindre », etc. Le nœud attribue par `option.references` seulement. **C'est le modèle rédactionnel
que R4 cherche à généraliser** — il existe déjà, il n'a simplement jamais été rendu obligatoire.

### 1.5 `rhd-alimentation.yaml` (v0.18) et `cible-glycemique.yaml` (v2.19) — hors périmètre

Aucune de leurs 17 + 4 options ne porte `apercu` ni `posologie_detail`. Rien à migrer, rien à vérifier.

---

## 2. Le volume exact

### 2.1 Options concernées

| nœud | options totales | `apercu` + `posologie_detail` | `apercu` seul | `posologie_detail` seul | **total concerné** |
| --- | ---: | ---: | ---: | ---: | ---: |
| `cible-glycemique` | 4 | 0 | 0 | 0 | **0** |
| `insuline` | 14 | 5 | 1 | 0 | **6** |
| `prescription` | 30 | 7 | 13 | **1** | **21** |
| `rhd-activite-physique` | 14 | 0 | 6 | 0 | **6** |
| `rhd-alimentation` | 17 | 0 | 0 | 0 | **0** |
| `statine` | 8 | 4 | 0 | 0 | **4** |
| **total** | **87** | **16** | **20** | **1** | **37** |

Le périmètre annoncé dans la commande (16 + 20) est exact, **à une option près** : `prescription`
porte **une option avec `posologie_detail` et sans `apercu`** — « Envisager l'insuline » —, jamais
recensée. Elle compte, et elle a par ailleurs un défaut d'affichage propre (§4.4).

Total à instrumenter : **37 options**, **17 porteuses de `posologie_detail`** pour **46 items** de
`posologie_detail`, et **36 `apercu`**.

### 2.2 Citations à migrer

| | insuline | prescription | statine | rhd-AP | **total** |
| --- | ---: | ---: | ---: | ---: | ---: |
| citations inlinées relevées | 14 | 20 | 5 | 0 | **39** |
| → **mappent proprement** vers un id de `references_primaires` | 13 | 2 | 0 | — | **15 (38 %)** |
| → désignent une entrée `reco_officielle.references` (**pas d'id au schéma**) | 1 | 8 | 5 | — | **14 (36 %)** |
| → **ABSENT** de toute la bibliographie du nœud | 0 | 8 | 0 | — | **8 (21 %)** |
| → **À ARBITRER** | 0 | 2 | 0 | — | **2 (5 %)** |

Répartition par champ : **31 citations dans `posologie_detail`**, **8 dans `apercu`** — toutes les 8
sur `prescription` (les `apercu` de `insuline`, `statine` et `rhd-activite-physique` sont propres).

> **Effet du correctif de redondance en cours (session parallèle, 2026-08-11).** `OptionCard.tsx`
> n'affiche plus `apercu` **que faute de `posologie_detail`**. **Vérifié option par option : les 8
> citations d'`apercu` restent toutes visibles**, parce qu'elles sont toutes portées par des options
> qui n'ont *que* l'aperçu (Metformine DFG<30, Metformine dose max, Sulfamide DFG<30, iSGLT2 arrêt,
> Gliptine redondante, Sulfamide arrêt, Insuline réduire, Sulfamide réduire). Aucune des 7 options de
> `prescription` portant les deux champs ne cite dans son `apercu`. Le volume de 39 est donc inchangé
> par ce correctif — mais l'`apercu` cesse d'être un canal d'affichage sur 16 options, ce qui simplifie
> la migration : sur celles-là, **seul `posologie_detail` a besoin de `sources`**.

### 2.3 Poids dans la ligne de lecture

Volume total d'`apercu` + `posologie_detail` sur le corpus : **11 993 caractères**
(insuline 2 841 · prescription 6 677 · statine 1 888 · rhd-AP 587).

Le cas phare est confirmé au chiffre près : « Titrer la basale », `posologie_detail[0]` = **241
caractères dont 65 de citation, soit 27,0 %**. Sur les 46 items de `posologie_detail`, **21 portent au
moins une marque de citation** (46 %).

### 2.4 Ce que R4 seul résorberait

Si `sources[]` n'accepte que des ids de `references_primaires` : **15 citations sur 39 sortent de la
ligne de lecture, 24 y restent**. Concrètement : `insuline` passe à 1 citation résiduelle sur 14,
`prescription` reste à 18 sur 20, `statine` reste à 5 sur 5. Le défaut serait corrigé sur le nœud qui
l'illustre, et intact sur les deux qui le concentrent.

---

## 3. Plan de modification technique, fichier par fichier

### 3.1 `schema/decision/noeud.schema.json`

Ajouter une définition, sur le modèle **exact** de `contreIndication` (l. 278-297), puis basculer
`items` de `posologie_detail` (l. 617-624) en `oneOf: [string, $ref]` — même forme que
`contre_indications` (l. 597-610) :

```
"definitions": {
  "itemPosologie": {
    "type": "object", "additionalProperties": false, "required": ["texte"],
    "properties": {
      "texte":   { "type": "string", "minLength": 1 },
      "sources": { "type": "array", "minItems": 1,
                   "items": { "type": "string", "pattern": "^[a-z0-9][a-z0-9-]*$" } }
    }
  }
}
```

Le `pattern` est repris tel quel d'`option.references` (l. 513), ce qui garantit l'homogénéité des ids.
**Ne pas rendre `sources` requis** : c'est ce qui rend la forme longue additive et la migration
progressive (une chaîne reste strictement équivalente à un objet sans `sources`, comme pour
`contre_indications`).

### 3.2 `src/features/decision/content/node.types.ts`

- Nouvelle interface `ItemPosologie { texte: string; sources?: string[] }`, à placer près de
  `ContreIndication` (l. 485) et documentée selon la même convention.
- `posologie_detail?: string[]` (l. 668) → `posologie_detail?: (string | ItemPosologie)[]`.

### 3.3 `src/features/decision/engine/expressionsNoeud.ts` — **le point d'attention**

`CHAMPS_DU_SCHEMA` classe chaque champ du schéma par nature (`inerte` / `decision` / `arithmetique` /
`affichage` / `saisie`), et l'invariant **G1** (`engine/banc/grammaire.test.ts`) **échoue** dès qu'une
propriété du schéma n'y est pas classée, ou qu'une classification est orpheline. Deux gestes
obligatoires :

- `option.posologie_detail` (l. 141) passe du statut de feuille au statut de **conteneur**, avec un
  commentaire calqué sur celui de `contre_indications` (l. 163-166) ;
- ajouter l'entrée `itemPosologie: { texte: 'inerte', sources: 'inerte' }`.

**Sous R4, aucun champ n'est `decision`** — `sources[]` porte des ids, pas des expressions DSL. Donc
**G2** (« tout emplacement `decision` est réellement visité par le collecteur ») et `fragmentsDuNoeud`
restent inchangés, et le banc n'a **aucun nouveau littéral à tirer**. C'est la différence structurelle
avec R1, cf. §5.

### 3.4 `src/features/decision/components/OptionCard.tsx` — **en cours de modification par une autre session**

Le rendu (l. 536-540) itère aujourd'hui `option.posologie_detail?.map((paragraphe) => …)` en supposant
une chaîne. Il doit normaliser les deux formes, puis rendre la note. **Tout est déjà à disposition dans
le composant** : la prop `bibliographie` (`node.sources.references_primaires`, câblée par
`DecisionNodeScreen.tsx` l. 1418-1420) et la `Map parId` (l. 388) qui résout déjà `option.references`
pour la ligne « D'après : » du panneau *État des preuves* (l. 605-621). Résoudre `item.sources` coûte
une réutilisation de cette map, rien de plus.

**Politique à conserver, elle est déjà écrite** (l. 384-387) : *un id inconnu est ignoré ICI ; le
signaler est le travail d'un invariant de contenu, pas d'un composant de rendu au milieu d'une
consultation.* Ne pas introduire de rendu d'erreur dans la carte.

**Coordination — et le travail parallèle change le point d'accroche.** Au moment où ce document est
écrit, une session parallèle modifie `OptionCard.tsx`, `OptionCard.css`, `OptionCard.test.tsx` et
`node.types.ts`. Elle livre notamment un **correctif de redondance** : `apercu` n'est plus rendu que
faute de `posologie_detail`, et le premier paragraphe de posologie prend une classe dédiée
(`.option-card__posologie-geste`, « le geste et ses chiffres »), les suivants une autre. **C'est une
bonne nouvelle pour R4** : la hiérarchie visuelle du panneau vient d'être créée, et une note de source
discrète s'y insère naturellement comme troisième registre, au lieu d'avoir à casser un aplat gris
uniforme. Le lot R4 doit donc partir **après** ce travail et se caler sur ses classes, jamais en même
temps — et sa relecture doit vérifier que `node.types.ts` (touché des deux côtés) ne diverge pas.

### 3.5 `src/features/decision/lib/vueDecision.ts` — **rien à faire, et c'est un fait vérifié**

`serialiseOption` (l. 562-569) sérialise `intitulé @ badge « reasons » [calculs] {calculsEnAttente} ¦
motifRang ‖ alertes ‡ contre-indications`. **Ni `apercu` ni `posologie_detail` n'entrent dans
`signatureVue`** — parce que ni l'un ni l'autre ne varie avec le patient. R4 ne change pas cela : une
note de source est fixe pour une option donnée. Donc **aucun impact sur `engine/relevance.ts`, sur
l'estompage des champs, ni sur le golden master de caractérisation**
(`engine/banc/__snapshots__/`). Là encore, ce sera faux pour R1 (§5).

### 3.6 Chargeur et validation

`content/loadNodes.ts` ne fait que résoudre les `{ ref }` de critères communs : **rien à changer**.
`content/content.test.ts` valide chaque nœud contre le schéma via Ajv en mode `strict: true` — il
mordra automatiquement, sans modification, sur toute forme longue mal écrite.

### 3.7 Le banc : ce qui mord, et ce qu'il faut faire

| test | ce qui se passe | geste |
| --- | --- | --- |
| **G1** — `banc/grammaire.test.ts` | **ROUGE certain** dès l'ajout de `itemPosologie` au schéma, tant que `CHAMPS_DU_SCHEMA` ne le classe pas. C'est le garde-fou qui fonctionne. | classer (§3.3) |
| **`banc/jargon-projet.test.ts`** | **ROUGE certain, à la compilation.** L. 125-126 : `(option.posologie_detail ?? []).forEach((texte, i) => fragments.push({ chemin, texte }))` — `texte` deviendrait un objet. Ce test a été **étendu à `posologie_detail` le 2026-08-07** précisément parce que le champ échappait au contrôle de jargon (« du nœud "Insulinothérapie" » était passé). | normaliser les deux formes avant de pousser le fragment. **Vigilance : le texte de la note de source doit aussi être contrôlé**, sinon la migration rouvre le trou qu'on vient de fermer |
| **I8a/b/c** — `banc/invariants-contenu.test.ts` (l. 662-760) | **Vert, et inchangé.** I8b vérifie que tout id d'`option.references` existe ; I8c exige ≥ 1 `references` dès `niveau_preuve` `modere`/`eleve`. R4 n'y touche pas. | **doit évoluer — cf. ci-dessous** |
| `banc/rendu-textuel.test.ts` (I28-I31, R6 volet rendu) | Vert : porte sur `reasons`/`motifRang`/`ecartees`/`nonRetenues`, pas sur le panneau posologie. | rien |
| `banc/plafond-affichage.test.ts` (I18), `banc/paires.test.ts`, `banc/caracterisation.test.ts` | Verts : rien de leur objet ne dépend de la forme de `posologie_detail`. | rien |
| `components/OptionCard.test.tsx` | Vert (les fixtures passent des chaînes), mais **incomplet** : aucun test ne couvre `posologie_detail`. | ajouter le rendu de la note et le cas `sources` inconnu |

**L'invariant de sourçage à faire évoluer — I8, et voici précisément comment.** I8 est bien
l'invariant recherché : *« une option qui revendique un niveau de preuve doit dire de quoi elle le
tire »*, avec I8b (tout id cité existe) et I8c (`modere`/`eleve` ⇒ ≥ 1 référence). **Il ne connaît
aujourd'hui qu'un seul canal de citation : `option.references`.** Deux extensions, de nature
différente :

1. **Extension mécanique de I8b, sans arbitrage — à livrer avec R4.** Tout id apparaissant dans un
   `posologie_detail[].sources` doit exister dans `sources.references_primaires` du même nœud. C'est la
   stricte transposition d'I8b au nouveau canal ; sans elle, une note de source pointant vers un id
   inconnu serait **ignorée en silence par la carte** (§3.4) — la pire des sorties : une source qui
   disparaît sans rien casser.
2. **Nouvel invariant, avec arbitrage — le seul qui rende R4 opposable.** Un contrôle rédactionnel
   « **plus aucune marque de citation inlinée dans `apercu`/`posologie_detail`** », sur le modèle des
   marqueurs textuels d'I28-I31 (`rendu-textuel.test.ts`) et de `jargon-projet.test.ts`. Sans lui, R4
   ajoute un canal propre **à côté** des incises, sans jamais les faire disparaître — et la prochaine
   rédaction remettra une parenthèse. **Cet invariant ne peut pas passer au vert aujourd'hui** : les 24
   citations non mappables (§2.2) le feraient échouer. Il ne se pose donc qu'après l'arbitrage du §6.

I8c (le seuil `modere`/`eleve`) **n'a pas à changer** : il porte sur la revendication de preuve d'une
option, pas sur ses modalités de prescription. Une posologie tirée d'un RCP n'est pas une revendication
de niveau de preuve.

---

## 4. Le risque de régression clinique

### 4.1 Ce qui se perdrait si la migration était faite mécaniquement — le risque principal

**Une parenthèse de ce corpus n'est pas toujours une citation.** Trois cas mesurés où extraire la
parenthèse vers `sources[]` détruirait de l'information clinique :

- `insuline`, « Corriger l'hypoglycémie » : *« (HAS 2024, R.87, **qui écrit la règle dans les deux
  sens : « augmentée ou réduite de 1 ou 2 UI »**) »*. La glose est **l'argument** — c'est elle qui
  autorise à appliquer à la descente une règle écrite pour la montée. Réduire cette parenthèse à
  `sources: [has-2024-r87]` supprimerait la justification et laisserait une règle de descente
  apparemment sans fondement ;
- `insuline`, « Bolus au repas principal » : *« (FullSTEP : **bande 4,0-7,2 mmol/L, pas de ± 1 U**) »*.
  La parenthèse porte le **protocole réel de l'essai**, qui n'est pas celui affiché ;
- `insuline`, « Insuline basale » : *« Les deux molécules de 2ᵉ génération ne se départagent pas entre
  elles en tête-à-tête **(BRIGHT, CONCLUDE)** »*. Ici les essais sont le **sujet de la phrase**, pas
  une note de bas de page : c'est un énoncé sur l'état de la preuve, qui relève du panneau *État des
  preuves* plus que d'une note de posologie.

**Conséquence de méthode** : la migration est **item par item, relue**, jamais une substitution
d'expression régulière. Le banc n'attraperait aucune de ces trois pertes — elles produisent un texte
plus court, bien formé, et sans id manquant.

### 4.2 Ce que le banc attraperait

- un id de source inexistant → **oui**, par l'extension d'I8b (§3.7), à condition qu'elle soit livrée
  **dans le même lot** que le schéma ; sans elle, échec silencieux ;
- un jargon projet introduit dans le texte de la note → **oui**, par `jargon-projet.test.ts`, à
  condition que le fragment de la note y soit poussé (§3.7) ;
- une forme YAML invalide → **oui**, Ajv `strict` ;
- une régression de rendu de carte (panneau, ordre, plafond) → **oui**, `carte-affichage.test.tsx` et
  I18.

### 4.3 Ce que le banc n'attraperait pas — et qui doit donc rester à la relecture humaine

- **une source déplacée vers la mauvaise option** : les ids resteraient valides, I8b resterait vert.
  C'est exactement la classe de défaut D3 (mésattribution) — celle qui a motivé le travail — et **aucun
  invariant mécanique ne peut la voir**. C'est le point où la règle D5 (validation humaine) n'est pas
  une formalité administrative mais le seul filet ;
- **une nuance perdue** (§4.1) ;
- **une citation qui disparaît sans être remplacée** : rien ne compte les citations avant/après. Un
  garde-fou bon marché, s'il est voulu : figer, avant la migration, le nombre de marques de citation
  par option, et le comparer après. C'est de la caractérisation, pas un invariant permanent.

### 4.4 Un défaut d'affichage indépendant, trouvé en chemin — à traiter avec R4 ou avant

`OptionCard.tsx` l. 366 : `aDuContenuPosologie = Boolean(option.apercu) || calculs.length > 0 ||
enAttentePosologie`. **`posologie_detail` n'y figure pas** — la pastille POSOLOGIE, qui est la seule
affordance ouvrant le panneau (l. 460), n'est donc pas rendue quand une option porte *uniquement*
`posologie_detail`. C'est le cas de **« Envisager l'insuline » (`prescription.yaml`, l. 1551)**, dont
les deux items de posologie (« Débuter par une insuline basale, associée si possible à un AR GLP‑1 »
et le suivi du schéma) sont, sauf erreur, **inaccessibles à l'écran**. Aucun test ne le couvre.

**Vérifié dans l'arbre de travail au 2026-08-11 après le correctif de redondance de la session
parallèle : la ligne 416 est inchangée, le défaut est toujours là.** Il devient même un peu plus
saillant, puisque le correctif fait de `posologie_detail` le canal principal du panneau tout en
laissant la pastille aveugle à son existence. Le signaler ici plutôt que le corriger :
`OptionCard.tsx` est en cours de modification par une autre session, et ce correctif ne relève pas
d'une mission d'investigation. **À vérifier au navigateur avant correction** (validation visuelle =
humaine).

---

## 5. Recommandation de séquencement — **fondre R4 dans R1, ne changer la forme du champ qu'une fois**

**Recommandation : ne pas livrer R4 seul maintenant.** Livrer la *forme longue* du champ **une seule
fois**, portant d'emblée `{ texte, sources?, quand? }`, et échelonner ensuite les *contenus*. Cinq
raisons, par ordre décroissant de poids.

**1. Les deux pistes changent le même champ, et le coût n'est pas dans le champ — il est dans les six
contrats qui l'entourent.** Chaque changement de forme de `posologie_detail` traverse :
`noeud.schema.json` → `node.types.ts` → `expressionsNoeud.ts` (**avec G1 qui rougit**) →
`jargon-projet.test.ts` (**qui rougit à la compilation**) → `OptionCard.tsx` → les tests de carte. Le
faire deux fois, c'est payer deux fois ce circuit, **et surtout demander deux fois au référent une
validation D5 sur les mêmes fichiers de contenu** — sur `insuline`, ce sont exactement les mêmes
options qui seraient rouvertes.

**2. R1 ajoute une dimension AFFICHÉE et VARIABLE ; R4 non. C'est la vraie asymétrie.** Un `quand`
rend le contenu du panneau posologie **dépendant du patient**. Il devra donc entrer dans
`signatureVue` (`vueDecision.ts` l. 562-569), sans quoi un critère qui ne change *que* la posologie
affichée serait vu « sans effet » par `engine/relevance.ts` et **estompé à tort dans le formulaire**.
`GRAMMAIRE-NOEUD.md` documente ce piège comme **récurrent, à sa cinquième occurrence** (R6, encadré
« Même prérequis d'architecture ») et l'a déjà payé sur les alertes d'option, les calculs en attente et
les contre-indications conditionnelles. R1 impose en outre de classer `quand` en `decision` dans
`CHAMPS_DU_SCHEMA` et de le **récolter dans `fragmentsDuNoeud`** (invariant G2), donc de faire entrer
ses littéraux dans les domaines de tirage du banc, avec impact sur le golden master. **R4 n'a aucune de
ces conséquences.** Concevoir la forme longue en connaissant R1 coûte quelques lignes ; la
reconcevoir après coup coûte une refonte de signature — et la refonte de signature est précisément
l'opération que ce projet a historiquement ratée quatre fois.

**3. R4 seul ne résorbe qu'un tiers du défaut, et pas là où il fait le plus mal (§2.4).** Livrer
maintenant, c'est afficher un chantier « clos » alors que `prescription` garderait 18 citations
inlinées sur 20 et `statine` 5 sur 5. Le risque n'est pas technique, il est de gouvernance : un défaut
partiellement corrigé cesse d'être suivi.

**4. R1 est aujourd'hui bloqué sur un fait externe, et R4 ne l'est pas — ce qui inverse l'argument
naïf « faire d'abord ce qui est prêt ».** Le chantier R1 est instruit dans
`docs/decision/validation/chantier-2026-08-11/OE-titration-mcg-2026-08-11.md`, statut *« prompt prêt à
coller — retour non encore collecté »*. Ce document acte que si le retour est vide — **hypothèse jugée
la plus probable par le référent** — la conduite chez le patient porteur d'une MCG sera *« ne rien
inventer : dire que le pas et le rythme ne sont établis que sur la glycémie à jeun »*. Autrement dit :
**la forme dont R1 a besoin est déjà connue, seul son contenu ne l'est pas.** On peut donc concevoir la
forme longue complète sans attendre le retour OpenEvidence, et ne poser le `quand` sur du contenu
qu'ensuite. Attendre R1 ne retarde pas R4 de plusieurs semaines — cela demande une décision de forme,
qui peut être prise aujourd'hui.

**5. Le point d'ordre, si l'on veut néanmoins du visible tôt.** L'ordre à faible risque est :
`(a)` arbitrer le §6 · `(b)` **un seul lot de forme** (schéma + types + classification + rendu +
extension d'I8b), livré avec la forme complète `{ texte, sources?, quand? }` mais **aucun contenu
migré** — un lot mécaniquement vérifiable, sans validation clinique, car aucun texte ne change ·
`(c)` migration de contenu **nœud par nœud**, chacun avec son bump de version, son changelog et sa
relecture D5, en commençant par `insuline` (13 mappages propres sur 14, et le canal y est déjà
explicitement désigné par le commentaire du 2026-08-06) · `(d)` le `quand` de R1 sur `insuline` quand
le retour OpenEvidence est arrivé · `(e)` l'invariant rédactionnel « plus aucune incise » **en dernier**,
quand il peut passer au vert.

> **Si le référent veut malgré tout R4 maintenant et séparément**, l'exigence minimale est de figer la
> forme longue en **objet** (`{ texte, sources? }`) et non en tuple ou en convention de chaîne, et
> d'écrire dans la docstring de `node.types.ts` que `quand` est le champ attendu ensuite. Un objet
> ouvert accepte un troisième champ sans casser une seule ligne de YAML existante ; c'est ce qui rend
> le second lot bon marché. C'est exactement ce que `contreIndication` a fait pour `condition` — et
> c'est pour cela que ce précédent est le bon modèle.

---

## 6. Ce qui doit être arbitré avant d'écrire une ligne

1. **`sources[]` accepte-t-il autre chose que des ids de `references_primaires` ?** C'est la question
   qui décide si R4 résorbe 38 % ou ~90 % du défaut. Trois issues possibles, sans recommandation de ma
   part car chacune engage la doctrine de sourçage du projet (D23, et l'amendement du 2026-08-04 qui a
   supprimé `synthese_critique.references`) :
   - *(a)* doter `citationReco` d'un champ `id` et autoriser `sources[]` à pointer vers les deux
     registres — cohérent avec le fait qu'une posologie vient légitimement d'un RCP ou d'une table de
     recommandation, et non d'un essai ;
   - *(b)* verser les textes de recommandation cités en posologie dans `references_primaires` — **à
     écarter à mon sens** : `references_primaires` porte des *données publiées*, et le nœud `insuline`
     y a déjà fait entrer `has-2024-r87` / `sfd-2025-avis18` / `has-2011-buts` / `has-2025-parcours`,
     ce qui est peut-être déjà la réponse implicite, mais mérite d'être dit explicitement plutôt que
     constaté ;
   - *(c)* accepter une migration partielle et assumer par écrit que les citations de recommandation
     restent en incise.
   **Le nœud `insuline` a déjà tranché de fait dans le sens (b)** — quatre textes HAS/SFD figurent dans
   ses `references_primaires`. `prescription` et `statine` ont tranché dans l'autre sens. **C'est une
   incohérence inter-nœuds du domaine, du même genre que celle que R14 attrape sur les critères, et
   aucun invariant ne la voit.** Elle doit être arbitrée pour le domaine, pas nœud par nœud.
2. **Les 8 sources ABSENTES de `prescription`** (ACC 2020 · JAMA Cardiol 2020 ×4 · AAFP 2026 ·
   Assurance Maladie/ameli · base de données publique des médicaments) : versées en bibliographie, ou
   retirées de l'écran ? Elles sont aujourd'hui affichées au praticien sans être vérifiables.
3. **Les 2 `À ARBITRER`** : « RCP, rubrique 4.4 » (quel RCP de sulfamide ?) et « la SFD (2023/2025) »
   (le millésime 2023 est-il un reliquat ?).
4. **Le paragraphe CYP3A4** de `statine` (« Statine — prévention primaire », `posologie_detail[1]`) :
   affirmation pharmacologique actionnable, **entièrement non sourcée**.
5. **Le défaut d'affichage §4.4** (« Envisager l'insuline »), à vérifier au navigateur puis à corriger
   — indépendamment de R4.
