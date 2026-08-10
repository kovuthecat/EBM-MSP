# A08 — Agent B (contradicteur) — NMA antisepsie vaginale avant césarienne

**Article** : McKinney JA, Sanchez-Ramos L, *et al.* « Chlorhexidine is the preferred agent for vaginal antisepsis prior to cesarean delivery: a systematic review and network meta-analysis. » *AJOG* · DOI 10.1016/j.ajog.2025.09.046 · PMID 41485838 · *Am J Obstet Gynecol* 2026;233(6S):S504.e1-S504.e41.
**Thème** : `sante-femme-perinatalite` — hors compétence de fond du référent, pas de relecture obstétricien/sage-femme prévue.
**Statut de la vérification** : faite sur **abstract structuré uniquement**.

---

## 1. Accès à la source

| Source | Résultat |
|---|---|
| `ajog.org` (texte intégral) | **403** confirmé en amont — non tenté, pas de contournement |
| **Europe PMC** (webservice REST, `resultType=core`) | **Abstract structuré complet obtenu** — Objective / Data sources / Eligibility / Methods / Results / Conclusion + mots-clés |
| **PubMed** (PMID 41485838) | Abstract concordant, mêmes chiffres — sert de contre-vérification |

**Ce que je n'ai PAS pu lire** : aucun tableau, aucune figure, aucun forest plot, aucun diagramme de réseau, aucune analyse en sous-groupe détaillée, aucune valeur d'I²/τ², aucun résultat de node-splitting, aucun tableau CINeMA/GRADE-NMA, aucun funnel plot, aucune déclaration de financement/conflits (Europe PMC : *no grant information provided*).

> **Conséquence de méthode, à traiter comme un élément du verdict** : la transitivité et l'incohérence d'un réseau **ne se jugent pas depuis un abstract**. L'abstract dit que ces analyses ont été *faites* ; il ne dit pas ce qu'elles ont *trouvé*. Tout jugement sur ces points ci-dessous est donc un jugement sur une **déclaration d'intention méthodologique**, pas sur des résultats.

---

## 2. Vérification chiffre par chiffre

| Chiffre annoncé (presse FR) | Trouvé dans la source accessible | Localisation | Verdict |
|---|---|---|---|
| OR **3,53 [2,09–6,57]** — endométrite, césarienne **avant travail** | **Non** | — | **INTROUVABLE dans la source accessible** |
| OR **2,79 [1,32–5,88]** — endométrite, césarienne **en cours de travail** | **Non** | — | **INTROUVABLE dans la source accessible** |
| — | OR **3,65 [ICr 95 % 2,36–5,90]** — endométrite, **toutes césariennes confondues**, pas de préparation vs chlorhexidine (concentration non spécifiée) | Abstract, §Results | Chiffre **réellement publié** dans l'abstract |
| — | OR 2,34 [1,66–3,36] — infection de paroi | Abstract, §Results | idem |
| — | OR 2,28 [1,65–3,32] — complications de paroi | Abstract, §Results | idem |
| — | OR 3,60 [2,27–5,86] — fièvre du post-partum | Abstract, §Results | idem |
| 50 essais / 14 515 participantes | **Oui** — « Fifty trials (14,515 participants) » | Abstract, §Results | **Confirmé** |
| Recherche jusqu'au 24/01/2025 | **Oui** — 01/01/1990 → 24/01/2025 | Abstract, §Data sources | **Confirmé** (+ borne basse 1990, non relayée) |
| RoB2 + filtre TRACT | **Oui** — Cochrane RoB 2.0 + Trustworthiness in RAndomized Controlled Trials | Abstract, §Methods | **Confirmé** |

### Lecture de l'écart

Les deux chiffres relayés par la presse **ne sont ni l'un ni l'autre l'estimation principale**. Leur structure (deux valeurs stratifiées « avant travail » / « en cours de travail », encadrant l'estimation globale 3,65) correspond exactement à l'**analyse en sous-groupe pré-spécifiée sur le statut du travail** annoncée dans les Methods. Ils sont donc **plausibles** — mais ils vivent dans un tableau du texte intégral auquel je n'ai pas accès.

**C'est un problème de veille en soi** : le relais français a mis en avant deux chiffres de **sous-groupe** en laissant de côté l'estimation principale publiée dans l'abstract. Un sous-groupe, même pré-spécifié, est moins précis et moins fiable que l'estimation globale ; le promouvoir au rang de résultat titre est une dégradation silencieuse du niveau de preuve. **Aucun de ces deux chiffres ne peut être publié en l'état par la MSP** : la règle d'ancrage du projet (chaque chiffre relié à sa source, tableau/page) n'est pas satisfaite.

---

## 3. Objections méthodologiques, par gravité

### 3.1 Antibioprophylaxie concomitante — **objection anticipée qui NE TIENT PAS** (à dire honnêtement)

C'était *a priori* l'objection la plus lourde. Elle tombe à la lecture des critères d'éligibilité :

> Les essais inclus portent sur des femmes césarisées **« who received systemic antibiotic prophylaxis »** (Abstract, §Study eligibility criteria).

L'antibioprophylaxie systémique est donc un **critère d'inclusion**, pas une covariable. Le contraste estimé est bien le bénéfice **en sus** de l'antibioprophylaxie — exactement la question pertinente. Il ne s'agit pas d'une méta-analyse mélangeant des ères pré- et post-céfazoline.

**Réserves qui subsistent malgré tout, non résolubles depuis l'abstract :**
- La borne basse de recherche est **1990** : sur 35 ans, « antibioprophylaxie systémique » recouvre des molécules, des doses et surtout des **timings** très différents (l'administration *avant incision* plutôt qu'au clampage n'est le standard que depuis ~2010 et réduit elle-même l'endométrite). Un essai de 1993 avec ampicilline au clampage n'est pas échangeable avec un essai de 2022 avec céfazoline pré-incision.
- L'abstract ne dit pas si l'observance de ce critère a été vérifiée par essai ni si une méta-régression sur l'ère/le timing a été conduite.

**Gravité : modérée** (et non majeure, contrairement à l'hypothèse de départ).

### 3.2 Transitivité — **postulée plus qu'établie, et invérifiable ici**

L'abstract ne contient **aucune mention du mot transitivité ni d'aucune évaluation de la comparabilité des essais** entre les nœuds du réseau. Il mentionne un sous-groupe « geographic setting », ce qui est un **indice** que les auteurs ont vu le problème — mais un sous-groupe géographique n'est pas une évaluation de transitivité : il teste la modification d'effet, il ne démontre pas l'échangeabilité des populations sur les comparaisons **indirectes**.

Or c'est précisément là que se joue la conclusion. La comparaison **chlorhexidine vs povidone iodée** — le vrai message du titre — est très probablement portée en bonne partie par des comparaisons **indirectes** via le nœud commun « pas de préparation ». Une part importante de la littérature d'antisepsie vaginale vient de pays à ressources limitées, où le risque de base d'endométrite et les pratiques de bloc diffèrent fortement. Si les essais de chlorhexidine et ceux de povidone iodée ne se répartissent pas de la même façon entre contextes, l'estimation indirecte est confondue par le contexte, pas par l'agent.

**Gravité : majeure**, et **non levable sans le texte intégral**.

### 3.3 Incohérence et hétérogénéité — **annoncées, résultats inconnus**

L'abstract déclare : cadre bayésien, **intervalles de crédibilité 95 % ET intervalles de prédiction 95 %**, évaluation de l'**incohérence globale et locale**, SUCRA. C'est du bon artisanat méthodologique sur le papier — les intervalles de prédiction en particulier sont une pratique exigeante, souvent omise.

Mais : **aucune valeur n'est donnée**. Pas un I², pas un τ², pas un p d'incohérence, pas un résultat de node-splitting, et surtout **aucun intervalle de prédiction chiffré** alors qu'ils disent en avoir produit. C'est en soi un signal : quand les IC de crédibilité sont rapportés dans l'abstract et que les intervalles de prédiction — systématiquement plus larges — ne le sont pas, la sélection de ce qui est mis en avant n'est pas neutre. Un OR 3,65 [2,36–5,90] en ICr peut parfaitement s'accompagner d'un intervalle de prédiction franchissant 1.

**Gravité : majeure pour la publication** (on ne peut pas transmettre une précision qu'on n'a pas vérifiée).

### 3.4 Confiance que les auteurs s'accordent — **CINeMA/GRADE-NMA : aucune trace**

L'abstract ne mentionne **ni CINeMA ni GRADE-NMA**. Il mentionne RoB2 (risque de biais des essais) et TRACT (intégrité de la recherche) — deux outils qui portent sur les **études individuelles**, pas sur la **confiance dans les estimations du réseau**. Ce sont des choses différentes et non substituables.

Il est possible qu'un tableau CINeMA existe dans le texte intégral. En l'état, **je ne peux pas dire quel niveau de confiance les auteurs attribuent eux-mêmes à leur estimation clé** — ce qui, d'après la consigne du projet, interdit de relayer le chiffre comme s'il était solide.

Point positif à porter au crédit des auteurs : l'usage du filtre **TRACT** est notable. La littérature obstétricale des dernières décennies a connu des rétractations pour essais non fiables ; appliquer un filtre d'intégrité et conduire une analyse de sensibilité excluant les essais « untrustworthy » est plus rigoureux que la moyenne du genre.

### 3.5 Registre / protocole

Non mentionné dans l'abstract. PROSPERO non vérifié faute de quota. **Inconnu.**

---

## 4. La divergence avec la NMA 2019 et la Cochrane

**Les auteurs traitent la divergence explicitement — et c'est à leur crédit.** Conclusion de l'abstract, verbatim partiel : *« In contrast to earlier network meta-analyses, which identified povidone-iodine 1% as the top-ranked agent… »*.

**Raison de l'écart, telle que les auteurs la donnent** : un **réseau élargi**. Ils avancent trois arguments, tous du même ordre :
1. **Volume de preuve** : 50 essais / 14 515 participantes, contre un corpus nettement plus restreint en 2019 ;
2. **Stratification par concentration** : la NMA 2025 traite la chlorhexidine non comme un nœud unique mais comme plusieurs nœuds (0,05 % à 5 %). C'est le point méthodologique de fond — si les essais anciens mélangeaient des concentrations d'efficacité inégale dans un seul nœud « chlorhexidine », ce nœud était dilué et sous-performait mécaniquement face à la povidone iodée 1 % ;
3. **Constance inter-critères** : chlorhexidine la plus régulièrement première sur endométrite, paroi et fièvre, plutôt que première sur un seul critère.

**Mon appréciation de cette explication** : elle est **cohérente et mécaniquement plausible**, et l'argument de la stratification par concentration est réellement bon. Mais elle reste **auto-servante et non auditée** depuis l'abstract. Trois réserves :
- Un renversement de classement fondé sur des **SUCRA** est fragile par construction : le SUCRA est un rang, pas une taille d'effet. Un SUCRA de 0,995 vs 0,918 peut recouvrir des estimations dont les intervalles se chevauchent presque intégralement. **L'abstract ne donne aucune comparaison directe chiffrée chlorhexidine vs povidone iodée** — ni OR, ni intervalle. Le message du titre n'est donc, dans la source accessible, **soutenu par aucun chiffre**.
- Découper un nœud en sous-nœuds par concentration **augmente le nombre de nœuds et réduit les données par nœud**, ce qui rend les rangs plus instables et sollicite davantage les comparaisons indirectes — donc davantage l'hypothèse de transitivité déjà non vérifiable (§3.2).
- **La Cochrane Haas *et al.* (CD007892) n'est pas mentionnée dans l'abstract.** Je n'ai pas pu vérifier si la NMA 2025 se positionne par rapport à elle, ni récupérer le risque de base d'endométrite qu'elle documente.

**Conclusion de section** : la divergence est **expliquée mais non vérifiée**. L'explication par la concentration est la meilleure hypothèse disponible ; elle ne peut pas être validée sans les tableaux.

### 4bis. La Cochrane (Haas *et al.*, CD007892.pub7, 2020) — récupérée, et elle change deux choses

> ⚠ **Source distincte de la NMA.** Tous les chiffres de cette sous-section viennent de la revue Cochrane, **pas** de McKinney 2025. Ne jamais les attribuer à la NMA.

Contenu vérifié (abstract Cochrane via Europe PMC) : **20 essais, 6 918 femmes**. Endométrite **de 7,1 % (contrôle) à 3,1 % (antisepsie vaginale)**, aRR **0,41 [0,29–0,58]**, **certitude GRADE modérée**. Également : fièvre post-op aRR 0,64 et infection de paroi RR 0,62, certitude modérée ; aucun effet indésirable rapporté, **ni pour la povidone iodée ni pour la chlorhexidine**.

Deux conséquences importantes :

**(a) La Cochrane ne désigne pas de gagnant.** Elle conclut au bénéfice de l'antisepsie vaginale **en tant que telle**, sans départager les agents. La divergence de fond n'oppose donc pas « NMA 2025 vs Cochrane » — sur le message principal (*l'antisepsie vaginale marche*), les deux **concordent**, et la Cochrane le dit avec une **certitude modérée** que la NMA n'a pas explicitée. La divergence porte uniquement sur le **classement des agents**, c'est-à-dire sur la partie la plus fragile (SUCRA, comparaisons indirectes) et la moins pertinente pour nous.

**(b) Contradiction directe sur le sous-groupe « travail » — et elle touche précisément les chiffres relayés.** La Cochrane rapporte un bénéfice **plus grand chez les femmes EN travail** (sur 4 critères sur 5). Or les chiffres de la presse française vont **dans le sens inverse** : OR 3,53 **avant travail** > OR 2,79 **en cours de travail**, soit un bénéfice plus grand **hors travail**.

Cette inversion est le signal le plus préoccupant de tout le dossier. Trois lectures possibles, non départageables sans le texte intégral : (i) la NMA 2025, avec son corpus élargi, renverse réellement le résultat de sous-groupe de 2020 — auquel cas c'est un résultat majeur que l'abstract ne mentionne même pas ; (ii) le relais français a **interverti les deux valeurs** ; (iii) les deux chiffres ne sont pas ceux qu'on croit. **Dans les trois cas, publier ces chiffres serait une faute.** Cela consolide le verdict `reporte` bien au-delà d'un simple défaut d'accès.

---

## 5. Spin

### 5.1 L'inversion du sens de l'effet — **elle vient des AUTEURS, pas du relais français**

Point important, à établir clairement : l'abstract est formulé ainsi, verbatim : *« Compared with patients who received chlorhexidine, those who did not receive vaginal preparation had significantly higher odds of endometritis (odds ratio, 3.65…) »*.

Le référentiel est donc bien la **chlorhexidine**, et le groupe « pas de préparation » est celui dont on mesure le sur-risque. **La presse française n'a pas inversé quoi que ce soit : elle a repris la présentation des auteurs.**

Cela ne rend pas la présentation neutre pour autant. La formulation naturelle d'un essai d'intervention est « intervention vs rien » — ici **chlorhexidine vs pas de préparation, OR ≈ 0,27 [0,17–0,42]** (inverse de 3,65). Choisir le sens qui produit **3,65** plutôt que **0,27** est un choix rhétorique classique : un facteur multiplicatif supérieur à 1 est perçu comme un signal fort, une fraction comme un effet modeste, alors que c'est **strictement la même donnée**. Le titre de l'article (« Chlorhexidine is the preferred agent… ») est lui-même une conclusion affirmative posée en titre, ce qui est un marqueur de spin reconnu.

**Verdict spin : présent, imputable aux auteurs, repris tel quel par le relais.** À signaler si publication.

### 5.2 Distorsion propre au relais français

Le relais ajoute sa propre couche, distincte : il a **substitué deux chiffres de sous-groupe à l'estimation principale** (§2). C'est une distorsion du relais, celle-là.

### 5.3 Ce qui manque des deux côtés

Ni l'abstract ni le relais ne donnent : risque de base d'endométrite, différence absolue de risque, NNT, intervalles de prédiction, niveau de confiance CINeMA, comparaison directe chlorhexidine vs povidone iodée.

---

## 6. Effet absolu — **absent, et c'est bloquant**

L'abstract ne fournit **aucun risque de base** d'endométrite, **aucune différence de risque absolue**, **aucun NNT**. Uniquement des OR.

C'est disqualifiant au regard de la grille du projet (§5 : *« Toujours privilégier l'effet absolu et le NNT au risque relatif »*). Un OR de 3,65 sur un événement dont le taux de base sous antibioprophylaxie moderne est faible (l'endométrite post-césarienne sous céfazoline pré-incision est de l'ordre de quelques pourcents dans les systèmes à ressources élevées) produit un bénéfice absolu bien plus modeste que le chiffre relatif ne le suggère — mais **je ne peux pas le chiffrer honnêtement**.

### Ancrage externe récupéré — **Cochrane, PAS la NMA**

> ⚠ Chiffres issus de **Haas *et al.*, Cochrane CD007892.pub7 (2020)**, 20 essais / 6 918 femmes. **À ne jamais présenter comme un chiffre de McKinney 2025.**

- Risque d'endométrite : **7,1 % sans antisepsie → 3,1 % avec** ;
- Réduction absolue du risque : **4,0 points** ;
- **NNT ≈ 25** (1 / 0,040) pour éviter une endométrite ;
- Certitude **GRADE modérée**.

C'est le seul chiffre absolu défendable du dossier — et il est **plus modeste que ne le laisse croire un « OR 3,65 »**, ce qui illustre exactement le travers dénoncé au §5.1.

**Trois limites à ne pas escamoter si ce chiffre est un jour utilisé :**
1. Il provient d'un **corpus différent** (20 essais, pas 50) et d'un **contraste différent** (antisepsie *toutes* solutions confondues vs rien, pas chlorhexidine vs rien) ;
2. Le taux de base de **7,1 %** est une moyenne sur des essais de contextes très divers ; dans une maternité française sous céfazoline pré-incision il est **vraisemblablement plus bas**, donc le **NNT réel en France est vraisemblablement plus élevé que 25** ;
3. **La NMA 2025 elle-même ne fournit toujours aucun effet absolu.**

**Item non actionnable en l'état sur les chiffres de la NMA** ; l'ancrage Cochrane existe mais il répond à une autre question que celle du relais français.

---

## 7. Pertinence pour un lectorat de soins primaires — **objection décisive**

L'intervention est un **badigeonnage vaginal antiseptique réalisé au bloc opératoire, en salle, immédiatement avant l'incision d'une césarienne**, par l'équipe obstétricale ou le bloc.

Confrontation au lectorat réel (MSP, Paris 20ᵉ) :

| Profession | Pratique-t-elle une césarienne ? | Prescrit-elle / choisit-elle l'antiseptique de bloc ? | Décision déplacée |
|---|---|---|---|
| MG | Non | Non | **Aucune** |
| IPA | Non | Non | **Aucune** |
| Sage-femme **libérale** | Non (pas de bloc) | Non | **Aucune** |
| IDEL | Non | Non | **Aucune** |

**Aucun destinataire de cette veille n'exécute jamais ce geste, ni ne participe à la décision qui le gouverne.** Celle-ci relève d'un protocole de service de maternité, arbitré par des obstétriciens et l'équipe d'hygiène hospitalière.

Les usages résiduels imaginables sont tous **très faibles** :
- répondre à une question d'une patiente en pré-opératoire — mais le geste ne dépend pas d'elle ;
- reconnaître une endométrite du post-partum au retour à domicile — mais **c'est une compétence de diagnostic qui ne dépend en rien de cet article** ; savoir quel antiseptique était le meilleur ne change rien à la prise en charge d'une fièvre du post-partum en ville.

**Conclusion nette : classer cet item `pratique` serait une erreur de classement.** Le critère du projet est « quelle décision *du lecteur* cet item déplace-t-il ». Ici : **aucune**. Le seul classement défendable est `informatif` — culture générale, ou argument à porter si un professionnel de la MSP siège dans une instance de réseau périnatal.

---

## 8. Ce qui tient malgré tout (honnête)

Il serait malhonnête de traiter cet article comme faible. Ce qui tient :

1. **L'antibioprophylaxie systémique est un critère d'inclusion**, pas une variable oubliée. L'objection la plus lourde que j'étais chargé d'instruire **ne tient pas**. Le contraste est bien « en sus du standard ».
2. **Le corpus est le plus large disponible** : 50 essais, 14 515 participantes, 7 bases + littérature grise, borne 1990→24/01/2025. Personne n'a fait mieux sur cette question.
3. **RoB2 + TRACT + analyse de sensibilité excluant les essais non fiables** : au-dessus de la moyenne du genre, particulièrement pertinent dans un domaine touché par des rétractations.
4. **Cadre bayésien avec intervalles de prédiction et évaluation d'incohérence globale ET locale** annoncés, sous-groupes **pré-spécifiés** (travail, rupture des membranes, contexte géographique). C'est un plan d'analyse sérieux.
5. **Les auteurs affrontent la divergence avec les NMA antérieures au lieu de la taire**, et proposent un mécanisme explicatif spécifique et testable (stratification par concentration).
6. **Le message principal est corroboré par une source indépendante de meilleure traçabilité** : la Cochrane 2020 conclut au même bénéfice de l'antisepsie vaginale avant césarienne, avec une **certitude GRADE modérée** et un effet absolu chiffré. Ce n'est donc pas un résultat isolé. La divergence ne porte que sur le **classement des agents**.
7. **La direction de l'effet est cohérente et robuste** : les quatre critères vont dans le même sens, avec des intervalles qui n'approchent pas 1, et « subgroup and sensitivity analyses yielded consistent findings ». Que l'antisepsie vaginale avant césarienne apporte quelque chose **en sus** de l'antibioprophylaxie est une conclusion défendable.

Ce qui ne tient pas, ce n'est pas l'article : c'est **notre capacité à le vérifier** et **sa pertinence pour ce lectorat**.

---

## 9. Verdict

| Champ | Valeur |
|---|---|
| **Thème** | `sante-femme-perinatalite` |
| **Professions** | aucune du périmètre MSP n'est décisionnaire ; à la rigueur `sage-femme` (culture) |
| **`niveau_preuve`** | **Faible** — non pas à cause du design (NMA de bonne facture sur le plus grand corpus disponible), mais parce que **la vérification est impossible depuis un abstract** : ni incohérence chiffrée, ni τ²/I², ni intervalles de prédiction, ni CINeMA, ni comparaison directe chlorhexidine vs povidone iodée, ni effet absolu. On ne dégrade pas l'article, on constate qu'on ne peut pas le certifier. |
| **`niveau_impact`** | **`informatif`** — geste de bloc opératoire hospitalier ; aucun lecteur de la MSP ne l'exécute ni ne l'arbitre. `pratique` serait une erreur de classement. |
| **`route`** | **`reporte`** |

### Motif du report (SOP §6bis)

Report, et **non** `analyse` ni `breve`, pour trois motifs cumulatifs :

1. **Les deux chiffres que le relais français nous demande de publier sont introuvables dans la source accessible.** L'abstract donne 3,65 [2,36–5,90] en global ; 3,53 et 2,79 sont vraisemblablement des sous-groupes du texte intégral, mais **vraisemblablement ≠ vérifié**. Publier un chiffre qu'on n'a pas vu au tableau viole la règle d'ancrage du projet.
2. **Ces deux chiffres contredisent en outre la Cochrane sur le sens du sous-groupe** (§4bis) : la Cochrane trouve un bénéfice **plus grand en travail**, le relais annonce l'inverse. Soit c'est un renversement majeur non signalé, soit c'est une interversion du relais. Motif de report à lui seul.
3. **Vérification incomplète faute d'accès** (403 sur `ajog.org`) : transitivité, incohérence, hétérogénéité et confiance CINeMA sont, par consigne, injugeables depuis un abstract. Ce sont précisément les points critiques d'une NMA.
4. **La NMA ne fournit aucun effet absolu ni NNT.** Le seul ancrage absolu disponible (NNT ≈ 25, GRADE modéré) vient de la **Cochrane**, source distincte répondant à une autre question.

### Condition de levée du report

Report **à durée indéterminée et à faible priorité** — car même avec le texte intégral en main, le §7 reste vrai : l'item n'atteindrait au mieux que `informatif` / `breve`. Le coût d'obtention du PDF n'est pas justifié par l'enjeu pour ce lectorat.

Si le texte intégral devenait disponible sans coût, vérifier dans l'ordre : (a) existence et localisation exacte de 3,53 et 2,79 ; (b) intervalles de prédiction de l'estimation principale ; (c) tableau CINeMA/GRADE-NMA ; (d) OR direct chlorhexidine vs povidone iodée ; (e) risque de base et NNT ; (f) répartition géographique par nœud du réseau.

### Point de gouvernance à ne pas escamoter

`meta.relecture_referent: false` sur un thème où le référent n'a pas de compétence de fond, sur un article dont **le chiffre-titre du relais est introuvable dans la source vérifiable** : publier serait doublement non couvert. **Non publiable en l'état** — et l'issue `reporte` est ici la bonne, pas un échec.
