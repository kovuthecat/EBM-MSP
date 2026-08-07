# 2026-08-06 — D50 · Une option de nœud à sortie unique peut publier une valeur (amende D28)

### Décision

**Amende D28.** Sur un nœud `selection: ordered-first-match` **et sur lui seul**, l'option retenue peut
**publier** en mémoire de session une valeur **déclarée par le contenu** vers un critère **nommé** —
champ d'option `publie: { critere, valeur }`, un nombre, jamais une expression. La publication n'a
**aucun effet moteur** (`evaluateNode` ne lit pas `publie`) et n'a lieu **qu'une fois le nœud sorti** :
un nœud `enAttente` ne publie rien, le moteur ne s'étant pas prononcé (R7/D20).

**Garde-fou opposable — c'est la condition de validité du mécanisme, pas un supplément :** un critère
alimenté par publication ne peut avoir **aucun lecteur autre qu'un `preremplissage`**. La liste des
lecteurs est celle, exhaustive, de l'invariant R5 (S2/T-164), **moins** `preremplissage` : `conditions`,
`prerequis`, `exclusions`, `alertes[].quand` (de nœud **et** d'option), `calculs[].expression`, le
`derive` d'un autre critère, `visible_si`, `valeurs_visible_si`, `contraintes[].expression`,
`familles[].prioritaire_si`. Aucun de ces emplacements ne peut citer un critère publié. **Portée
globale** : la mémoire de session est un espace de noms unique (D28), donc un critère publié l'est
partout où il est déclaré — le garde-fou se vérifie sur l'ensemble des nœuds publiés, pas nœud par nœud.
Il est mécanisé par un invariant de banc ; **sans cet invariant, le mécanisme n'est pas livré du tout.**

Ce qui circule reste donc une **suggestion de saisie**, jamais un chaînage de règles : le nœud
récepteur reste évaluable seul, la question y reste posée, le champ pré-rempli **signale son origine**
(nœud + option d'où vient la valeur) et le praticien l'écrase d'un geste — *la position déclarée fait
foi*. La sémantique de `preremplissage` est reprise telle quelle : dès que le praticien touche le champ,
le pré-remplissage cesse définitivement, et une valeur publiée n'écrit jamais par-dessus une valeur
saisie. Périmètre inchangé par ailleurs : mémoire vive, aucune écriture disque, aucun réseau, remise à
zéro au rechargement (invariant CLAUDE.md 1), purge par « Nouveau patient » (D33).

### Contexte

Le référent a tranché le 2026-08-06 : **la position vs cible définie par le praticien prime ; elle peut
être suggérée — comme l'espérance de vie — si la cible est définie dans le nœud « Déterminer la
cible ».** Ce que la revue de conception du 2026-08-04 avait déjà nommé dans R1 : le praticien qui vient
de faire fixer « Cible ≤ 7 % » par le nœud voisin doit re-juger à la main « Par rapport à l'objectif »
deux clics plus tard, alors que la conclusion que l'outil vient de rendre n'existe nulle part comme
valeur de session.

**L'obstacle était explicite.** D28 pose que ce qui circule d'un nœud à l'autre est une valeur **saisie**
par le praticien, jamais une **conclusion du moteur** — sa deuxième garantie interdit nommément de
mémoriser un critère `derive`, « ce serait faire circuler une conclusion, pas une saisie — rouvrirait
R1 ». Or la cible produite par `cible-glycemique` **est** une conclusion du moteur : la suggestion
demandée n'était pas réalisable sans amendement explicite. D50 est cet amendement, borné par le
garde-fou ci-dessus.

### L'antécédent du 2026-07-29, et pourquoi la nouvelle forme y répond

Un pré-remplissage de `position_vs_cible` a existé sur `prescription` (K6/D28, 2026-07-27) et a été
**retiré le 2026-07-29** par décision référent — « retour assumé en arrière », pas une perte
accidentelle. Motif consigné dans le YAML : il fallait **déclarer une cible chiffrée** pour obtenir une
simple position, et **la frontière entre bandes restait discutable près des seuils** ; le référent
préférait un champ déclaré simple, répondu en une fois, à un mécanisme qui propose parfois et se tait le
reste du temps. Dans la foulée, `HbA1c_cible` et quatre dérivés d'écart ont été supprimés de
`prescription` : le pré-remplissage retiré, ils n'avaient plus **aucun** lecteur, et les garder aurait
violé R5.

Les trois objections reçoivent chacune une réponse différente de celle de 2026-07-27 :

- **« Il faut resaisir une cible chiffrée »** — la source n'est plus un champ que le praticien remplit
  une seconde fois : c'est la cible **publiée** par le nœud qui la détermine, dès lors qu'il a été
  ouvert. S'il ne l'a pas été, rien n'est publié et le champ reste ce qu'il est aujourd'hui, purement
  déclaré.
- **« La frontière entre bandes reste discutable près des seuils »** — on ne tranche plus la frontière :
  on l'**évite**. Une zone morte encadre la seule frontière qui change une conduite ; on ne suggère que
  là où l'écart est net et on se tait ailleurs. Le mécanisme s'appuie pour cela sur un comportement déjà
  en place : une expression indéterminée ne pré-remplit rien (R7/D20).
- **« Un critère qui n'agit plus n'a rien à faire dans le formulaire » (R5)** — `HbA1c_cible` redevient
  légitime **sans** agir sur la sélection, parce que `preremplissage` compte comme lecteur dans
  l'invariant R5 (S2/T-164) : proposer une valeur de départ est déjà « faire quelque chose ».

Reste écartée, et pour la même raison qu'en 2026-07-29 : rendre `position_vs_cible` entièrement
`derive`. Le DSL de dérivation ne produit qu'un booléen ou un nombre, jamais l'un des quatre libellés de
l'énumération — et un état dérivé d'un calcul cesserait d'être **déclaré** au sens de R1.

### Raison du choix — ce que R1 protège reste protégé

R1 interdit qu'un **état** clinique se déduise ; son corollaire interdit qu'un nœud en **chaîne** un
autre. Le garde-fou est la traduction mécanique de cette interdiction : une valeur publiée n'atteint
jamais une **règle**, seulement un champ de formulaire que le praticien voit, confirme ou corrige.
Aucune `conditions` d'un nœud ne peut donc se chaîner sur la conclusion d'un autre — c'était le risque
réel, et il est fermé par un invariant, pas par une intention de rédaction.

La restriction à `ordered-first-match` suit du même raisonnement : seul un nœud à **sortie unique** a
*une* conclusion à publier. En `multi-options`, plusieurs options sont applicables à la fois et
publieraient des valeurs concurrentes sans aucune règle d'arbitrage — c'est précisément le cas que cette
restriction rend impossible, plutôt que de le trancher.

### Paramètres arbitrés le 2026-08-06 (premier usage : DT2)

**1. Valeur publiée par chacune des quatre cartes de `cible-glycemique` : le PLAFOND de la carte.**

| Carte | Valeur publiée |
| --- | --- |
| Cible < 9 % | `9` |
| Cible ≤ 8 % | `8` |
| Cible ~6,5 % (6,5-7 %) | `7` |
| Cible ≤ 7 % | `7` |

Deux limites à écrire noir sur blanc : les deux dernières cartes publient **le même nombre** (elles
diffèrent d'intention, pas de plafond) ; et le **plancher** de la carte « ~6,5 % » n'est pas
représentable par une valeur unique — un patient à 6,2 % ne sera donc **pas** signalé « sous
l'objectif » par ce mécanisme.

**2. Bandes de suggestion — zone morte autour de l'objectif seulement.** Écart = HbA1c mesurée − cible.

| Écart | Position suggérée |
| --- | --- |
| `< −0,5` | `sous_objectif` |
| `[−0,5 ; +0,3]` | `a_l_objectif` |
| `]+0,3 ; +0,5[` | **aucune suggestion** |
| `[+0,5 ; +1,5]` | `au_dessus` |
| `> +1,5` | `nettement_au_dessus` |

Motif de l'unique zone morte : franchir « à l'objectif → au-dessus » ouvre la palette thérapeutique et
change donc une **conduite** ; franchir « au-dessus → nettement au-dessus » ne change qu'un **rang**.
Aucune règle de repli (`default`) dans ce pré-remplissage : un repli poserait une valeur sur un écart
ambigu, exactement ce que la zone morte évite.

**3. `HbA1c_actuelle` et `HbA1c_cible` restent déclarés dans `insuline`** : après unification, leur seul
lecteur est le pré-remplissage — ce qui suffit à R5 (S2/T-164).

**4. `ecart_sous_objectif_cible` devient `position_vs_cible == sous_objectif`** (« on garde position vs
cible pour insuline 12 »). Effet clinique consigné : la nuance de **magnitude** (« 1 point sous la
cible ») disparaît au profit d'une position déclarée.

**5. Garde-fou : pré-remplissage uniquement**, vérifié par un invariant. Sans lui, le mécanisme n'est pas
livré.

### Ce qui reste interdit

1. **Publier depuis un nœud `multi-options`** — la publication est réservée à `ordered-first-match`.
2. **Publier vers un critère lu par une règle** — c'est le garde-fou ; il ne s'assouplit pas. Si un
   besoin futur exige qu'une valeur publiée pilote une condition, la réponse est un **second critère
   sous un autre nom**, jamais une exception au garde-fou.
3. **Publier autre chose qu'une valeur littérale déclarée dans le contenu** — pas d'expression calculée,
   pas de valeur reprise de la saisie, pas de texte.
4. **Publier depuis un nœud en attente** — le moteur ne s'est pas prononcé (R7/D20).
5. **Imposer la valeur** — elle ne s'écrit jamais par-dessus une saisie du praticien, le champ
   pré-rempli dit d'où elle vient, et le praticien l'écrase d'un geste.
6. **Faire survivre quoi que ce soit à la session** — mémoire vive uniquement, aucune écriture disque,
   aucun réseau, remise à zéro au rechargement (CLAUDE.md invariant 1), purge par « Nouveau patient »
   (D33).

### Conséquences

- **Socle (S10/T-179)** : `publie` entre au schéma d'option et à `node.types.ts` ; `sessionCriteres.ts`
  distingue une **valeur publiée** d'une valeur saisie et porte son **origine** (nœud + option), sans
  quoi l'écran ne peut pas dire d'où vient la suggestion ; l'écran écrit la publication une seule fois
  par sortie, hors du moteur ; l'invariant de banc du garde-fou est écrit avec un message d'échec citant
  D50. `evaluateNode` n'est pas touché.
- **Contenu (S11/T-180, T-181)** : `position_vs_cible` devient la définition unique de « où en est ce
  patient » (`partage: true`, déclarée à l'identique dans `prescription` et `insuline`) ;
  `cible_atteinte` et `ecart_sous_objectif_cible` cessent de lire `HbA1c_cible` et se réécrivent sur
  elle. **Cette unification est une condition du garde-fou** : tant qu'un `derive` lit `HbA1c_cible`, le
  critère a un lecteur qui n'est pas un `preremplissage` et la publication est interdite.
- **Coût nommé** : un critère publié **sort définitivement du jeu de règles**, partout et pour tout
  domaine à venir — `HbA1c_cible` ne pourra plus piloter aucune condition, dans aucun nœud. C'est le
  prix du garde-fou, assumé.
- **Pertes cliniques consignées** : la magnitude de l'écart sous l'objectif (point 4 ci-dessus), et le
  plancher de la carte « ~6,5 % » (point 1).
- **Non touché** : la suggestion d'espérance de vie (`esperanceVieDefault.ts`), idiome existant dont
  celui-ci s'inspire, reste en l'état.
- **R1 gagnera un renvoi vers D50** dans `GRAMMAIRE-NOEUD.md` en S12 — la précision non arbitrée du
  2026-08-04 y devient une décision arbitrée. Ce fichier n'est pas modifié par la présente session.
- **N2 humain** : la décision est arbitrée, c'est sa **formulation** qui est relue par Thibault avant que
  S10 démarre ; accord à consigner dans `VALIDATION.md`.
