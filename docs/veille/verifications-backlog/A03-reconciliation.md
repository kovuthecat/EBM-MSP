# A03 — Réconciliation bi-agents (SOP §7)

**Item** : Rosuvastatine versus atorvastatine chez le coronarien.
**Source primaire** : Lee Y-J, Hong S-J, Kang WC *et al.* (LODESTAR investigators). « Rosuvastatin
versus atorvastatin treatment in adults with coronary artery disease: **secondary analysis** of the
randomised LODESTAR trial. » *BMJ* 2023;383:e075837 · DOI 10.1136/bmj-2023-075837 · open access
CC BY-NC 4.0 · NCT02579499.
**Publication princeps de LODESTAR** (à ne pas confondre) : Hong SJ *et al.*, *JAMA*
2023;329:1078-87 (treat-to-target vs haute intensité).
**Agents** : A (analyste) · B (contradicteur), contextes séparés.
**Réconciliateur** : Claude Code (Opus) — SOP §7.
**Date** : 2026-08-10.

> **Statut : route `analyse` maintenue, sous 7 conditions de rédaction opposables.** La vérification est
> **complète** (texte intégral lu page à page par B, registre NCT consulté) — **ne pas reporter**,
> contrairement à A04. Escalade humaine du §7 avant rédaction.

---

## 1. Consensus vérifié

- **Identification** : les deux agents confirment LODESTAR et **écartent explicitement** la cohorte
  rétrospective MDPI (n≈49 034) qui avait pollué la recherche initiale. Le piège signalé en amont n'a
  pris ni l'un ni l'autre.
- **Les trois chiffres qui circulent sont exacts** et localisables au tableau 2. « Le grief est la
  sélection, pas la falsification » (B).
- **Design factoriel 2×2 authentique et propre** : la comparaison rosuvastatine/atorvastatine est
  correctement isolée, préspécifiée, sans interaction (P=0,77). L'objection soulevée dans le brief de
  commande **ne trouve aucune faille** — les deux agents concordent.
- **Aucun ajustement pour la multiplicité**, déclaré textuellement par les auteurs (« with no
  adjustment for multiple comparisons »), sur ≥11-13 critères secondaires.
- **Le composite est porté par la revascularisation** : 226/367 événements = **61,6 %** — critère mou,
  dans un essai ouvert.
- **Qualité d'exécution réelle** : randomisation centralisée par blocs permutés stratifiée (dont sur le
  diabète préexistant), ITT, **98,7 % de suivi complet à 3 ans**, adjudication de tous les événements
  par un comité **en aveugle**, pas d'arrêt précoce.
- **Financement industriel** : Sam Jin, Chong Kun Dang (laboratoires coréens).
- **`niveau_impact` : `informatif`** — les deux agents, indépendamment. **Aucun nœud de décision
  impacté.**

## 2. Divergences tranchées sur pièces

### D1 — L'hypothèse « confusion dose / molécule » : **A la retient, B la réfute — B retenu**

C'est l'arbitrage le plus important, et il va **contre le brief de commande** autant que contre A.

Le brief que j'avais rédigé poussait fortement cette hypothèse (« si la rosuvastatine baisse davantage
le LDL, l'excès d'effets indésirables relève de l'intensité, pas de la molécule »). A l'a suivie :
il lit le ratio 17,1 mg vs 36,0 mg comme « une intensité relative en faveur de la rosuvastatine ».

B la démonte, sur trois faits vérifiés :
1. **Les doses sont quasi équipotentes.** Le ratio 17,1 : 36,0 ≈ **1 : 2,1** correspond au rapport de
   puissance admis entre les deux molécules (rosuva 20 ≈ atorva 40). Ce n'est pas un excès d'intensité,
   c'est l'équipotence.
2. **L'écart de LDL est trivial** : 1,8 vs 1,9 mmol/L, soit **0,1 mmol/L (~4 mg/dL)**. Bien trop faible
   pour porter un HR de 1,39 sur le diabète.
3. **Le bras atorvastatine était *plus* exposé** à la haute intensité et à l'ézétimibe — le biais joue
   donc dans le sens inverse de l'hypothèse.

**Tranché en faveur de B.** À noter comme un résultat de procédure : le contradicteur a contredit la
commande, pas seulement l'analyste. B l'écrit d'ailleurs sans détour — « il faut le dire au lieu de
recycler une objection commode ». C'est exactement la fonction du §7.

### D2 — Le chiffre du diabète : **A ne l'a pas vu, B l'a trouvé — élément central du dossier**

Le tableau 2 comporte **trois lignes « diabète »**. Le chiffre qui circule est le troisième, et c'est
le plus favorable au message :

| Ligne du tableau 2 | Dénominateur | Résultat | Statut |
|---|---|---|---|
| Nouveau diabète, **définition principale**, population totale | 4 400 — **dont 1 468 déjà diabétiques à l'inclusion**, donc non à risque | 7,1 % vs 5,5 % · HR **1,29** [1,01-1,63] · P=0,04 | dénominateur incorrect |
| Nouveau diabète, **définition principale**, non-diabétiques à l'inclusion | 1 479 / 1 453 — **correct** | 10,4 % vs 8,4 % · diff. **+2,1 pp** [−0,0 à 4,2] · HR **1,26** [0,99-1,60] · **P=0,06 → NON SIGNIFICATIF** | **la ligne la mieux construite** |
| **Initiation d'antidiabétiques**, non-diabétiques à l'inclusion | 1 479 / 1 453 | 7,2 % vs 5,3 % · diff. +2,0 pp [0,3 à 3,7] · HR **1,39** [1,03-1,87] · P=0,03 | **c'est celle qui circule** |

**L'analyse au dénominateur correct et à la définition principale du critère est non significative.**
Ce chiffre — HR 1,26 [0,99-1,60] — n'apparaît nulle part dans ce qui circule, ni dans le rapport de A.

**C'est le résultat le plus important de toute la vérification A03.** Il ne relève d'aucune
interprétation : c'est une ligne de tableau que l'un des deux agents a lue et l'autre non.

### D3 — Effet absolu / NNH : **A et B divergent, B retenu**

A donne NNH ≈ 53 (diabète) et ≈ 100 (cataracte), calculés sur la ligne « initiation d'antidiabétiques ».
B donne **NNH ≈ 50 [IC ≈ 27 à 333]** sur la même ligne, et surtout ajoute les deux chiffres que A omet :
- **composite : +0,5 pp [−1,2 à +2,1] → aucun NNT/NNH interprétable** ;
- **cataracte : +1,0 pp → NNH ≈ 100**, avec une **borne basse d'IC au ras de zéro**.

B assortit ses NNH de leur intervalle de confiance, A non. Sur un IC allant de 27 à 333, publier « 53 »
nu serait trompeur. **B retenu**, avec IC obligatoire.

### D4 — `niveau_preuve` : **A propose un niveau global, B refuse — B retenu, et cela révèle un défaut de schéma**

A propose un niveau unique. B refuse explicitement (« un niveau global unique serait trompeur ») et
gradue **par question** :

| Question | Niveau (B) |
|---|---|
| Pas de différence d'efficacité démontrée sur le composite CV à 3 ans | **modéré** |
| Sur-risque de diabète | **faible** — la ligne la mieux construite est NS |
| Sur-risque de chirurgie de la cataracte | **très faible** — signal isolé, contredit par la méta-analyse d'ECR (RR 0,89 [0,72-1,10]), essai ouvert **sans surveillance ophtalmologique protocolisée**, et le critère est un **acte chirurgical décidé en connaissance du bras** |

B a raison sur le fond. Mais le modèle de données ne sait pas le porter : `niveau_preuve` est un
**champ unique** (`entree.types.ts`). → voir §5, note pour le gel du schéma.

**Arbitrage** : retenir **`faible`** comme valeur du champ, et porter la graduation par question dans
`appreciation_critique`. Justification du choix de la valeur basse : ce que l'entrée met en avant, ce
sont les deux signaux de sécurité (c'est ce qui circule et ce qu'il faut recadrer), pas la conclusion
d'efficacité. Coter `modéré` laisserait croire que les signaux le sont.

## 3. Anomalie relevée dans la source elle-même

**Coquille d'impression, tableau 2** : la différence absolue de la cataracte est imprimée
« **1,0 (1,4 to 1,8)** » — l'estimation ponctuelle est **hors de son propre intervalle de confiance**.
Lecture plausible : 1,0 pp (0,1 à 1,8). Signalé par B pour intégrité, et parce que la borne basse
corrigée frôle zéro. À mentionner si le chiffre absolu de la cataracte est repris.

## 4. Classement réconcilié

| Champ | Valeur | Origine |
|---|---|---|
| `route` | `analyse` | B ; « ne pas reporter, la vérification est complète » |
| `niveau_impact` | `informatif` | A et B concordants |
| `niveau_preuve` | `faible` | B, graduation par question reportée dans l'appréciation (§2 D4) |
| `pertinence_pratique` | `moderee` | le sujet parle à la MSP, la conclusion est « rien ne change » |
| `themes` | `[cardiovasculaire-prevention]` | A et B concordants |
| `professions_concernees` | `[MG, IPA]` | A propose `MG` ; `IPA` ajouté (suivi des coronariens en protocole) |
| `concerne_decision` | `false` | **explicite** : deux critères secondaires exploratoires non ajustés, dont un contredit par méta-analyse, ne modifient aucune recommandation de choix de molécule |
| `meta.relecture_referent` | `true` | thème MG, circuit §7 |

### Conditions de rédaction opposables (de B, toutes retenues)

1. **Titrer sur « aucune différence d'efficacité démontrée »**, jamais sur « préférer l'atorvastatine ».
   Cette dernière formule est **une erreur d'interprétation** et doit être écartée explicitement dans
   le corps de l'entrée.
2. Écrire que la comparaison **n'a pas été dimensionnée** (pas de calcul d'effectif, pas de marge
   d'équivalence) et qu'il n'y a **aucun ajustement pour la multiplicité** — les deux sont déclarés
   textuellement par les auteurs, donc vérifiables par le lecteur.
3. **Donner les trois lignes « diabète »**, dont **HR 1,26 [0,99-1,60], NS** (§2 D2). Non négociable :
   c'est le point où tout le reste bascule.
4. Donner les **effets absolus avec leur IC** et les NNH (≈ 50 [27-333] et ≈ 100 à 3 ans), pas les seuls HR.
5. Cataracte : mentionner la **méta-analyse d'ECR négative (RR 0,89 [0,72-1,10]) dans le même
   paragraphe** que le signal, plus l'absence de surveillance ophtalmologique protocolisée.
6. Mentionner le **financement industriel** (Sam Jin, Chong Kun Dang) sans en faire l'argument central.
7. **Message pour la pratique : rien ne change.** Le choix rosuvastatine/atorvastatine chez le
   coronarien reste guidé par l'intensité requise, les interactions et le coût. La surveillance
   glycémique sous statine de forte intensité est déjà de bonne pratique, indépendamment de cet essai.

> **Repli** : si le format ne permet pas de porter les points 2 à 5, reclasser en `breve` avec la seule
> conclusion défendable — « pas de différence d'efficacité démontrée entre rosuvastatine et
> atorvastatine chez le coronarien à 3 ans ; signaux de sécurité exploratoires, non confirmés, ne
> modifiant pas la prescription ».

## 5. Note pour le gel du schéma (S5) — friction réelle rencontrée

**`niveau_preuve` est un champ unique, et il ne suffit pas.** A03 est le cas d'école : le même article
porte une conclusion d'efficacité de niveau **modéré** et deux signaux de sécurité de niveau **faible**
et **très faible**. Écraser cela en une valeur unique fait perdre l'information la plus utile au
lecteur, quel que soit le niveau retenu.

Piste à instruire en S5 (ne pas trancher ici) : soit `niveau_preuve` devient une liste
`{question, niveau}`, soit le champ reste unique mais sa définition est précisée — « niveau de preuve
**du message principal de l'entrée** » — et l'appréciation critique porte obligatoirement la
graduation. La seconde option est moins coûteuse et probablement suffisante ; c'est celle qui est
appliquée provisoirement ici.

---

*Réconciliation produite par l'orchestrateur (Opus) à partir de `A03-agent-A.md` et `A03-agent-B.md`,
rédigés en contextes isolés. D1 tranchée contre l'analyste **et contre le brief de commande** ; D2 par
constat de lecture (ligne de tableau lue par un agent, pas par l'autre) ; D3 et D4 par supériorité de
rigueur documentée. Escalade humaine obligatoire — SOP §7.*
