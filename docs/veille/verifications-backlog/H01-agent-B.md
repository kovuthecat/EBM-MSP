# H01 — Agent B (Contradicteur / Red-team)

**Item de veille** : IPP chez le jeune enfant et risque d'infections graves.
**Source primaire vérifiée** : Lassalle M, Zureik M, Dray-Spira R. *Proton Pump Inhibitor Use and Risk of Serious Infections in Young Children.* **JAMA Pediatrics** 2023;177(10):1028-1038. DOI 10.1001/jamapediatrics.2023.2900.
**Accès** : texte intégral open access (CC-BY) via PMC10425862 — **pas de paywall, vérification complète possible**, y compris méthodes, tableaux et limites. Aucun contournement nécessaire.
**Date de la vérification** : 2026-08-09 · **Agent** : B (contexte isolé de l'Agent A)

> Avertissement de méthode : tout ce qui suit est confronté à l'article primaire (PMC), jamais à la
> presse spécialisée ni au communiqué EPI-PHARE. Quand un chiffre n'a pu être lu que dans le texte
> et non recoupé dans le tableau source, c'est signalé.

---

## 1. Vérification chiffre par chiffre

| Chiffre annoncé (presse spécialisée) | Valeur trouvée dans la source primaire | Localisation | Verdict |
|---|---|---|---|
| n = 1 262 424 | 1 262 424 | Abstract / Résultats | **Confirmé** |
| 606 645 exposés IPP | 606 645 | Abstract / Table 1 | **Confirmé** |
| 655 779 non exposés | 655 779 | Abstract / Table 1 | **Confirmé** |
| Enfants nés 2010-2018 | nés du 01/01/2010 au 31/12/2018 | Méthodes | **Confirmé** |
| Âge médian ~82-88 j | 88 j (IQR 44-282) chez les exposés ; 82 j (IQR 44-172) chez les non exposés | Table 1 | **Confirmé** — mais la presse fond deux valeurs distinctes en une fourchette ; ce ne sont pas des bornes d'IC |
| aHR infections graves 1,34 [1,32-1,36] | 1,34 [1,32-1,36] | Abstract / Table 2 | **Confirmé** |
| Digestif 1,52 | 1,52 [1,48-1,55] | Table 2/3 | **Confirmé** |
| ORL 1,47 | 1,47 [1,41-1,52] | Table 2/3 | **Confirmé** |
| Respiratoire basse 1,22 | 1,22 [1,19-1,25] | Table 2/3 | **Confirmé** |
| Rénal / urinaire 1,20 | 1,20 [1,15-1,25] | Table 2/3 | **Confirmé** |
| Neuro 1,31 | 1,31 [1,11-1,54] | Table 2/3 | **Confirmé** — IC bien plus large que les autres, effectifs faibles ; la presse cite l'estimation nue |
| Bactérien 1,56 | 1,56 [1,50-1,63] | Table 2/3 | **Confirmé** |
| Viral 1,30 | 1,30 [1,28-1,33] | Table 2/3 | **Confirmé** |
| *(non cité par la presse)* | **Cutané : 1,08 [0,97-1,21] — NON significatif** | Table 2/3 | **Omission** de la liste de presse |
| *(non cité par la presse)* | **Ostéo-articulaire : 1,17 [1,01-1,37] — limite** | Table 2/3 | **Omission** de la liste de presse |
| *(non cité par la presse)* | **Exposition passée (traitement arrêté) : 1,07 [1,06-1,09]** | Table 2 | **Omission majeure** — voir §3 |
| *(non cité)* | Suivi médian 3,8 ans (IQR 1,8-6,2) | Abstract | Confirmé |
| *(non cité)* | 152 055 infections graves au total ; 2,99 / 100 personnes-années | Résultats | Confirmé |
| *(non cité)* | Exposés : 25 191 évén. / 271 874 PA = 9,27 / 100 PA — Non exposés : 126 864 évén. / 4 810 746 PA = 2,64 / 100 PA | Table 2 | Confirmé |
| *(non cité)* | **HR brut 1,42** → aHR 1,34 | Table 2 | Confirmé |
| *(non cité)* | Contrôle négatif (traumatismes hors fractures) : aHR **0,96 [0,90-1,02]** | Analyses de sensibilité | Confirmé |
| *(non cité)* | **E-value 2,01** (1,97 pour la borne basse) | Analyses de sensibilité | Confirmé |
| *(non cité)* | Durée : ≤6 mois 1,34 [1,32-1,36] · 7-12 mois 1,33 [1,29-1,38] · >12 mois 1,38 [1,30-1,47] | Table | Confirmé |
| Conflits d'intérêt | « Conflict of Interest Disclosures: None reported » | Fin d'article | Confirmé |
| Financement | **Aucune déclaration de financement explicite retrouvée dans le texte PMC** | — | **Introuvable** (voir §2, objection mineure) |
| Enregistrement du protocole | **Aucune mention** (ni EnCePP, ni ClinicalTrials.gov) | — | **Introuvable** |

**Bilan chiffres : aucune divergence.** Les 8 aHR de la liste de presse sont exacts au centième et les IC concordent. Les seuls reproches sont des **omissions de la presse**, pas des erreurs, et elles vont toutes dans le même sens (elles retirent les résultats nuls, limites, et le résultat rassurant sur l'exposition passée). Le paramétrage « ~82-88 j » est une fusion abusive de deux médianes de groupe.

**Deux redressements factuels à porter au dossier**, car ils invalident deux hypothèses de travail de la commande :

1. **Le comparateur n'est PAS « non traité ».** La cohorte entière est constituée d'enfants recevant un **premier traitement anti-sécrétoire / anti-reflux** : IPP d'un côté, **anti-H2 ou antiacides/alginate** de l'autre. C'est un **comparateur actif**. La date index est la date de première délivrance de l'un de ces médicaments, dans les deux groupes.
2. **Le critère n'est PAS une délivrance d'antibiotique en ville.** C'est la **première hospitalisation** pour infection, codée en **diagnostic principal (CIM-10)**. Le mot « serious » du titre est donc **opérationnellement adossé à l'hospitalisation**.

---

## 2. Objections méthodologiques, par gravité

### GRAVE — 1. Le « channeling » par sévérité à l'intérieur d'une population toute traitée

C'est l'objection qui reste debout après tout le reste. Le comparateur actif règle la question « traité vs non traité », mais **pas** la question « pourquoi celui-ci a-t-il reçu un IPP plutôt qu'un alginate ? ». L'IPP est, en pratique française, l'escalade : on y vient quand l'alginate a échoué, quand les symptômes sont bruyants, quand l'enfant est plus fragile.

Ce qui la fonde dans la source :
- Les auteurs l'écrivent eux-mêmes : « The SNDS does not provide information on indication for treatment. Therefore, we could not distinguish children experiencing GERD from those inappropriately treated for uncomplicated gastroesophageal reflux. »
- Ils reconnaissent que les enfants avec pathologie chronique, **notamment l'atteinte neurologique**, sont « especially likely to require long-term maintenance treatment with PPIs » — or ce sont exactement les enfants les plus exposés aux pneumopathies d'inhalation et aux hospitalisations.
- **Les variables d'ajustement disponibles ne couvrent pas les déterminants du choix.** Sont ajustés : sociodémographie (âge, sexe, couverture, indice de défavorisation, urbanisation), grossesse/accouchement (âge maternel, AMP, mode d'accouchement, **âge gestationnel, poids de naissance**), comorbidités maternelles, comorbidités de l'enfant en temps-dépendant (respiratoire chronique, **neurologique ou dégénérative**, diabète, obésité, hépatique, rénale chronique, malformations urinaires majeures, cardiovasculaire, auto-immune/immunodépression, digestive), corticoïdes et AINS, et recours aux soins.
- **Ne sont PAS captés** : l'**allergie aux protéines de lait de vache** en tant que telle, les **troubles de l'oralité / difficultés alimentaires**, la **cassure pondérale**, la sévérité clinique du RGO, l'**allaitement** (limite reconnue), le **tabagisme parental**, et surtout le **mode de garde**. Les auteurs écrivent que l'information sur « breastfeeding or social interactions » n'était pas disponible. **La crèche est le facteur de risque infectieux majeur du nourrisson et il est purement et simplement absent du modèle.**

Contrepoids honnête : pour que la crèche explique le résultat, il faudrait qu'elle soit associée **au choix de l'IPP plutôt que de l'alginate**, ce qui n'a rien d'évident. La crèche est un confondant massif pour l'infection mais probablement faible pour l'exposition, ce qui limite son pouvoir de biais. La **gravité du reflux**, elle, coche les deux cases : c'est le candidat sérieux.

**L'E-value de 2,01 est le bon endroit où porter le fer.** Elle signifie qu'un confondant non mesuré devrait être associé à la fois à l'IPP et à l'hospitalisation infectieuse avec un RR ≥ 2,01 chacun, **au-delà de tous les ajustements**. Pour la crèche : plausible côté infection, invraisemblable côté prescription. Pour la sévérité de la maladie sous-jacente / le handicap neurologique résiduel mal codé dans le SNDS avant 6 mois : **2,01 est atteignable**. Un nourrisson en cours de bilan, pas encore codé ALD, qui vomit, ne grossit pas et sera plus tard étiqueté encéphalopathe, reçoit un IPP et sera hospitalisé. L'ajustement en temps-dépendant sur « maladie neurologique » ne le rattrape qu'après le diagnostic.

**Verdict sur cette objection : elle n'est pas résolue, mais elle est sérieusement bornée.** Les auteurs ne l'esquivent pas ; ils l'attaquent par trois moyens (comparateur actif, contrôle négatif, E-value) et ils suggèrent eux-mêmes la parade au conditionnel. Elle empêche de conclure à la causalité, elle n'annule pas le signal.

### GRAVE — 2. Aucun effet absolu, aucun NNH, nulle part

Vérifié : **le papier ne rapporte ni différence de risque absolu, ni excès de risque, ni NNH, ni fraction attribuable**. Il communique en aHR, plus des taux d'incidence bruts non comparables entre eux (voir plus bas). L'abstract, les Key Points et le communiqué EPI-PHARE ne donnent que du relatif. **C'est un manquement de communication et il est à charge**, au regard de la grille §5 du projet, qui impose de privilégier l'effet absolu.

Mais — et c'est le point où le red-team doit se retourner contre son propre réflexe — **quand on calcule l'absolu, il n'est pas rassurant, il est plus inquiétant que l'aHR ne le laisse croire.**

Reconstruction à partir de la Table 2 :
- Taux observé chez les exposés : 25 191 / 271 874 PA = **9,27 / 100 PA**
- Taux contrefactuel, en appliquant l'aHR : 9,27 / 1,34 = **6,92 / 100 PA**
- **Excès ≈ 2,35 hospitalisations pour infection / 100 années-enfant d'exposition**
- Durée moyenne d'exposition : 271 874 PA / 606 645 enfants ≈ **0,45 an ≈ 164 jours**
- Excès par enfant traité ≈ 2,35 × 0,45 = **1,05 / 100 enfants**

> **NNH ≈ 95 enfants traités par IPP (durée moyenne ~5 mois) pour une hospitalisation
> pour infection supplémentaire** — soit environ **90 à 100** en propageant l'IC [1,32-1,36].

Réserves à énoncer avec le chiffre : le HR n'est pas exactement un rapport de taux ; la durée moyenne par enfant est une moyenne grossière (certains enfants cumulent plusieurs périodes) ; le calcul suppose que l'aHR n'est pas lui-même le produit d'une confusion résiduelle. C'est un **ordre de grandeur**, pas une valeur d'article.

Un NNH autour de 100 sur un traitement très majoritairement prescrit **hors indication** à des nourrissons qui régurgitent est cliniquement significatif. Le raisonnement « aHR 1,34, donc NNH énorme, donc négligeable » — que la commande me demandait de tester — **ne tient pas ici**, parce que l'incidence de base des hospitalisations infectieuses du nourrisson est élevée. Je le note comme tel.

### MODÉRÉE — 3. La comparaison brute des taux d'incidence est trompeuse et le papier la laisse traîner

9,27 vs 2,64 / 100 PA, soit un rapport brut de 3,5, alors que le HR brut est 1,42 et l'aHR 1,34. L'écart s'explique : **l'échelle de temps du modèle de Cox est l'âge en jours**, et le temps-personne exposé est massivement concentré dans la première année de vie, où bronchiolites et gastro-entérites hospitalisées culminent. Le modèle corrige donc correctement. Mais **les deux taux bruts affichés côte à côte dans un tableau se prêtent à une lecture « ×3,5 » qui est fausse**, et rien dans le texte n'en avertit explicitement le lecteur pressé. Risque de mésusage en veille : élevé. À neutraliser dans toute reprise.

### MODÉRÉE — 4. Mesure de l'exposition et multiplicité

- **Durée d'exposition** : « 1 comprimé = 1 jour d'exposition ». Chez le nourrisson, l'IPP est en suspension buvable ou en comprimé orodispersible fractionné, l'observance est notoirement médiocre et les délivrances mal corrélées à la prise réelle. **Erreur de classement de l'exposition non différentielle**, qui tend à diluer l'effet vers 1 — donc plutôt une sous-estimation qu'un artefact, mais elle rend l'analyse par durée (1,34 / 1,33 / 1,38) peu interprétable.
- **Absence de gradient dose-durée** : 1,34 → 1,33 → 1,38 est **plat**. Pour un mécanisme d'hypochlorhydrie cumulative, on attendrait une pente. L'absence de relation durée-effet **affaiblit l'argument causal** (critère de Bradford Hill « gradient biologique »). C'est un vrai point à charge, que ni le papier ni la presse ne relèvent.
- **Multiplicité** : ~7 sites × 2 types de germes × plusieurs strates de durée, **sans aucune correction**. Sur l'estimation principale (IC 1,32-1,36, des centaines de milliers d'événements) c'est sans conséquence. Sur **ostéo-articulaire 1,17 [1,01-1,37]** et **neurologique 1,31 [1,11-1,54]**, c'est décisif : ces deux résultats ne survivraient probablement pas à une correction et ne doivent pas être cités isolément.
- **Aucun protocole pré-enregistré retrouvé.** Pour une pharmaco-épidémiologie de registre menée par l'agence elle-même, l'absence de dépôt EnCePP est une faiblesse de procédure, pas une preuve de sélection.

### MINEURE — 5. Financement et position institutionnelle

« Conflict of Interest Disclosures: None reported », aucun financement industriel, et **je n'ai pas retrouvé de déclaration de financement explicite** dans la version PMC. EPI-PHARE est le groupement d'intérêt scientifique **ANSM + CNAM** : les auteurs sont les épidémiologistes du régulateur, travaillant sur la base de l'assurance maladie. Pas de conflit commercial — c'est le meilleur cas de figure. À signaler seulement que la structure a une **mission de détection de signal**, ce qui n'incite pas à minorer un signal trouvé. À pondérer très légèrement, sans en faire un procès : l'absence de tout intérêt industriel est ici un point fort net.

---

## 3. Spin détecté

**Le spin attendu n'est pas là. Il faut le dire clairement.**

Les trois hypothèses de spin les plus lourdes que j'avais mission de tester s'effondrent à la lecture de la source :

1. **« Serious » serait du spin** → **NON.** Le critère est l'hospitalisation avec l'infection en **diagnostic principal**. Le mot est adossé à une définition opérationnelle dure. C'est même l'un des choix les plus solides de l'étude.
2. **Le comparateur serait « non traité »** → **NON.** Comparateur actif anti-H2 / antiacides, et **analyse de sensibilité excluant les anti-H2** qui ne bouge pas (aHR 1,34 [1,31-1,36]).
3. **Langage causal sur de l'observationnel** → **quasi absent.** L'abstract et la conclusion disent « was associated with ». La seule formulation orientée est dans l'*Importance* : « PPI use **may lead to** infections through alteration of the microbiota or direct action on the immune system » — au conditionnel, et c'est une phrase de rationnel mécanistique, pas une conclusion. La conclusion elle-même — « In this population, PPIs should not be used without a clear indication » — est **une recommandation de prudence sur un médicament très largement prescrit hors AMM, pas une affirmation de causalité**. Elle est défendable même si l'association était partiellement confondue.

**Le spin qui existe réellement, et où il se situe :**

- **Spin par omission, dans la chaîne de relais (presse spécialisée, et la liste de chiffres qui circule)**, pas dans l'article. La liste transmise retient 8 aHR tous significatifs et positifs, et laisse tomber : le résultat **nul** (cutané 1,08 [0,97-1,21]), le résultat **limite** (ostéo-articulaire), et surtout l'**exposition passée à 1,07 [1,06-1,09]**. C'est ce dernier point qui est le plus dommageable à omettre — dans les deux sens.
- **Spin par silence sur l'absolu**, imputable cette fois aux auteurs et au communiqué EPI-PHARE (objection §2.2).
- **Le titre du papier** — « Risk of Serious Infections » — est neutre et exact.

**Le résultat de l'exposition passée mérite un développement**, parce qu'il coupe dans les deux sens et qu'aucun relais ne le mentionne. aHR **1,07 [1,06-1,09]** chez les enfants ayant arrêté l'IPP :
- *Argument pour l'étude* : si la confusion par indication expliquait le 1,34, les anciens exposés — qui partagent le même profil de sévérité sous-jacente — devraient rester à un niveau comparable. Ils retombent à 1,07. **La réversibilité à l'arrêt est l'argument causal le plus fort du papier**, et c'est celui qui n'est jamais cité.
- *Argument contre* : ce 1,07 est **statistiquement significatif** (IC 1,06-1,09, très étroit). Une élévation résiduelle chez des enfants qui ne prennent plus rien est **la signature d'une confusion résiduelle**. Elle est petite, mais elle est là. Elle chiffre en quelque sorte le plancher du biais : de l'ordre de 7 %, très en deçà de 34 %.

---

## 4. Cohérence avec la totalité des preuves

**Cohérent en pédiatrie, contredit chez l'adulte quand on randomise.**

*Ce qui converge (pédiatrie, observationnel) :*
- **Canani 2006** (*Pediatrics*, prospectif, 91 traités vs 95 témoins, 4 mois) : gastro-entérite aiguë OR ≈ 3,6 ; pneumonie communautaire OR ≈ 6,4. Même sens, effets bien plus grands — cohérent avec une petite étude sujette au biais, mais concordante.
- **Terrin 2012** (*Pediatrics*, prématurés/TPPN, ranitidine) : infections 37,4 % vs 9,8 %, OR 5,5 [2,9-10,4] ; ECUN ×6,6 ; mortalité 9,9 % vs 1,6 %. Autre classe (anti-H2), autre population, même signal. Ce corpus néonatal est celui qui a fait bouger les pratiques.
- **Plausibilité biologique** solide et citée : l'acidité gastrique est une barrière anti-infectieuse, l'élévation du pH modifie le microbiote gastrique, et une action directe sur les fonctions du polynucléaire neutrophile est évoquée.
- **Gradient de site cohérent avec le mécanisme** : le signal est maximal sur le **digestif (1,52)** et l'**ORL (1,47)**, plus faible sur le respiratoire bas (1,22) et l'urinaire (1,20), **nul sur la peau (1,08 NS)**. C'est exactement la topographie qu'un mécanisme d'hypochlorhydrie prédit, et un biais de confusion générique — « ces enfants sont plus fragiles » — ne produirait pas ce profil : il élèverait tout, peau comprise. **C'est le second meilleur argument causal du papier, et lui non plus n'est jamais cité.**

*Ce qui diverge, et qu'il faut porter au dossier :*
- **Méta-analyse d'ECR 2025 sur le *C. difficile*** (8 ECR, 29 880 participants) : **RR 1,19 [0,75-1,89], non significatif**. Les auteurs opposent frontalement ce résultat aux méta-analyses observationnelles antérieures (« jusqu'à ×2 ») et attribuent l'écart à la **confusion par indication et au biais protopathique**. Population **adulte** — pas de transposition directe au nourrisson, et *C. difficile* n'est qu'un germe parmi d'autres. Mais c'est le meilleur avertissement disponible : **sur le seul terrain où l'on a randomisé, le signal IPP-infection s'évapore.** Toute reprise de H01 doit le mentionner.
- **Revue systématique pédiatrique 2024** (*Glob Pediatr Health*, 30 études) : conclut à un signal infectieux (84,6 % des effets indésirables recensés seraient des infections secondaires) mais reconnaît la « paucity of research ». **Ce n'est pas une confirmation indépendante** : les effectifs sont dominés par les grandes bases médico-administratives, et la revue est de qualité méthodologique faible. À ne pas compter comme réplication.
- **Aucune réfutation, aucun *letter to the editor* critique, aucune correction ou erratum** retrouvés pour Lassalle 2023 à la date du 2026-08-09. L'étude n'a pas été attaquée dans la littérature. Une lecture critique pédiatrique espagnole (*Evidencias en Pediatría*, « time heals all ») retient le résultat et insiste précisément sur la **réversibilité à l'arrêt** et sur la limitation aux indications claires — soit la lecture que je retiens aussi.

**Synthèse de cohérence** : le signal est **reproduit dans le sens et la topographie** en pédiatrie observationnelle, **non reproduit en randomisé chez l'adulte sur un critère étroit**. Aucun ECR pédiatrique n'existe et n'existera vraisemblablement pas — on ne randomisera pas des nourrissons sur un IPP hors indication. **La cohorte de registre est, ici, le meilleur niveau de preuve atteignable, et c'est une contrainte du domaine, pas un défaut de l'étude.**

---

## 5. Ce qui tient malgré tout

Section obligatoire, et elle est longue, parce que j'ai échoué à ébranler l'essentiel.

1. **Le comparateur actif.** C'est la décision de conception qui neutralise la moitié de l'objection standard. Comparer des enfants sous IPP à des enfants sous alginate/anti-H2 pour la même famille d'indications, avec la même date index, est nettement plus honnête que « exposés vs population générale ». L'exclusion des anti-H2 en sensibilité ne change rien.
2. **Le critère est dur et il est bien nommé.** Hospitalisation, diagnostic principal CIM-10. Ce n'est ni une délivrance d'antibiotique, ni un code de consultation. **Cela désamorce simultanément le biais de détection** : on peut sur-diagnostiquer une otite en ville parce qu'on consulte plus, on n'hospitalise pas un enfant en diagnostic principal d'infection parce que ses parents sont inquiets.
3. **Le contrôle négatif est bien choisi et il est négatif.** Traumatismes hors fractures : aHR **0,96 [0,90-1,02]**. Si un excès de recours aux soins, une propension parentale à consulter ou une fragilité générale non mesurée portaient le résultat, ce contrôle serait positif. Il ne l'est pas. **C'est l'objection « biais de surveillance » qui tombe ici, et je n'ai pas trouvé comment la relever.**
4. **La réversibilité à l'arrêt** (passé 1,07 vs en cours 1,34), déjà discutée. Difficile à expliquer par la confusion par indication.
5. **La topographie des sites** (digestif > ORL > respiratoire bas > urinaire > peau nulle), cohérente avec le mécanisme et incompatible avec une fragilité générique.
6. **L'écart brut → ajusté est minime** (1,42 → 1,34). L'ajustement sur une trentaine de covariables ne déplace l'estimation que de 6 %. Cela ne prouve pas l'absence de confondant non mesuré, mais cela rend moins vraisemblable qu'un seul confondant caché fasse à lui seul le travail que trente variables mesurées n'ont pas fait.
7. **L'échelle de temps est l'âge en jours** — le choix correct, et non trivial, chez le nourrisson où le risque infectieux varie d'un facteur important en quelques mois.
8. **Le décalage de 30 jours** contre le biais protopathique, et sa vérification : pas de sur-risque d'infection respiratoire basse préexistante à l'inclusion (aHR 0,91 [0,87-0,94]). Analyse de sensibilité supplémentaire excluant les enfants sous antibiotiques dans les 3 mois précédents : résultats inchangés.
9. **La précision.** 152 055 événements, 5 millions d'années-personnes, exhaustivité nationale du SNDS, pas de perdus de vue. Les IC sont étroits parce que la puissance est réelle, pas parce que le modèle est optimiste.
10. **Aucun conflit d'intérêt commercial, aucun financement industriel, données publiques.**
11. **Les auteurs énoncent leurs limites sans les enterrer** — absence d'indication, absence d'allaitement et de « social interactions », IPP hospitaliers et OTC non captés — et proposent eux-mêmes la parade au conditionnel (restreindre aux enfants traités).
12. **Et l'effet absolu, une fois calculé, est cliniquement significatif** (NNH ≈ 95 sur ~5 mois de traitement). L'attaque « grand relatif sur petit risque de base » ne fonctionne pas ici.

**En résumé de red-team : je suis allé chercher un papier faible et j'ai trouvé une cohorte de registre méthodologiquement soignée, dont la principale faiblesse est ce qu'elle ne peut pas faire (l'indication n'est pas dans le SNDS) et non ce qu'elle a mal fait, et dont le principal défaut de communication est de n'avoir jamais donné l'effet absolu — lequel, calculé, renforce le message au lieu de l'affaiblir.**

---

## 6. Verdict

### Niveau de preuve proposé (GRADE simplifié, grille §8)

> **MODÉRÉ** — borne haute de ce qu'une cohorte peut atteindre, et je ne descends pas à « faible ».

Justification, poste par poste :
- **Départ : faible** (observationnel, grille §3 : « niveau de preuve d'emblée plus faible »).
- **Remontée (+1)** pour l'accumulation : comparateur actif + critère dur (hospitalisation) + contrôle négatif négatif + E-value publiée + réversibilité à l'arrêt + gradient topographique cohérent avec le mécanisme + précision extrême + écart brut/ajusté minime. Un seul de ces éléments ne suffirait pas ; l'ensemble, oui.
- **Pas de remontée supplémentaire** : la confusion par indication résiduelle n'est pas résolue (E-value 2,01 franchissable par la sévérité du reflux / le handicap neurologique pré-diagnostique), **il n'y a pas de relation durée-effet**, et le seul corpus randomisé disponible — chez l'adulte, sur *C. difficile* — ne retrouve pas le signal.
- **Pas de descente à « faible »** : ce serait injuste au regard du contrôle négatif et de la réversibilité, et ce serait aussi ignorer qu'aucun ECR pédiatrique n'est réalisable. Sanctionner l'étude pour n'être pas un essai revient à exiger une preuve qui n'existera jamais sur ce sujet.

### Publiable en route `analyse` ?

> **OUI — route `analyse`, sans réserve de fond, avec quatre conditions de rédaction opposables.**

L'item mérite la route longue, et pas une brève : la valeur pour la MSP n'est pas dans le chiffre 1,34, elle est dans le raisonnement qui permet de le manier sans le sur-vendre ni le jeter. C'est exactement ce qu'une brève ne peut pas porter. De plus, le sujet est **actionnable en soins premiers** : la prescription d'IPP chez le nourrisson qui régurgite est massive et très majoritairement hors indication, et c'est une déprescription à la portée directe du MG, de la sage-femme et de la puéricultrice.

**Conditions de rédaction (non négociables) :**

1. **Donner l'effet absolu** : NNH ≈ **95 [90-100]** enfants traités ~5 mois pour une hospitalisation infectieuse supplémentaire, **explicitement présenté comme un recalcul de la veille, absent de l'article**, avec ses réserves (HR ≠ rapport de taux, durée moyenne approximée, valable sous hypothèse d'absence de confusion résiduelle).
2. **Ne jamais reproduire les taux bruts 9,27 vs 2,64 sans avertissement** : l'échelle de temps est l'âge, ces taux ne sont pas comparables, le rapport « ×3,5 » est faux. Si on les cite, on cite le HR brut 1,42 dans la même phrase.
3. **Restituer les trois résultats omis par la presse** : cutané non significatif (1,08 [0,97-1,21]), ostéo-articulaire limite (1,17 [1,01-1,37], à ne pas citer isolément faute de correction de multiplicité), et **exposition passée 1,07 [1,06-1,09]** — ce dernier en position visible, c'est le résultat le plus utile en consultation (« ça régresse à l'arrêt »).
4. **Mentionner la discordance randomisée** : méta-analyse d'ECR 2025, *C. difficile*, adultes, RR 1,19 [0,75-1,89] NS. C'est la principale raison de ne pas écrire « les IPP causent des infections chez le nourrisson ».

### Impact sur les algorithmes

**Aucun nœud DT2 concerné.** Si un domaine pédiatrique ou « déprescription » est ouvert un jour, cet item est un candidat de premier rang pour un nœud « RGO du nourrisson / indication d'un anti-sécrétoire ». À signaler au comité comme **réserve de contenu**, pas comme modification.

### Formulation du message pour la pratique que je défendrais

Association robuste, pas causalité démontrée. Chez le nourrisson traité pour reflux, l'IPP s'accompagne d'environ **un tiers d'hospitalisations pour infection en plus** pendant le traitement, soit à peu près **une hospitalisation supplémentaire pour 100 enfants traités quelques mois** — et **le sur-risque disparaît largement à l'arrêt**. Ce que ça change : rien pour un RGO compliqué documenté ; pour la régurgitation simple du nourrisson bien portant, qui est l'immense majorité des prescriptions, **c'est un argument de plus pour ne pas commencer, et un argument pour arrêter**.

---

*Rapport Agent B — rédigé en contexte isolé, sans connaissance de l'analyse de l'Agent A. Toutes les vérifications portent sur le texte intégral open access (PMC10425862) ; aucune sur un relais secondaire. Points non résolus faute de source : déclaration de financement explicite, existence d'un protocole pré-enregistré.*
