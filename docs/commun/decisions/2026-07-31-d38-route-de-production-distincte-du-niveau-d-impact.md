# 2026-07-31 — D38 · La **route de production** n'est pas le **niveau d'impact**

### Décision

Une entrée de veille porte **deux champs distincts**, et ils ne coïncident pas :

| Champ | Valeurs | Décidé | Par quoi |
|---|---|---|---|
| `route` | `breve` \| `analyse` | **au screening**, avant lecture approfondie | le seuil de classement (SOP §6bis) |
| `niveau_impact` | `pratique` \| `informatif` | **après l'analyse** | l'appréciation critique elle-même |

Règles qui les lient :

- **brève ⟹ `informatif`, toujours.** Sans appréciation critique propre, une entrée ne peut pas
  prétendre qu'un item change la pratique.
- **une analyse peut conclure `informatif`** — et c'est fréquent, et c'est utile.
- donc **`analyse ⊇ pratique`** : tout item `pratique` a suivi la route analyse ; l'inverse est faux.

### Contexte

L'arbitrage de triage du 2026-07-31 pose que **tout item potentiellement à impact pratique passe en
grille complète + vérification bi-agents**. Le régulateur de charge de la semaine n'est donc plus un
plafond d'analyses décidé après coup : il est **dans le seuil de classement au screening**.

Or le screening juge sur un titre et un abstract, avant toute lecture sérieuse. Il ne peut se
prononcer que sur le **potentiel** d'un item — jamais sur son verdict. Faire porter au seul champ
`niveau_impact` du brief §5 les deux rôles obligeait à l'un de ces deux mensonges :

- le renseigner au screening, c'est-à-dire **préjuger** du résultat de l'analyse ;
- ou ne le renseigner qu'après, et n'avoir alors **aucun champ** pour dire quel travail a été
  engagé sur l'item — donc aucune trace auditable de la décision qui coûte le plus cher de la semaine.

### Alternatives envisagées

- **Un seul champ `niveau_impact`, renseigné au screening puis corrigé après analyse** — écartée : un
  champ qu'on corrige silencieusement perd sa valeur de trace, et le journal de screening ne
  montrerait plus l'engagement pris. On perdrait aussi le cas le plus instructif : « classé
  potentiellement pratique, analysé, conclu informatif ».
- **Un plafond hebdomadaire d'analyses** (« deux par semaine maximum ») — écartée : un plafond
  arbitraire coupe une semaine riche et laisse une semaine pauvre sans critère. Le seuil, lui, est un
  critère de contenu, opposable et discutable.

### Raison du choix

Deux champs disent deux choses vraies à deux moments différents, et rendent visible ce qu'un seul
champ cachait : **le fait qu'une analyse complète conclue « ça ne change rien » est un résultat**,
souvent le plus utile au lecteur — et sûrement pas un échec de screening. Sans les deux champs, ce
cas ressemblerait à une erreur ; avec eux, il se lit tel qu'il est.

Le couple rend aussi le seuil **mesurable** : la part des items en route `analyse` qui finissent
`informatif` est l'indicateur direct de son réglage. Trop élevée, le seuil est trop lâche ; nulle,
il est probablement trop sévère — ou le screening préjuge.

### Conséquences

- Le **schéma d'entrée** doit porter les deux champs (gel en S5). Le brief §5 n'en prévoyait qu'un.
- Le **journal de screening** porte une colonne `route` : un item `retenu` sans route est une ligne
  incomplète.
- La **vérification bi-agents** se déclenche sur `route: analyse`, pas sur `niveau_impact: pratique`
  — qui n'est pas encore connu au moment où elle doit être lancée.
- L'affichage V1 filtre sur `niveau_impact` (ce que le lecteur cherche) ; la `route` relève de la
  méthode et se lit dans le journal de la semaine.
