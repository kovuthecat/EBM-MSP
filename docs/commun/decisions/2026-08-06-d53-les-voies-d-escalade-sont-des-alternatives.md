# 2026-08-06 — D53 · Les voies d'escalade sont des alternatives, et une carte qui en qualifie une autre n'est pas une option

### Décision

**Deux volets, tranchés le même jour par le référent.**

**1. Dans un nœud, des voies d'escalade sont des ALTERNATIVES, pas des gestes cumulables.** Quand
plusieurs cartes proposent des façons **concurrentes** de franchir le même palier thérapeutique, leur
famille est `exclusive: true` — le praticien en retient **une**, et le badge « recommandée » est réservé
au groupe de tête. Une famille `exclusive: false` dit « on peut tout faire » ; ce n'est pas ce qu'on veut
dire de trois voies dont l'une se présente elle-même comme un dernier recours.

**2. Une carte qui QUALIFIE une autre carte n'est pas une option — c'est une modalité.** Si le contenu
d'une carte répond à « *comment* faire le geste de la carte voisine » et non à « *quel* geste faire »,
elle n'entre pas en concurrence avec elle : elle devient une **posologie** (panneau de la carte
qualifiée) et, si le patient déjà traité doit être interrogé, une **alerte**.

**Le critère de partage, à écrire tel quel** :

> **Une famille est exclusive quand ses cartes s'excluent dans l'ACTE, pas quand elles se ressemblent
> dans le TEXTE.**

### Contexte — les deux cas qui l'ont produite

**Les trois voies d'escalade d'`insuline`.** Les 7 familles du nœud étaient `exclusive: false` : l'écran
annonçait « — gestes cumulables » et badgeait « recommandée » sur *ajouter un GLP-1*, *ajouter un bolus*
**et** *passer aux prémélangées* — alors que la carte prémélangée se décrit elle-même comme une « option
dégradée, dernier recours ». Trois façons concurrentes de franchir le même palier, présentées comme trois
choses à faire.

**« Choisir un analogue basal de 2ᵉ génération ».** Cette carte ne peut pas être mise en concurrence avec
« Initier une insuline basale » : elle la **qualifie** (quelle molécule, une fois la basale décidée).
Elle est devenue **les deux** — une modalité dans le panneau posologie de la carte d'initiation *et* une
alerte pour le patient **déjà** sous basale. Le second usage n'est pas une redondance : l'option
d'origine exigeait `situation_insuline == naif`, donc le patient déjà traité ne la voyait **jamais**, et
personne ne lui posait la question.

### La limite de la décision — elle doit la porter, sinon elle sera appliquée à tort

**D53 ne vaut PAS pour les nœuds RHD** (arbitrage référent du 2026-08-06, tâche T-174 **abandonnée** pour
ce motif). Il avait été proposé de passer `exclusive: true` les trois familles de
`rhd-activite-physique` dont les cartes partagent un déclencheur identique. **Refusé, et le motif fait
règle :**

> En RHD, une carte n'est pas un **geste** que le praticien exécute, c'est une **piste** qu'il propose.

Le cadrage du module RHD le dit déjà : « la négociation avec le patient fait partie du geste — une piste
refusée n'est pas un échec, c'est une information ». Afficher trois formulations d'une même idée donne
**trois angles pour la même conversation** ; ce n'est pas du tout la même chose qu'ajouter un GLP-1
**et** un bolus. Les trois familles restent `exclusive: false`.

C'est exactement pourquoi le critère de partage porte sur l'**acte** et non sur la ressemblance textuelle :
les cartes RHD se ressemblent beaucoup dans le texte et ne s'excluent en rien dans l'acte. Une règle
formulée sur la similitude aurait produit le contresens.

### Raison du choix

`exclusive` est le seul endroit du contenu qui dit au praticien **combien de choses il doit retenir**.
Laisser `false` par défaut, comme le faisait le premier domaine, revient à répondre « autant que vous
voulez » à une question qui a une réponse clinique — et à dévaluer le badge « recommandée », qui finit
posé sur tout ce qui s'affiche.

L'alternative envisagée, hiérarchiser par le rang plutôt que par l'exclusivité, ne fonctionne pas : le
rang ne trie qu'**à l'intérieur** d'une famille, et une famille cumulable badge toutes ses cartes. C'est
le même mécanisme absent qui a produit **D52**.

### Ce qui reste interdit

1. **Déduire l'exclusivité de la ressemblance des textes.** Le test est l'acte : le praticien peut-il
   faire les deux le même jour, pour ce patient, sans contradiction ?
2. **Appliquer D53 aux nœuds RHD** — ou à tout futur nœud dont les cartes sont des *pistes de
   négociation* et non des *gestes*. Le cadrage du module doit alors le dire explicitement.
3. **Laisser une carte qui en qualifie une autre concourir avec elle.** Une modalité va en posologie ; si
   le patient déjà traité doit être interrogé, elle devient **aussi** une alerte — jamais une troisième
   option dans la même famille.

### Conséquences

- **Contenu (P14/S5, T-168)** : la famille d'escalade d'`insuline` passe `exclusive: true` ; « Choisir un
  analogue basal de 2ᵉ génération » devient posologie + alerte, et disparaît comme option.
- **Banc** : la section « paires intra-famille » de `engine/banc/paires.test.ts` devient le cliquet de
  cette décision — une famille `exclusive` dont deux cartes co-apparaissent y est signalée nommément.
- **Grammaire** : la décision est citée par **R13**, dont elle est le corollaire au niveau de la famille.
- **N2 humain** : l'effet à l'écran (une seule voie d'escalade badgée « recommandée », les autres en
  alternative) est un jugement d'usage — à relire en consultation (`VALIDATION.md`).
