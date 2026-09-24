# ORTHO01 — Agent C (Réconciliateur, §7bis)

**Contexte isolé** : je n'ai vu ni les échanges internes ni le travail intermédiaire des Agents A et B,
seulement leurs deux rapports finaux (`epreuve/entrees/ORTHO01-agent-A.md`,
`epreuve/entrees/ORTHO01-agent-B.md`). Aucune requête OpenEvidence utilisée. Je n'ai pas re-téléchargé
la source primaire : le « retour à la source » s'appuie ici sur la **convergence entre deux lectures
intégrales indépendantes du même PDF** (A et B rapportent, chiffre par chiffre, les mêmes valeurs sur
la quasi-totalité du dossier), ce qui vaut vérification sur pièces pour tout ce qui est chiffré. Les
points qui dépendent d'un accès non fourni ici (onglet « Info » de l'éditeur, matériel supplémentaire
Figshare) restent déclarés non vérifiables, pas tranchés par supposition.

Article : Kohmäscher A et al., *Effectiveness of Stuttering Modification Treatment in School-Age
Children Who Stutter: A Randomized Clinical Trial*, JSLHR 2023;66(11):4191-4205,
DOI 10.1044/2023_JSLHR-23-00224, PMID 37801699. Thème `orthophonie` → circuit §7bis (SOP v1.3 §7bis).

---

## 1. Tableau de classement final

| Champ | Valeur |
|---|---|
| `route` | **`breve`** (reclassée depuis la route `analyse` engagée pour ce circuit — cf. §3) |
| `niveau_impact` | **`informatif`** (mécanique de la route brève : aucune appréciation critique propre publiée — SOP §5bis) |
| `niveau_preuve` (usage interne, non affiché sur une brève) | **`faible`** pour la seule comparaison réellement contrôlée (3 mois) ; **`très faible`** pour toute affirmation issue de l'analyse combinée à 6-12 mois (design non contrôlé à ce stade) — cf. §4 pour la correction du calcul |
| `themes[]` | **`orthophonie`** uniquement (retrait de `pediatrie` proposé par l'Agent A — cf. §5) |
| `professions_concernees[]` | **`orthophoniste`** (le MG n'est mentionné qu'en position d'adresseur, sans changement de pratique — cf. §5) |
| `concerne_decision` | **non** — aucun nœud du module Décision n'existe pour l'orthophonie (DT2 = premier domaine construit) ; `noeuds_impactes` : aucun |
| `meta.relecture_referent` | **`false`** — bandeau visible obligatoire (SOP §7bis point 4) |
| Pertinence pratique | faible pour le MG (adressage déjà pratiqué, non modifié) ; incertaine pour l'orthophoniste (hors compétence de vérification de ce circuit) |

**Décision de classement** : l'item **ne se publie pas en `analyse`**. Il est reclassé en `breve`,
conformément à SOP §5 étape 5 (« Désaccord non résolu à la réconciliation → l'item ne se publie pas en
analyse : il est reporté (§6bis) ou reclassé en brève »). Ce n'est cependant **pas un `reporte`** : voir
§3 pour la justification de ce choix plutôt qu'un report.

---

## 2. Ce qui n'était pas un désaccord — vérification chiffre par chiffre

A et B ont lu le même PDF intégral indépendamment. Sur la quasi-totalité des chiffres (effectifs,
Table 1, Table 2 à 3 mois, Tables 3-4 à 6/12 mois, calcul de puissance, Krippendorff α, correction de
Holm sur les 5 comparaisons OASES-S), les deux rapports **concordent exactement**, y compris sur le
recalcul indépendant de la correction de Holm (B) que les chiffres publiés de la Table 2 confirment.
Cette concordance vaut vérification sur pièces : aucun de ces points n'est rouvert.

---

## 3. Désaccords réels, tranchés sur pièces

### 3.1 `niveau_preuve` : « modéré » (A) vs « faible » (B)

**Tranché en faveur de B, avec correction.** A liste elle-même, dans son §3 (risque de biais), les
mêmes éléments dégradants que B : essai ouvert, critère principal auto-rapporté par l'enfant non
aveuglable, ITT non pleinement réalisée (Fig. 2 : exclus notés à tort n=0), comparateur passif. Ce
catalogue, une fois appliqué à une grille GRADE simplifiée (Élevé → Modéré → Faible → Très faible),
justifie **au moins deux déclassements** (risque de biais sérieux + imprécision — échantillon unique,
effet à la moitié de celui postulé, significativité dépendante de la latéralité du test, IC absents) :
Élevé −1 −1 = **Faible**. A s'arrête à un seul déclassement implicite (« modéré, avec réserve forte »)
sans appliquer sa propre grille jusqu'au bout — c'est une incohérence interne de son propre rapport, pas
une divergence de lecture des faits.

**Correction apportée au raisonnement de B** : B additionne **trois** déclassements (−1 biais, −1
imprécision, −1 caractère indirect) à partir d'Élevé, ce qui mène arithmétiquement à **Très faible**
(Élevé−1−1−1), pas à « Faible » comme B le conclut — erreur de comptage, pas de fond. Je résous
l'incohérence en distinguant les deux corps de preuve de l'article, que B mélange dans une seule note :

- **Comparaison contrôlée à 3 mois** (seule portion réellement randomisée) : Élevé −1 (risque de biais :
  ouverture + auto-rapport non aveuglable + ITT modifiée + attrition asymétrique informative) −1
  (imprécision : essai unique, effet moitié du postulé, dépendance à la latéralité) = **Faible**. Le
  troisième déclassement de B (« caractère indirect ») porte en réalité sur la **composition** du
  résultat positif (sous-échelle « connaissances » plutôt que vécu) — c'est la même racine que le
  déclassement pour risque de biais, pas un domaine GRADE distinct ; je ne le compte pas une deuxième
  fois, mais je le retiens comme condition de rédaction (§5).
- **Analyse combinée à 6-12 mois** : ce n'est plus un essai contrôlé une fois le bras différé traité —
  design avant/après sur cohorte unique. Point de départ observationnel (Faible, pas Élevé), puis −1
  pour absence totale de comparateur / confusion non contrôlée (évolution spontanée, régression à la
  moyenne, LOCF favorable à l'hypothèse de maintien — cf. G3/G4 de B, confirmés par la Fig. 2 : 4 enfants
  du bras différé n'ont plus eu besoin de traitement après l'attente, preuve interne d'amélioration
  spontanée, et sont exclus de l'analyse poolée) = **Très faible**.

Cette bifurcation n'est pas affichée sur une brève (qui ne porte pas de niveau de preuve), mais elle
reste la référence interne si l'item est un jour réexaminé.

### 3.2 Conflit d'intérêt intellectuel non déclaré (relevé par B, absent du rapport A)

**Confirmé, retenu.** A signale seulement l'absence de section « Funding/Disclosure » dans le PDF lu.
B va plus loin et établit, **à partir de la bibliographie de l'article lui-même** (pas d'une source
tierce) : la première auteure (Kohmäscher) est co-autrice du manuel KIDS évalué dans l'essai (Schneider
& Kohmäscher 2022, réf. p. 35), traductrice et validatrice de l'OASES-S qui sert de critère principal
(Euler, Kohmäscher et al. 2016 ; Kohmäscher 2017), et autrice de l'enquête (Kohmäscher 2019) qui établit
la prédominance de KIDS en Allemagne — enquête citée pour justifier le choix de ne **pas** faire un essai
de supériorité contre un comparateur actif. C'est un fait bibliographique vérifiable sur pièces, pas une
appréciation d'opinion : je le retiens comme confirmé et je l'ajoute à la charge qui motive le
déclassement en brève (§3.3) et aux conditions de rédaction (§5).

Point non tranchable ici, laissé ouvert : une section Financement/COI pourrait exister dans l'onglet
« Info » de la page éditeur ASHAWire, non capturée par le PDF que A et B ont tous deux lu. Les deux
lectures convergent sur son absence du texte fourni ; ni A ni B n'avait accès à cet onglet. Ce n'est pas
un désaccord entre A et B (ils constatent la même chose), donc pas matière à `reporte` — c'est un point
que je signale comme non vérifié plutôt que de trancher par supposition, conformément à l'invariant 6
(« en cas de doute clinique, signaler plutôt qu'inventer »).

### 3.3 Route : `analyse` (position implicite de A) vs `breve` argumentée (B)

**Tranché en faveur de B.** A ne prend pas position explicite sur la route (ce n'est pas son rôle dans
la grille), mais conclut à un niveau d'impact informatif et déconseille de « faire remonter en
pratique ». B construit un dossier chiffré pour `breve`, sur trois motifs cumulatifs : (1) le message
positif de l'article ne survit pas à sa propre décomposition (seul un sous-score de connaissances porte
l'effet ; tout ce qui est mesuré en aveugle est nul au seul moment contrôlé) ; (2) `relecture_referent:
false` sur un dossier dont les questions les plus discriminantes sont spécifiquement du ressort de
l'orthophonie ; (3) impact pratique nul pour la MSP (aucune profession de la structure ne délivre KIDS).

J'ajoute un test que ni A ni B n'appliquent explicitement mais qui trancherait seul la route même sans
tout le reste : le seuil « potentiellement à impact pratique » de SOP §6bis, condition C1 — « puis-je
nommer le geste qui changerait en consultation ? ». Pour le MG (seule profession présente en routine à
la MSP côté prescription/orientation), le geste ne change pas : l'adressage d'un enfant qui bégaie à un
orthophoniste ne dépend pas du résultat de cet essai, que celui-ci soit positif ou négatif. C1 échoue
pour le MG, ce qui suffit à écarter la route `analyse` par la grille même qui l'aurait admise au
screening — la publication en `analyse` n'aurait de sens que si un orthophoniste était présent pour
juger du geste qui change *pour lui*, ce qui est précisément la relecture absente ici.

**Ce n'est pas un `reporte`.** Le désaccord n'est pas entre A et B sur un fait vérifiable en suspens :
les deux agents déclarent **identiquement** ne pas avoir la compétence de fond pour juger si la méthode
KIDS est représentative de la pratique française, ou si une baisse de 1,16 point de pourcentage de
syllabes bégayées est cliniquement significative. Le skill `verif-source-veille` est explicite sur ce
cas : « une zone de compétence hors de portée des trois agents, déclarée identiquement par A et B, n'est
pas un désaccord : elle se traite par retrait du contenu concerné, pas par report indéfini ». C'est donc
un retrait de contenu (les affirmations hors compétence, cf. §5), pas un report — aucun agent
orthophoniste ne viendra compléter cet item, et le reporter ne changerait rien à la donne.

---

## 4. Points secondaires vérifiés sans conséquence sur le classement

- **Recalcul bilatéral de B (p ≈ .052 sur OASES-S total après Holm)** : arithmétiquement plausible — en
  reprenant les p unilatéraux non corrigés de la Table 2 (.001/.004/.009), doubler puis réappliquer Holm
  sur les 5 comparaisons donne des p corrigés d'ordre de grandeur .010/.032/.05x, cohérent avec le calcul
  de B (l'écart de deux centièmes vient de l'arrondi des p publiés à 3 décimales, pas d'une erreur de
  méthode). **Mais ce chiffre n'existe pas dans l'article** : c'est une dérivation de vérification, pas
  un résultat de la source. Elle reste dans ce document à titre de note méthodologique interne ; elle ne
  doit **jamais** être présentée comme un résultat de l'étude dans une entrée publiée — question sans
  objet ici puisqu'une brève ne porte de toute façon aucune appréciation statistique propre.
- **Déséquilibre initial sur la sous-échelle Quality of Life (Table 1)** : le p exact n'est rapporté nulle
  part dans le texte fourni ; A et B constatent la même absence. Point non vérifiable en l'état, non
  bloquant pour le classement (il aggrave un doute déjà suffisant pour la brève, il ne le crée pas).
- **Datation du premier confinement allemand « mars 2021 » (p. 12 de la source)** : erreur factuelle
  probable de l'article (le premier confinement allemand documenté est de mars 2020), relevée par B
  seul. Vérifiable sans compétence orthophonique (fait historique public). Sans conséquence sur le
  classement ; à mentionner si l'item est un jour repris, pas dans la brève elle-même.
- **Matériel supplémentaire Figshare (S1-S5)** non consulté par A ni B : reste non vérifié. N'affecte pas
  la décision de route, qui repose sur le corps de l'article déjà entièrement lu deux fois.

---

## 5. Test « faut-il être du métier pour l'affirmer ? » et conditions de rédaction opposables

Appliqué à chaque point porteur du dossier A/B. Ce qui exige une compétence orthophonique de fond est
retiré du contenu publiable ; ce qui relève de méthodologie d'essai clinique générale (design, aveugle,
ITT, multiplicité, cohérence texte/résultats) est générique et reste vérifiable par n'importe quel
lecteur EBM, donc publiable.

| Affirmation | Exige le métier ? | Décision |
|---|---|---|
| Essai ouvert + critère principal auto-rapporté = biais de détection non maîtrisable | Non — méthodologie d'essai générale | **Publiable** |
| Aucune mesure aveuglée/objective ne bouge au seul point contrôlé | Non — lecture directe de la Table 2 | **Publiable** |
| 6-12 mois = série avant/après sans comparateur, pas un niveau de preuve ECR | Non — design d'essai générique | **Publiable** |
| ITT annoncée mais non réalisée ; LOCF favorable à la thèse du maintien | Non — méthodologie générale | **Publiable** |
| Contradiction interne texte (« indicating... transferred » p. 25 vs « too incomplete for statistical analyses » p. 27-28) | Non — lecture littérale du texte | **Publiable** |
| Sous-échelle qui porte l'effet = « General Information », décrite par les auteurs eux-mêmes comme correspondant à la phase de psychoéducation | Non — citation directe de l'auto-interprétation des auteurs (p. 24) | **Publiable en fait** (« quelle sous-échelle porte l'effet »), **pas publiable en verdict clinique** (« donc ce n'est pas un bénéfice réel ») — cf. ligne suivante |
| Portée clinique réelle d'un effet porté par la sous-échelle « connaissances » plutôt que « vécu/communication » | **Oui, en partie** — juger si un gain de connaissances sur le bégaiement a une valeur clinique propre en orthophonie dépasse ce que ce circuit peut trancher | **Ne jamais l'affirmer** comme un verdict (« donc sans bénéfice clinique ») ; seul le fait descriptif reste publiable |
| Signification clinique d'un gain de 1,16 point de pourcentage de syllabes bégayées | **Oui** | **Ne jamais l'affirmer**, ni dans un sens ni dans l'autre |
| Représentativité de la sévérité SSI-4=19 « mild », blocages 1,41 s, pour une patientèle française de consultation | **Oui** | **Ne jamais l'affirmer** |
| KIDS = méthode standard ou non en orthophonie française | **Oui** | **Ne jamais l'affirmer** ; dire seulement que la méthode et le manuel sont allemands, sans équivalent formé identifié dans ce circuit |
| Conflit d'intérêt intellectuel (auteure principale = développeuse du manuel + traductrice de l'outil de mesure) | Non — fait bibliographique | **Publiable, obligatoire** |
| Erreur de correction/multiplicité, test unilatéral, f=0.2 mal étiqueté | Non — biostatistique générale | Note interne ; pas de place dans une brève (pas d'appréciation critique propre) |

### Ce que l'entrée devra dire (si elle est un jour rédigée au-delà de la brève factuelle standard)

1. Premier essai contrôlé randomisé publié pour le traitement du bégaiement chez l'enfant d'âge scolaire
   (aucun identifié par la revue systématique Brignell et al. 2021 citée dans l'article) — méthode KIDS,
   Allemagne, 73 enfants, 34 centres, liste d'attente 3 mois, essai ouvert, enregistré prospectivement
   (DRKS00015851).
2. À 3 mois (seule comparaison réellement randomisée) : le critère principal auto-rapporté par l'enfant
   s'améliore (OASES-S, d=0.62, p corrigé=.026) ; **aucune** mesure objective évaluée en aveugle
   (sévérité SSI-4, évaluations parentales) ne diffère entre groupes.
3. Les résultats « objectifs » présentés à 6-12 mois proviennent d'une analyse avant/après sans groupe
   témoin (les deux bras étant alors traités) — à ne jamais présenter comme un prolongement du résultat
   contrôlé.
4. Mention obligatoire du conflit d'intérêt intellectuel non déclaré dans le texte lu (auteure principale
   = co-développeuse du manuel et traductrice/validatrice de l'outil de mesure principal).
5. Bandeau `meta.relecture_referent: false` visible.
6. Aucun impact sur la pratique du médecin généraliste ni sur un algorithme du module Décision.

### Ce que l'entrée ne devra jamais reprendre

- La conclusion de l'abstract (« clinically relevant improvements... can be expected over 12 months »)
  sans préciser qu'elle repose sur l'analyse non contrôlée.
- L'affirmation d'un transfert des acquis hors clinique (« indicating... transferred », p. 25) — la
  source elle-même la contredit deux pages plus loin.
- Tout jugement de signification clinique sur les chiffres relevant strictement de la compétence
  orthophonique (liste ci-dessus).
- Le recalcul bilatéral de p (§4) présenté comme un résultat de l'étude.
- Le thème `pediatrie` comme thème impacté (aucune décision de soins premiers pédiatriques n'est
  déplacée — cf. §3.3).
- Une reproduction intégrale du texte, des tableaux ou du résumé — résumé critique + lien uniquement
  (SOP §8).

---

## 6. Ce que cette procédure ne garantit pas

- **Angle mort de compétence, non levé par ce circuit.** Ni A, ni B, ni moi-même ne sommes
  orthophonistes. Les questions les plus décisives pour un lecteur du métier — la valeur clinique réelle
  d'un gain sur la sous-échelle « connaissances », la représentativité de la sévérité initiale, la place
  de KIDS dans la pratique française — restent **non tranchées**, pas seulement prudemment formulées.
  C'est exactement ce que le bandeau `relecture_referent: false` doit signaler au lecteur professionnel,
  qui reste seul à pouvoir les évaluer.
- **Financement/COI potentiellement incomplet.** L'absence de section dédiée est établie sur le texte
  lu par A et B ; l'onglet « Info » de l'éditeur, non capturé, pourrait contenir une déclaration que
  cette procédure n'a pas vue.
- **Journal de suivi non mis à jour dans cet environnement.** SOP §5 étape 4/§10 demande la mise à jour
  de `docs/veille/JOURNAL_BOITE_MAIL.md` §2bis au fil de l'eau ; ce fichier n'existe pas dans l'export
  fourni pour cet exercice, donc aucune écriture n'y a été faite pour ne pas fabriquer un contenu sur un
  fichier absent. À reporter manuellement par le référent si ce dossier est traité en conditions réelles.
- **Aucune réplication indépendante disponible.** L'essai est isolé (premier du domaine) ; la prudence
  affichée dans la brève tient aussi à cela, indépendamment de ses limites propres.

---

## 7. Brève proposée (contenu final)

> Premier essai contrôlé randomisé publié sur le traitement du bégaiement chez l'enfant d'âge scolaire
> (méthode KIDS, Allemagne, 73 enfants, liste d'attente 3 mois, essai ouvert, DRKS00015851). À 3 mois,
> seule comparaison réellement contrôlée : le critère principal auto-rapporté par l'enfant s'améliore
> (OASES-S, d=0,62, p corrigé=,026) ; **aucune** mesure objective de sévérité évaluée en aveugle (SSI-4,
> évaluations parentales) ne diffère entre groupes. Les améliorations rapportées à 6-12 mois proviennent
> d'une analyse avant/après **sans groupe témoin**, une fois les deux bras traités. Conflit d'intérêt
> intellectuel non déclaré dans le texte : l'auteure principale a co-développé le manuel évalué et
> traduit/validé l'outil de mesure principal. Sans conséquence sur la pratique en soins premiers.
>
> *Cette entrée n'a reçu aucune relecture par un référent orthophoniste (`meta.relecture_referent:
> false`).*

Source : Kohmäscher A et al., JSLHR 2023;66(11):4191-4205. DOI 10.1044/2023_JSLHR-23-00224.
