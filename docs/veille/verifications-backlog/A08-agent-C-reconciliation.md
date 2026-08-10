# A08 — Réconciliation (Agent C) — Antisepsie vaginale avant césarienne

**Article** : McKinney JA, Sanchez-Ramos L, *et al.* « Chlorhexidine is the preferred agent for vaginal
antisepsis prior to cesarean delivery: a systematic review and network meta-analysis. » *AJOG*
· DOI 10.1016/j.ajog.2025.09.046 · PMID 41485838 · 50 essais / 14 515 participantes · recherche
01/01/1990 → 24/01/2025.

**Procédure** : SOP §7bis, vérification tri-agents. Rapports réconciliés :
`A08-agent-A.md` (analyste) et `A08-agent-B.md` (contradicteur).
**Décision rendue en lieu et place du référent humain** — thème `sante-femme-perinatalite`, hors
compétence de fond du référent, aucune relecture obstétricien/sage-femme prévue.

**Contre-vérification propre à l'Agent C** : un appel Europe PMC (`EXT_ID:41485838`,
`resultType=core`) — abstract structuré complet re-obtenu de première main. Confirme point par point
les extractions de A et de B. Aucune tentative d'accès au texte intégral (`ajog.org` = 403, pas de
contournement, invariant projet n°7).

---

## 1. Consensus vérifié

Points sur lesquels A et B concordent, et que ma propre lecture de l'abstract confirme :

| Point | Statut |
|---|---|
| Identité de la source (titre, auteurs, DOI, PMID, revue) | **Confirmé** |
| 50 essais / 14 515 participantes | **Confirmé** (abstract, §Results) |
| Fenêtre de recherche 01/01/1990 → 24/01/2025, 6 bases + littérature grise | **Confirmé** (borne basse 1990 **non relayée** par le relais français) |
| RoB 2.0 + checklist TRACT (intégrité de la recherche) | **Confirmé** — point fort réel, rare dans ce champ |
| Antibioprophylaxie systémique = **critère d'inclusion** des essais | **Confirmé** verbatim (§Study eligibility criteria) |
| Estimation principale endométrite : **OR 3,65 [ICr 95 % 2,36–5,90]**, sens « pas de préparation vs chlorhexidine » | **Confirmé** |
| Autres critères : paroi 2,34 · complications de paroi 2,28 · fièvre 3,60 | **Confirmé** |
| OR 3,53 et OR 2,79 (stratifiés par statut du travail) | **Introuvables** dans la source accessible |
| Aucun SUCRA pour l'endométrite (seulement paroi et fièvre) | **Confirmé** |
| Aucun OR direct chlorhexidine vs povidone iodée | **Confirmé** |
| Aucun effet absolu, aucun risque de base, aucun NNT dans la NMA | **Confirmé** |
| Ni CINeMA ni GRADE-NMA, ni I²/τ², ni node-splitting chiffré, ni intervalle de prédiction chiffré | **Confirmé** — annoncés dans les méthodes, résultats non rapportés |
| Financement / conflits d'intérêts | **Non disponibles** (Europe PMC : pas d'information de financement) |
| Geste de bloc opératoire hospitalier, aucune profession du lectorat MSP ne l'exécute ni ne l'arbitre | **Confirmé** par les deux agents, et par moi |

Consensus de fond, à porter au crédit de l'article : **le message principal — l'antisepsie vaginale
avant césarienne apporte un bénéfice en sus de l'antibioprophylaxie systémique — est solide et
corroboré par une source indépendante** (Cochrane Haas 2020, certitude GRADE modérée). Ce qui ne
tient pas, ce n'est pas l'article : c'est (a) notre capacité à vérifier les chiffres qu'on nous
demande de publier, et (b) la pertinence de l'item pour ce lectorat.

---

## 2. Désaccords tranchés

### 2.1 `niveau_preuve` : `modere` (A) contre `faible` (B) — **je tranche pour `faible`**

- **Position de A** : `modere`, en reflétant « surtout la qualité apparente du design » (NMA
  bayésienne, 50 essais, RoB2 + TRACT, sensibilité stable), tout en reconnaissant explicitement que
  ce n'est « pas un jugement complet faute d'accès au texte intégral ».
- **Position de B** : `faible`, en précisant que cela ne dégrade pas l'article — « on constate qu'on
  ne peut pas le certifier ».
- **Nature réelle du désaccord** : les deux agents décrivent la **même** réalité. Ils divergent sur
  ce que le champ `niveau_preuve` est censé porter : **la qualité présumée de l'étude** (A) ou **le
  degré de certitude effectivement atteint par la vérification** (B).
- **Ce que dit la doctrine du projet** : l'invariant n°6 (`CLAUDE.md`) impose de « re-vérifier toute
  sortie sur la source primaire » et, « en cas de doute clinique, signaler plutôt qu'inventer ». Un
  champ de niveau de preuve publié à côté d'un résumé est lu par le professionnel comme **« voilà à
  quel point vous pouvez vous appuyer là-dessus »**, pas comme une note de design décernée à
  l'article. Porter `modere` reviendrait à transmettre une confiance qu'aucune pièce accessible ne
  soutient : ni intervalle de prédiction, ni évaluation d'incohérence chiffrée, ni CINeMA/GRADE-NMA
  des auteurs eux-mêmes.
- **Décision** : **`faible`**. Fondement : le champ porte la certitude atteinte, pas la réputation
  méthodologique présumée. Formulation opposable si l'item est un jour publié : *« faible — non pas
  du fait du design, mais parce que la vérification n'a pu porter que sur l'abstract »*. La
  formulation de B est reprise telle quelle, elle est exacte.
- **Remarque** : ce désaccord est en réalité **sans effet sur l'issue**, puisque la route retenue est
  `reporte` (§5). Je le tranche tout de même, pour que la reprise du dossier reparte d'un champ
  stabilisé et non d'un arbitrage à refaire.

### 2.2 Le classement des agents entre eux est-il soutenu ? — **non, et il faut le dire nettement**

- A propose une hiérarchie (chlorhexidine > povidone iodée > cétrimide/clindamycine/métronidazole >
  sérum/eau > rien) en la marquant « sous réserve, à confirmer sur texte intégral ».
- B soutient que le message du titre n'est **soutenu par aucun chiffre accessible**.
- **Ce que dit la source** : B a raison, sans nuance possible. L'abstract ne contient **aucun OR
  chlorhexidine vs povidone iodée**, et **aucun SUCRA pour l'endométrite** — le critère prioritaire.
  Les deux seuls SUCRA publiés portent sur l'infection de paroi (chlorhexidine 0,2 % : 0,995) et la
  fièvre (0,918). Un SUCRA est un **rang**, pas une taille d'effet : 0,995 contre 0,918 peut recouvrir
  des estimations dont les intervalles se chevauchent presque intégralement.
- **Décision** : **la hiérarchie proposée par A ne doit pas être diffusée**, même assortie d'une
  réserve. Elle mélange un rang publié (paroi, fièvre), une extrapolation vers un critère pour lequel
  aucun rang n'est publié (endométrite), et un souvenir de la NMA 2019. Une réserve en fin de tableau
  ne neutralise pas une hiérarchie numérotée : le lecteur retient l'ordre, pas l'avertissement.
  **Le titre de l'article affirme une conclusion (« Chlorhexidine is the preferred agent ») que la
  source accessible ne chiffre nulle part.** C'est le constat à consigner, et rien de plus.

### 2.3 Portée du report : A ne le recommande pas, B le retient — **je retiens `reporte`**

- **Position de A** : ne recommande pas `reporte`, au motif que l'enjeu pratique (`informatif`, aucun
  levier décisionnel MSP) ne justifie pas l'effort d'obtenir le texte intégral.
- **Position de B** : `reporte`, sur quatre motifs cumulatifs.
- **Décision** : **`reporte`**, et le raisonnement de A doit être explicitement écarté parce qu'il
  confond deux questions. « L'effort d'obtenir le texte intégral n'est pas justifié » est un argument
  de **priorité** ; il ne dit rien sur la **publiabilité**. La faiblesse de l'enjeu est une raison de
  mettre l'item **en bas de la file**, pas une raison de le faire sortir avec des chiffres
  invérifiés. Rappel de doctrine : `reporte` (« je n'ai pas pu vérifier ») n'est pas `informatif`
  (« j'ai vérifié, et ça ne change rien »). Ici on est dans le premier cas.

### 2.4 Divergence avec la NMA 2019 — l'explication des auteurs, et ce qu'elle vaut

- A la signale comme « un signal à interroger, pas juste à trancher pour la plus récente ».
- B l'instruit à fond : les auteurs assument la divergence (*« In contrast to earlier network
  meta-analyses, which identified povidone-iodine 1% as the top-ranked agent… »*) et l'expliquent par
  un réseau élargi et surtout une **stratification par concentration** (un nœud « chlorhexidine »
  unique diluait auparavant des concentrations d'efficacité inégale). B juge l'explication plausible
  mais **auto-servante et non auditable**.
- **Ma pesée** : l'argument de la stratification par concentration est **mécaniquement bon** — c'est
  une explication spécifique et testable, pas une pétition de principe, et les auteurs méritent
  crédit de l'avoir posée plutôt que tue. Mais B relève une objection que je fais mienne, et qui est
  décisive : **découper un nœud en sous-nœuds réduit les données par nœud**, rend les rangs plus
  instables et **sollicite davantage les comparaisons indirectes**, donc davantage l'hypothèse de
  transitivité — laquelle n'est ni évaluée ni évaluable depuis l'abstract. L'explication du
  renversement et la principale fragilité du renversement sont **le même mécanisme vu des deux
  côtés**. On ne peut pas accepter l'une sans instruire l'autre, et on ne peut instruire l'autre
  qu'avec les tableaux.
- **Décision** : la divergence est **expliquée mais non vérifiée**. Elle n'est pas un motif de report
  à elle seule, mais elle interdit de présenter le classement des agents comme acquis (§2.2).

### 2.5 L'objection « antibioprophylaxie = facteur de confusion » — **retirée, je reprends le redressement de B à mon compte**

B avait charge d'instruire cette objection et conclut honnêtement qu'elle **ne tient pas**. Je le
confirme sur pièce : l'abstract dit verbatim que les essais éligibles portent sur des femmes
césarisées *« who received systemic antibiotic prophylaxis »*. C'est un **critère d'éligibilité**,
pas une covariable oubliée. Le contraste mesuré est donc bien le bénéfice **en sus** du standard —
exactement la question pertinente. **Objection retirée.**

Un red-team qui retire une objection infondée fait son travail ; le suivre est la seule conduite
cohérente. Consigner l'inverse pour « faire poids » serait de la fabrication de doute.

**Réserve résiduelle, maintenue** : la borne basse de recherche est **1990**. Sur 35 ans,
« antibioprophylaxie systémique » recouvre des molécules, des doses et surtout des **timings** très
différents — l'administration avant incision plutôt qu'au clampage n'est le standard que depuis
~2010 et réduit elle-même l'endométrite. L'abstract ne dit pas si une méta-régression sur l'ère ou le
timing a été conduite. **Gravité : modérée, non majeure.**

### 2.6 Le *spin* — **il vient des auteurs, et c'est plus qu'une convention de présentation**

B établit, verbatim, que la formulation inversée est celle de l'abstract : *« Compared with patients
who received chlorhexidine, those who did not receive vaginal preparation had significantly higher
odds of endometritis (odds ratio, 3.65…) »*. **Confirmé par ma propre lecture. Le relais français n'a
rien inversé sur ce point : il a repris la présentation des auteurs.**

**Qualification demandée — spin ou convention défendable ?** Les deux, et il faut le dire dans cet
ordre. Prendre la chlorhexidine comme référence est **défendable en soi** : dans un réseau où l'on
veut désigner l'agent préférentiel, mettre l'agent candidat au dénominateur est un choix cohérent
avec la question posée. Ce n'est pas une erreur, et ce n'est pas une manipulation de données —
**3,65 et ≈0,27 sont strictement la même donnée**.

Mais le choix n'est pas neutre pour autant, et il se cumule avec deux autres marqueurs :
1. un facteur multiplicatif >1 est perçu comme un signal fort, une fraction comme un effet modeste ;
2. **le titre est une conclusion affirmative** (« Chlorhexidine is the preferred agent… »), marqueur
   de spin reconnu — d'autant que cette conclusion porte sur un classement d'agents que l'abstract ne
   chiffre nulle part (§2.2) ;
3. les IC de crédibilité sont rapportés, **les intervalles de prédiction — annoncés dans les méthodes
   et systématiquement plus larges — ne le sont pas**. La sélection de ce qui est mis en avant n'est
   pas neutre.

**Décision** : **spin présent, imputable aux auteurs, non au relais** sur ce point précis. Le relais
français ajoute sa propre couche, distincte : la substitution de deux chiffres de sous-groupe à
l'estimation principale (§3). À signaler dans les deux sens si l'item est un jour publié.

### 2.7 Pertinence pour le lectorat — **`informatif` confirmé**

A et B convergent, et je confirme. Le geste est un badigeonnage vaginal antiseptique réalisé au bloc
opératoire, immédiatement avant l'incision, par l'équipe obstétricale. Aucun destinataire de la veille
(MG, IPA, sage-femme **libérale**, IDEL d'une MSP à Paris 20ᵉ) ne l'exécute ni ne participe à la
décision qui le gouverne — celle-ci relève d'un protocole de service de maternité arbitré par des
obstétriciens et l'équipe d'hygiène hospitalière.

Les usages résiduels sont tous très faibles, et l'un d'eux mérite d'être écarté explicitement :
reconnaître une endométrite du post-partum au retour à domicile est une compétence de diagnostic qui
**ne dépend en rien de cet article**. Savoir quel antiseptique a été utilisé au bloc ne modifie pas
la conduite devant une fièvre du post-partum en ville.

**Décision** : `niveau_impact` = **`informatif`**. Le classer `pratique` serait une erreur de
classement. Et le plafond `informatif` vaut **même avec le texte intégral en main** — c'est ce qui
fixe la priorité au §6.

---

## 3. Le sort des chiffres relayés — section dédiée

**Le constat, établi trois fois indépendamment** (A, B, et ma propre requête Europe PMC) : les OR
**3,53 [2,09–6,57]** (césarienne avant travail) et **2,79 [1,32–5,88]** (en cours de travail)
**n'apparaissent nulle part dans la source accessible**. Celle-ci donne une estimation **globale**
pour l'endométrite : **OR 3,65 [ICr 95 % 2,36–5,90]**.

Ils sont **plausibles** : leur structure correspond exactement à l'analyse en sous-groupe
pré-spécifiée sur le statut du travail annoncée dans les Methods, et ils encadrent l'estimation
globale. Mais **plausible n'est pas vérifié**.

### La règle, formulée et justifiée

> **Un chiffre qu'on ne peut pas rattacher à un emplacement précis d'une source accessible ne figure
> pas dans une entrée de veille — même assorti d'une réserve, même si son existence est probable.**

Trois fondements :

1. **Règle d'ancrage du projet.** Chaque chiffre publié doit être relié à sa source, tableau ou page.
   Un chiffre dont on écrit « probablement dans un tableau du texte intégral » ne satisfait pas cette
   règle : on ne peut pas relire ce qu'on n'a pas lu.
2. **La réserve ne protège personne.** Le lecteur retient le chiffre, pas l'astérisque. Un OR assorti
   d'un IC porte une apparence de précision qu'aucune mise en garde en note ne défait.
3. **Ici s'ajoute une dégradation silencieuse du niveau de preuve.** Le relais a promu **deux chiffres
   de sous-groupe au rang de résultat titre**, en laissant de côté l'estimation principale pourtant
   publiée et accessible. Un sous-groupe, même pré-spécifié, est moins précis et moins fiable que
   l'estimation globale. Republier ces chiffres, ce serait reprendre à notre compte l'arbitrage
   éditorial du relais — précisément ce que la procédure de vérification existe pour empêcher.

**Ce qui aurait été publiable, si l'item passait** : l'OR global **3,65 [2,36–5,90]**, avec sa source
(abstract, §Results) et son sens explicité (« pas de préparation vs chlorhexidine » — donc OR > 1 =
sur-risque en l'absence d'antisepsie). **Ce qui ne l'est pas** : 3,53 et 2,79, dans quelque
formulation que ce soit.

**Corollaire opposable pour le reste du lot** : lorsqu'un relais met en avant un chiffre absent de la
source accessible **alors que l'estimation principale, elle, y figure**, ce n'est pas seulement un
défaut de vérification — c'est un **signal sur le relais**, à consigner comme tel.

---

## 4. Ce que je n'ai pas pu trancher sur pièces

### 4.1 La contradiction de direction sur le sous-groupe « travail » — **non tranchable, et c'est décisif**

C'est le point le plus préoccupant du dossier, correctement identifié par B.

- **La Cochrane (Haas 2020, CD007892.pub7)** rapporte un bénéfice de l'antisepsie vaginale **plus
  grand chez les femmes EN travail**.
- **Les chiffres relayés** disent l'inverse : OR 3,53 avant travail > OR 2,79 en cours de travail,
  soit un sur-risque d'absence d'antisepsie plus marqué **hors travail**, donc un bénéfice plus grand
  hors travail.

**Ce que je peux trancher, et que ni A ni B n'ont relevé** : pris au pied de la lettre, les deux
intervalles relayés se **chevauchent presque intégralement** (2,09–6,57 contre 1,32–5,88). Même en
supposant ces chiffres exacts, **ils ne démontrent aucune différence entre les deux sous-groupes** —
et donc ne renversent rien du tout. Toute lecture du type « le bénéfice est plus grand avant le
travail » serait une **sur-interprétation d'une différence non établie**, indépendamment même de la
question de leur origine. C'est un troisième motif de ne pas les publier, qui tient sans accès au
texte intégral.

**Ce que je ne peux pas trancher** : laquelle des trois hypothèses de B est la bonne — (i) renversement
réel non signalé dans l'abstract, (ii) **interversion des deux valeurs par le relais**, (iii) les
chiffres ne sont pas ceux qu'on croit. Départager exige les tableaux du texte intégral, inaccessibles
(403, pas de contournement).

**Ce que cela commande** : SOP §6bis — un **désaccord matériel non tranchable sur pièces impose
`reporte`**. Je ne bricole pas de compromis. Et je note que dans les trois hypothèses, publier serait
une faute : dans (i) on relaierait un résultat majeur sans pouvoir l'attester, dans (ii) on
propagerait une erreur de relais, dans (iii) on publierait des chiffres d'origine inconnue.

### 4.2 Les exigences propres à une NMA — non jugeables depuis un abstract

**Transitivité** (gravité majeure) : aucune mention, aucune évaluation. Le sous-groupe « geographic
setting » est un **indice** que les auteurs ont vu le problème, mais teste la modification d'effet ;
il ne démontre pas l'échangeabilité des populations sur les comparaisons **indirectes**. Or la
comparaison chlorhexidine vs povidone iodée — le message du titre — est très probablement portée en
bonne partie par des comparaisons indirectes via le nœud commun « pas de préparation », dans une
littérature dont une part importante vient de contextes à ressources limitées où le risque de base
diffère fortement.

**Incohérence, hétérogénéité, intervalles de prédiction** : annoncés dans les méthodes, **aucune
valeur rapportée**. Un OR 3,65 [2,36–5,90] en intervalle de crédibilité peut parfaitement
s'accompagner d'un intervalle de prédiction franchissant 1.

**CINeMA / GRADE-NMA** : aucune trace. RoB2 et TRACT portent sur les **études individuelles**, pas sur
la confiance dans les estimations du **réseau** — ce sont des objets distincts et non substituables.
Je ne peux donc pas dire quel niveau de confiance **les auteurs eux-mêmes** accordent à leur
estimation clé.

### 4.3 Points secondaires non résolus

- **PROSPERO** : numéro CRD42025649677 trouvé par A via recherche secondaire, **non confirmé** par
  consultation directe ; B ne l'a pas vérifié. **Statut : inconnu.**
- **Financement et conflits d'intérêts** : non disponibles (Europe PMC : pas d'information de
  financement).
- **Définition harmonisée de l'endométrite** entre les 50 essais : non documentée dans l'abstract.
  Limite classique et non vérifiée de ce champ, à ne pas présenter comme absente.
- **Effet absolu / NNT depuis la NMA** : inexistants. Le seul ancrage absolu du dossier (endométrite
  7,1 % → 3,1 %, RRA 4,0 points, **NNT ≈ 25**, certitude GRADE modérée) vient de la **Cochrane 2020**,
  source distincte, corpus différent (20 essais / 6 918 femmes) et **contraste différent** (antisepsie
  toutes solutions confondues vs rien, et non chlorhexidine vs rien). A et B le signalent tous deux
  correctement. **Ce chiffre ne doit jamais être attribué à McKinney 2025.** Et le taux de base de
  7,1 % étant une moyenne sur des contextes très divers, le **NNT réel en France, sous céfazoline
  pré-incision, est vraisemblablement plus élevé que 25**.

---

## 5. Décision finale de classement

| Champ | Valeur |
|---|---|
| `route` | **`reporte`** |
| `theme` | `sante-femme-perinatalite` |
| `professions` | `sage-femme` (culture générale uniquement — **aucune profession du lectorat n'est décisionnaire sur ce geste**) |
| `niveau_impact` | **`informatif`** |
| `niveau_preuve` | **`faible`** — non du fait du design (NMA de bonne facture sur le plus grand corpus disponible), mais parce que la vérification n'a pu porter que sur l'abstract |
| `meta.relecture_referent` | **`false`** |
| Impacte un algorithme / nœud de décision ? | **Non** |
| Chiffres publiables en l'état | **Aucun des chiffres relayés.** Seul l'OR global 3,65 [2,36–5,90] est ancré — mais l'item ne sort pas |

**Motifs cumulatifs du report** (SOP §6bis) :

1. **Les deux chiffres que le relais demande de publier sont introuvables dans la source accessible**
   — violation de la règle d'ancrage (§3).
2. **Désaccord matériel non tranchable sur pièces** : contradiction de direction avec la Cochrane sur
   le sous-groupe « travail », sans moyen de départager renversement réel et interversion du relais
   (§4.1). Motif suffisant à lui seul.
3. **Vérification structurellement incomplète** : transitivité, incohérence, intervalles de prédiction
   et confiance CINeMA — les points critiques d'une NMA — sont injugeables depuis un abstract (§4.2).
4. **Aucun effet absolu ni NNT** dans la NMA, alors que la grille du projet impose de privilégier
   l'effet absolu sur le risque relatif.

**Ce que le report ne dit pas** : il ne dit pas que l'article est mauvais. Le message principal —
l'antisepsie vaginale avant césarienne apporte un bénéfice en sus de l'antibioprophylaxie — est
corroboré par la Cochrane avec une certitude modérée. Le report porte sur **notre capacité à
attester ce qu'on nous demande de publier**, pas sur la valeur de l'étude.

---

## 6. Condition de levée du report et priorité dans la file

### Condition de levée

Le report se lève **si et seulement si** le texte intégral devient accessible sans coût et sans
contournement de paywall (accès institutionnel, dépôt auteur, version acceptée en archive ouverte).
Vérifier alors **dans cet ordre** :

1. **Existence et localisation exacte de 3,53 et 2,79** (numéro de tableau), et **vérification de
   l'ordre des deux valeurs** — c'est le point qui décide entre renversement réel et interversion du
   relais ;
2. si les deux valeurs existent, **le test d'interaction entre sous-groupes** — sans lui, la
   différence n'est pas établie (§4.1) ;
3. **intervalles de prédiction** de l'estimation principale ;
4. **tableau CINeMA / GRADE-NMA** ;
5. **OR direct chlorhexidine vs povidone iodée** et **SUCRA pour l'endométrite** ;
6. **risque de base et effet absolu** ;
7. répartition géographique par nœud du réseau (transitivité).

### Priorité dans la file : **basse — dernier rang**

Application de l'ordre du §6bis :

- **(1) Items touchant une décision** → cet item n'en touche **aucune**. Aucune profession du
  lectorat n'exécute ni n'arbitre le geste (§2.7). **Critère non satisfait.**
- **(2) Plus grand effet absolu sur la décision la plus fréquente** → sans objet : pas de décision,
  et la NMA ne fournit aucun effet absolu.
- **(3) À égalité, item déjà reporté une fois** → premier report.

**Son plafond est `informatif` même avec le texte intégral en main.** Autrement dit, le meilleur
résultat atteignable après un cycle d'accès complet reste une brève de culture générale sur un geste
que personne dans le lectorat ne pratique. **Ne pas le remonter dans la file, et ne pas lui consacrer
un second cycle de vérification** : le laisser en attente passive, à traiter uniquement si le texte
intégral tombe entre les mains du projet à coût nul.

### Conditions opposables si le report était un jour levé et l'item publié

- **Interdiction** de publier 3,53 et 2,79, dans quelque formulation ou réserve que ce soit, tant
  qu'ils ne sont pas localisés dans un tableau du texte intégral.
- **Interdiction** de diffuser une hiérarchie entre agents antiseptiques (§2.2) tant qu'aucun OR
  direct ni SUCRA pour l'endométrite n'est produit.
- **Obligation**, si l'OR 3,65 est cité, d'expliciter son sens (« absence de préparation vs
  chlorhexidine ») et de mentionner qu'il équivaut à ≈0,27 dans le sens conventionnel
  intervention-vs-rien.
- **Obligation** d'étiqueter tout chiffre absolu (7,1 % → 3,1 %, NNT ≈ 25) comme provenant de la
  **Cochrane 2020**, jamais de McKinney 2025, avec mention que le NNT français est vraisemblablement
  plus élevé.
- **Obligation** de signaler le spin de titre et le choix de sens des auteurs (§2.6), ainsi que la
  substitution de chiffres opérée par le relais français (§3).
- **Bandeau `meta.relecture_referent: false`** visible.

---

## 7. Ce que cette procédure ne garantit pas

A, B et moi avons lu **exactement la même chose** — l'abstract structuré via Europe PMC — et partageons
donc le même angle mort : aucun de nous n'a vu un tableau, une figure, un forest plot ou un diagramme
de réseau de cet article, si bien que notre triple concordance n'atteste que la cohérence de trois
lectures d'un même résumé, et non l'exactitude de ce que contient l'étude ; s'y ajoute qu'aucun de
nous trois n'est obstétricien, et que le classement rendu ici n'a fait l'objet d'aucune relecture
clinique de fond.
