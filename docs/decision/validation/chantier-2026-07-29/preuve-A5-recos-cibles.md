# Passe A — Reco officielle & position critique : surveillance, cibles capillaires, désintensification du sujet âgé

Note de preuve, chantier 2026-07-29, nœud `insuline` (DT2). **Agent A (extraction/chiffrage), côté français.**

> **Ce document ne modifie rien.** Aucun fichier sous `content/`, `src/`, `schema/` n'a été touché ;
> `noeuds/E-insuline.md` n'a pas été modifié. Il **propose** au dossier de preuve ; il n'encode rien.
> Tout arbitrage revient au référent.
>
> **Périmètre.** Je porte les sources qu'OpenEvidence ne sait pas traiter (`00-global.md` §Règles de
> sourcing) : **HAS, SFD, CMG, Prescrire, Médicalement Geek/DragiWebdo, Minerva, ebmfrance**. Les recos
> internationales indexées (ADA 2026) sont en §6, **en second et pour confrontation seulement** — le
> prompt OE-A5 du référent les couvre en parallèle.
>
> **Discipline de citation.** Toutes les citations de HAS 2024, SFD 2025, ebmfrance et de la position
> d'experts MCG 2017 sont extraites **des PDF locaux de `docs/decision/sources/`** (extraction texte
> `pdftotext -enc UTF-8` + `PyMuPDF`, deux extractions concordantes). La fiche HAS 2011 a été
> **téléchargée et lue intégralement** depuis le site de la HAS. Les analyses Minerva ont été **ouvertes**.
> Ce qui n'a pas été ouvert porte `[À VÉRIFIER]`.
>
> ⚠ **Force ≠ certitude** (principe posé par le référent le 2026-07-27). Chaque ligne ci-dessous
> distingue **la force de la recommandation telle qu'imprimée** (« recommandé », « indispensable »,
> grade AE/B/E) de **la certitude de la preuve au sens GRADE**. Sur toute cette question, l'écart entre
> les deux est le fait dominant : *la quasi-totalité des chiffres est de force forte et de certitude
> faible à très faible.*
>
> ⚠ **Droit d'auteur (invariant 7)** : §5 ne contient que du résumé critique et des références ; aucune
> reproduction de texte Prescrire au-delà des citations courtes déjà présentes dans les notes internes.

---

## 0. Réponse courte aux cinq questions

| # | Question | Réponse française |
|---|---|---|
| 1 | **Fréquence d'ASG** selon le schéma | **Une seule source française la chiffre : la fiche HAS *BUTS* d'avril 2011** — **≥ 4/j** si > 1 injection/j, **2 à 4/j** si une seule injection. **Ni HAS 2024 ni SFD 2025 ne donnent de fréquence** ; la SFD dit seulement « indispensable ». **Remboursement** : plafond de **200 bandelettes/an** (arrêté du 25 février 2011) **qui ne s'applique PAS aux insulino-traités** — pas de plafond pour eux. |
| 2 | **Cibles capillaires** | **HAS 2011 : 0,70–1,20 g/L avant les repas ; < 1,80 g/L à 2 h post-prandial.** ⚠ **Ce sont exactement les deux chiffres du nœud** — y compris le « 1,80 g/L à 2 h » que la vignette V-A4 dit sans source. Il a une source, française et officielle. **Mais elle ne porte aucun grade et ne cite aucun essai.** SFD 2025 donne un chiffre **différent** pour la titration : **0,80–1,30 g/L au réveil**. |
| 3 | **Désintensification / seuil chiffré** | **OUI, un seuil chiffré existe — mais côté SFD, pas côté HAS.** **SFD 2025 Avis 21** : sous SU/glinide/insuline, **rester AU-DESSUS de 7 %** chez l'âgé « fragile » et **AU-DESSUS de 7,5 %** chez l'âgé « dépendant » sous insuline. **HAS R.103 = principe seul, aucun nombre** ; le seul nombre de la HAS est **R.105** (écart à l'objectif < 0,5 % d'HbA1c → arrêt médicamenteux envisageable chez le fragile/malade), et il ne porte pas sur la réduction de dose. |
| 4 | **Plafond de dose de basale** | **Aucun référentiel n'en définit.** SFD Avis 19 nomme « fortes doses » **> 0,5 U/kg/j** → avis spécialisé + MCG indiquée, pas un plafond. **ebmfrance dit l'inverse d'un plafond** : « la dose varie entre 10 et 200 unités », moyenne 70 U. |
| 5 | **Position critique** | **Prescrire ne traite pas le sujet** dans le corpus disponible (P1–P13) — demande en §9. **Minerva** : arrêter le capteur pour revenir au capillaire chez le DT2 sous basale **ne dégrade ni l'HbA1c ni les hypoglycémies** (Aleppo 2021) — argument *en faveur* du parcours sans capteur. **Méd. Geek** : anti-surtraitement, relaie la déprescription < 6,5 %. **Contre-point sourcé** : la position d'experts MCG française (2017, présente dans le dépôt) écrit que le capillaire coucher/lever distingue « très mal » phénomène de l'aube et hypoglycémie nocturne — c'est précisément le trou de V-A1. |

**Trois conséquences pour les vignettes, à valider par le référent :**

- **V-A1 / exigence E1** — la règle de descente **n'est pas une question de collecte** : elle est écrite
  dans **trois** sources françaises, dont deux qui font déjà autorité dans le nœud (HAS R.87, SFD
  Avis 18) et une troisième qui l'opérationnalise complètement (ebmfrance : combien d'occurrences,
  combien d'unités). Cf. §7.3.
- **V-A5 / exigences E4-E5** — le chiffre manquant existe (**SFD Avis 21 : plancher 7 % / 7,5 %**), et
  **la cible capillaire du sujet âgé fragile est explicitement donnée sans capteur** par HAS 2024
  (Annexe 3) *et* par SFD Avis 21 (**glycémies préprandiales 1–2 g/L**). Le garde `mcg_disponible`
  sur les alertes de cibles n'a donc **aucun appui dans les sources**.
- **V-A4 / exigence E3** — la vignette dit « chiffre sans source ». **C'est inexact** : le 1,80 g/L à 2 h
  est de la HAS (2011). Ce qui manque n'est pas la *source*, c'est la *preuve* : la fiche ne cite aucun
  essai et ne porte aucun grade. E3 reste bloquante au sens EBM, pour une autre raison que celle écrite.

---

## 1. Question posée

Chez l'adulte **DT2 traité par insuline et SANS capteur de glucose** (`mcg_disponible = non`), en
médecine générale française :

1. Quelle **fréquence d'autosurveillance glycémique (ASG)** les référentiels recommandent-ils, selon le
   schéma (basale seule vs basal-bolus), et quel est le **cadre de remboursement** français ?
2. Quelles **cibles capillaires** à jeun / préprandiales et post-prandiales, avec **le grade imprimé
   dans la source**, et un essai les soutient-il ?
3. **Désintensification du sujet âgé sur-traité** : en dessous de quelle HbA1c, ou de quel écart à
   l'objectif, faut-il réduire l'insuline ? **Seuil chiffré ou principe ?**
4. Un référentiel définit-il un **plafond de dose de basale** ?
5. Que dit la **position critique** (Prescrire, Méd. Geek, Minerva) du sur-traitement et de la
   surveillance ?

---

## 2. HAS

### 2.1 Le point de méthode qui commande tout le reste : HAS 2024 ne traite PAS l'ASG

La RBP 2024 exclut explicitement l'ASG et les objectifs glycémiques de son périmètre :

> « Cette mise à jour ne concerne pas les recommandations portant sur : **la redéfinition des objectifs
> glycémiques ou la place de l'autosurveillance glycémique qui restent maintenues selon les
> recommandations de bonne pratique en cours** (voir annexe pour rappel) »
> — HAS, *Stratégie thérapeutique du patient vivant avec un DT2*, mai 2024, p. 5.

**Conséquence pratique et conséquence de discipline.**

- Pratique : la reco française d'ASG **en vigueur** n'est pas dans le document de 2024 ; c'est la
  **fiche BUTS d'avril 2011** (§2.3), et l'Annexe 3 de 2024 ne fait que **rappeler les cibles de 2013**.
- Discipline (**règle « ne pas sur-accuser »**, `CONSTRUIRE-UN-MODULE.md` §P4) : on ne peut pas écrire
  que « la HAS est muette sur l'ASG ». Elle ne l'est pas : elle **renvoie**, et son renvoi maintient en
  vigueur un texte de 2011. Et on ne peut pas écrire que HAS 2024 est « en retard » sur l'ASG : elle a
  **délibérément exclu** le sujet de son périmètre. La **clôture bibliographique** de HAS 2024 est
  visible en Annexe 2 : la reco indexée la plus récente analysée est **ADA 2023** (item 6 de la liste),
  et les prises de position SFD retenues s'arrêtent à **2023**. Reprocher à HAS 2024 d'ignorer SFD 2025
  ou ADA 2026 serait une erreur de dix-huit mois du même type que celle du 2026-07-27.

### 2.2 HAS 2024 — ce qu'elle dit sur l'insuline, la surveillance et le sujet âgé (citations exactes)

Tous les items ci-dessous sont **grade AE** (accord d'experts) — c'est le grade imprimé dans la source.

| N° | Citation exacte | Grade imprimé |
|---|---|---|
| **R.81** | « L'instauration d'une insulinothérapie […] est **accompagnée et idéalement précédée d'une autosurveillance glycémique** et fait l'objet d'un apprentissage par le patient et/ou son aidant » | **AE** |
| **R.82** | « L'instauration d'une insulinothérapie nécessite la définition d'objectifs glycémiques clairs, **la réalisation d'une autosurveillance glycémique**, l'adaptation des doses d'insuline afin d'atteindre les objectifs glycémiques […] » | **AE** |
| **R.84** | « Chez les patients vivant avec un DT2 sous insuline, l'utilisation d'un dispositif de mesure continue du glucose (« capteurs ») **est encouragée** afin d'éviter les complications associées au traitement, en particulier les hypoglycémies sévères » | **AE** |
| **R.87** | « **définition d'un objectif pour la glycémie à jeun au réveil selon l'objectif d'HbA1c personnalisé du patient** » ; « **adaptation des doses d'insuline tous les 3 jours** en fonction des glycémies au réveil et de l'objectif fixé (à titre indicatif, **la dose peut être augmentée ou réduite de 1 ou 2 UI**, sauf cas particulier) » ; « réévaluation du traitement (ADO et/ou insuline) régulièrement et selon besoin **en cas d'hypoglycémies fréquentes ou d'une hypoglycémie sévère** » ; dose initiale « en général de **0,1 unité/kg** par 24 heures » | **AE** |
| **R.88** | Intensification : « **préférentiellement, un schéma basal-bolus** » ou « schéma de 1 à 2 injections par jour d'insuline (mélange…) » | **AE** |
| **R.89** | « En cas de diabète très déséquilibré, avec des **glycémies supérieures à 3 g/l répétées et/ou une HbA1c > ou = 10 %**, un schéma insulinique intensifié pourra être instauré d'emblée » | **AE** |
| **R.102** | « les sulfamides sont à utiliser avec précaution chez les personnes âgées […] et impliquent une **surveillance accrue** » | **AE** |
| **R.103** | « Il est recommandé de **réévaluer les objectifs glycémiques régulièrement**. Il faut **éviter le surtraitement** et **une désintensification peut être proposée pour réduire le risque iatrogénique, en particulier d'hypoglycémies**. » | **AE** |
| **R.104** | « Lorsque les TMH ne peuvent pas être utilisés, l'insulinothérapie est recommandée. Le recours à une tierce personne […] peut être envisagé, ainsi que celui à un **dispositif de mesure continue du glucose** » | **AE** |
| **R.105** | « Pour les personnes âgées dites « fragiles » ou « malades », et **si l'écart à l'objectif est faible (moins de 0,5 % en valeur absolue d'HbA1c), l'absence de traitement médicamenteux peut être envisagée** en maintenant une surveillance de l'équilibre glycémique » | **AE** |

**Lecture de R.103 — le point le plus important du §2, et il est négatif.**
R.103 **n'a aucun seuil**. Elle énonce un principe (« éviter le surtraitement », « une désintensification
peut être proposée ») sans dire **en dessous de quoi**, ni **de combien réduire**, ni **sur quel signal**.
Le nœud cite R.103 comme appui de l'option « Désintensifier / alléger » : c'est **juste sur le principe
et vide sur le déclencheur**. Le déclencheur chiffré doit venir d'ailleurs (→ SFD Avis 21, §3.4).

**Lecture de R.105 — le seul nombre HAS, et il ne dit pas ce qu'on voudrait lui faire dire.**
« L'écart à l'objectif est faible (moins de 0,5 % en valeur absolue d'HbA1c) » **ne précise pas le sens
de l'écart** (au-dessus ou en dessous). Dans son contexte (Tableau 9, personnes âgées, et la
conclusion « l'absence de traitement médicamenteux peut être envisagée »), la lecture naturelle est :
*le diabète est quasiment à l'objectif tout seul, donc on peut envisager d'arrêter les médicaments.*
C'est un critère d'**arrêt total**, pas de **réduction de dose d'insuline**, et il n'énonce pas de
plancher d'HbA1c. **Je signale l'ambiguïté et ne tranche pas** (`00-global.md` : en cas de doute non
tranché par la source, signaler). Pour V-A5 (84 ans fragile, HbA1c 6,3 %, cible 8 %), l'écart est de
**1,7 %** : R.105 **ne s'applique pas** telle qu'elle est écrite, alors même que le patient est
manifestement sur-traité. **HAS 2024 ne couvre pas V-A5.**

### 2.3 HAS avril 2011, fiche BUTS « L'autosurveillance glycémique dans le DT2 : une utilisation très ciblée » — *le seul texte français qui chiffre l'ASG*

Document maintenu en vigueur par le renvoi de HAS 2024 (§2.1). **Type** : « Bon usage des technologies
de santé », validé par la **CNEDiMTS**. **Aucun grade n'est imprimé** dans ce document — ni A/B/C, ni AE.

**Fréquence — tableau du document, verbatim :**

| Indication (DT2) | Rythme d'ASG suggéré |
|---|---|
| **Insulinothérapie en cours** | « **Au moins 4 par jour** si l'insulinothérapie comprend **plus d'une injection d'insuline par jour** ; **2 à 4 par jour** si elle n'en comprend qu'une » |
| Insulinothérapie prévue à court ou moyen terme | « 2 à 4 par jour » |
| Traitement n'atteignant pas l'objectif glycémique | « De 2 par semaine à 2 par jour au maximum » |
| Traitement par insulinosécréteurs (SU/glinides) | « De 2 par semaine à 2 par jour au maximum » ; « ASG à réaliser **au moins deux jours par semaine, à des moments différents de la journée**, pour affirmer une hypoglycémie » |

**Cibles capillaires — verbatim, rattachées à la ligne « Insulinothérapie en cours » :**

> « **Objectifs glycémiques : avant les repas, 70 à 120 mg/dL ; en post-prandial (2 heures après le
> repas) : < 180 mg/dL.** »

Soit **0,70–1,20 g/L en préprandial** et **< 1,80 g/L à 2 h**.

> ⚠ **C'est la source des deux chiffres du nœud.** `gaj_a_cible` (0,70–1,20 g/L) et le « < 1,80 g/L à
> 2 h » de la carte bolus sont **mot pour mot** les objectifs de cette fiche HAS. Le nœud les attribue
> aujourd'hui à Treat-to-Target/Riddle 2003 (pour le premier) et à rien (pour le second) : **il existe
> pour les deux un ancrage officiel français, antérieur à tout relais ADA 2020.** À porter au dossier.

**Principes de prescription — verbatim :**

> « L'ASG **ne doit être employée que si elle est susceptible d'entraîner une modification de la
> thérapeutique**. » · « L'autosurveillance glycémique **ne doit être ni systématique ni passive**. » ·
> « Lors de la prescription du dispositif d'ASG, il est indispensable d'expliquer les enjeux au patient
> et d'**organiser avec lui cette autosurveillance : fréquence, fixation des horaires, objectifs
> glycémiques, modifications du traitement à effectuer par le patient ou le médecin en fonction des
> résultats**. »

**Remboursement — verbatim :**

> « **Par arrêté ministériel du 25 février 2011**, la prise en charge des bandelettes d'autosurveillance
> glycémique par l'Assurance maladie est **limitée à 200 par an**, **à l'exception des patients pour
> lesquels une insulinothérapie est en cours ou prévue à court ou moyen terme.** »
> Également : « Un lecteur de glycémie est remboursable **tous les 4 ans**. Un autopiqueur est
> remboursable **tous les ans**. »

> **Point décisif pour la passe A** : **le plafond de 200/an ne concerne PAS le patient insulino-traité.**
> Le patient de V-A8 (une seule glycémie par jour) et celui de V-A7 (aucune) ne sont **pas** limités par
> le remboursement. L'obstacle à une densification de l'ASG est clinique et éducatif, **pas économique**.
> Confirmé à 14 ans d'intervalle par **SFD 2025 Avis 23** (§3.5), donc à jour au **décembre 2025**.

**Certitude de la preuve.** Le document est « élaboré à partir des études disponibles et des avis de la
CNEDiMTS/CEPP ». Il **ne cite aucun essai**, ne donne **aucun grade**, et **aucune donnée** n'y rattache
la fréquence (« au moins 4 par jour ») ni les cibles (70–120 / < 180 mg/dL) à un résultat clinique.
→ **GRADE : très faible** (avis d'une commission). **Force : recommandation officielle française en
vigueur.** *L'écart force/certitude est ici maximal, et il porte sur les chiffres les plus structurants
du nœud.*

---

## 3. SFD 2025

Source : Darmon P, Bauduceau B, Bordier L, Detournay B, Dupuy O, Gourdy P, et al., *Méd. Mal. Métab.*
2025;19(8):630-662 — PDF local `docs/decision/sources/SFD 2025.pdf`, lu en primaire.

**Statut de preuve auto-déclaré par la SFD, à afficher avec toute citation :**

> « Les propositions du groupe de travail de la SFD […] sont fondées sur une analyse de la littérature
> scientifique et des principales recommandations nationales et internationales disponibles à ce jour
> **et sur l'expérience des membres du groupe, et relèvent de l'avis d'experts.** » (Partie 6)

→ **Aucun avis SFD ne porte de grade.** Force : « recommandé » / « indispensable ». Certitude GRADE :
**faible à très faible**, par auto-déclaration de la source.
**COI** : massifs et déclarés (Novo, Sanofi, Lilly, AstraZeneca, BI, MSD… **et** Abbott, Dexcom,
Medtronic) — déjà tracé dans `E-insuline.md` §3/E5, et pertinent ici parce que la SFD est aussi la
source qui pousse le capteur.

### 3.1 Avis 3 — individualisation des objectifs, et **le premier plancher chiffré**

> « Une cible d'HbA1c ≤ 8 % (64 mmol/mol) sera proposée chez les patients […] âgés de moins de 75 ans
> présentant une espérance de vie limitée (< 5 ans) et/ou une (ou plusieurs) comorbidité(s) sévère(s)
> et/ou une IRC sévère ou terminale, ainsi que chez les patients ayant une longue durée d'évolution du
> diabète (> 10 ans) […] ; dans ces situations, **si les patients sont traités par sulfamide
> hypoglycémiant (SU), glinide ou insuline, il est recommandé de ne pas chercher à atteindre une valeur
> d'HbA1c < 7 % (53 mmol/mol) pour minimiser le risque hypoglycémique**. Il faut cependant garder en
> tête qu'une HbA1c ≤ 7 % n'exclut pas la possibilité que le patient puisse faire des hypoglycémies avec
> ces traitements. »

**Le plancher de 7 % existe donc déjà avant 75 ans**, dès qu'il y a espérance de vie limitée,
comorbidité sévère, IRC sévère ou diabète ancien difficile — et **il est conditionné au traitement**
(SU, glinide, insuline), pas à l'âge.

### 3.2 Avis 3 — ASG : la place, jamais la fréquence

> « En complément de l'HbA1c, la mise en place d'une autosurveillance glycémique (ASG) est **très
> souhaitable** en cas de traitement par SU ou glinides et **devient indispensable en cas de traitement
> par insuline** ainsi que pour les patientes enceintes […] »

→ **La SFD 2025 ne donne aucun nombre de contrôles par jour, pour aucun schéma.** Vérifié sur
l'intégralité du texte (Avis 3, 18, 19, 21, 23). C'est la HAS 2011 qui reste le seul chiffrage français.

### 3.3 Avis 18 — titration de la basale : **cible capillaire + règle SYMÉTRIQUE**

> « Dans tous les cas, il faudra **instaurer (ou renforcer) une (auto-)surveillance glycémique** pour
> l'adaptation des doses d'insuline et la prévention des hypoglycémies. Par exemple, **pour obtenir une
> HbA1c < 7 % (53 mmol/mol), il faudra viser une glycémie au réveil entre 0,80 g/L et 1,30 g/L** et
> « titrer » l'insuline basale dans ce sens (par exemple : **adaptation des doses d'insuline tous les
> trois jours** en fonction des glycémies au réveil, **la dose pouvant être augmentée ou réduite de 2 U
> — ou de 10 % chez les patients traités par de fortes doses d'insuline basale, par exemple supérieures
> à 40 U/j**). »

Également : dose de départ « **6 à 10 U/jour ou 0,1 à 0,2 U/kg/jour** ».

> ⚠ **Deux faits pour le nœud.**
> 1. **La règle de descente EXISTE dans la source qui fonde déjà la titration du nœud** : « augmentée
>    **ou réduite** de 2 U — ou de 10 % » si > 40 U/j. Le nœud n'a encodé que la moitié montante d'une
>    règle qui est écrite symétrique.
> 2. **La cible de la SFD n'est pas celle du nœud** : **0,80–1,30 g/L au réveil** (SFD 2025) vs
>    **0,70–1,20 g/L** (HAS 2011 « avant les repas » / Riddle 2003). Divergence réelle entre les deux
>    sources françaises, dans les deux sens (borne basse *et* haute). Voir §7.2 — **je ne tranche pas.**

### 3.4 Avis 21 — sujet âgé > 75 ans : **les planchers chiffrés, et la cible capillaire sans capteur**

> « Une **attitude thérapeutique trop intensive chez des sujets âgés « fragiles »** ou au contraire trop
> peu exigeante chez les patients âgés « en bonne santé » sont **les deux écueils à éviter**. »
>
> « il est essentiel de limiter le risque d'hypoglycémie, notamment d'hypoglycémie sévère. Ce risque
> hypoglycémique existe sous SU, glinide et insuline ; **il est plus important, avec ces médicaments,
> lorsque le taux d'HbA1c est < 7 % (53 mmol/mol), mais persiste lorsque le taux d'HbA1c est plus
> élevé.** »
>
> — « en bonne santé » : « **HbA1c ≤ 7 %**, en portant une attention particulière au risque
> d'hypoglycémie en cas de traitement par SU, glinide ou insuline. »
> — « **fragiles** » : « on proposera une cible d'**HbA1c ≤ 8 %**, **en restant au-dessus de 7 %
> (53 mmol/mol) en cas de traitement par SU, glinide ou insuline** pour limiter le risque
> d'hypoglycémie. »
> — « **dépendantes et/ou à la santé très altérée** » : « la priorité est d'éviter les complications
> aiguës de l'hyperglycémie majeure […] et les hypoglycémies : **des glycémies capillaires préprandiales
> comprises entre 1 et 2 g/L et/ou une HbA1c < 9 % sont recommandées, en restant au-dessus de 7,5 %
> (58 mmol/mol) en cas de traitement par insuline.** »

Tableau I, note 7 : « **Ces valeurs pourront être modulées en fonction du degré de fragilité et de
dépendance.** » Note 8 : « des glycémies préprandiales comprises entre **1,00 et 2,00 g/L** constituent
un objectif raisonnable ».

**Avis 21 bis** ajoute, chez le dépendant sous insuline : « avec une **vigilance accrue sur le risque
d'hypoglycémie (minoré en gardant une HbA1c > 7,5 %)** et en ayant recours à une surveillance de la
**glycémie capillaire ou** par mesure en continu du glucose ». Et : « Une **réévaluation régulière des
traitements anti-hyperglycémiants et de leur posologie devra être assurée** » · « **La déprescription
d'un ou plusieurs agents anti-hyperglycémiants doit être éventuellement envisagée dans cette population**
[…] (cf. Avis n° 5 bis). »

> ⚠ **C'est la réponse chiffrée que le nœud cherchait pour V-A5.** Le patient de V-A5 (84 ans, fragile,
> insuline, **HbA1c 6,3 %**) est **sous le plancher de 7 %** énoncé par la SFD pour exactement son
> profil. La reco française **ne se contente pas de dire « éviter le surtraitement »** : elle donne un
> nombre. Et **elle donne aussi la cible capillaire du dépendant (1–2 g/L préprandial), sans capteur.**
>
> ⚠ **Nature du seuil** : c'est un **plancher d'HbA1c**, pas un **écart à la cible**. La vignette V-A11
> (« la frontière est l'écart à la cible, pas la valeur absolue ») et la SFD **ne modélisent pas la même
> chose**. Chez la femme de V-A11 (66 ans, HbA1c 6,9 %, cible 7 %), la SFD ne dit rien : le plancher de
> 7 % vise les > 75 ans fragiles et les < 75 ans à espérance de vie limitée/comorbidité sévère
> (Avis 3) — **pas** le sujet en bonne santé. Les deux lectures sont donc compatibles **si le plancher
> est gardé par le terrain**. Arbitrage de modélisation → référent.

### 3.5 Avis 23 — ASG et remboursement

> « **L'ASG n'est recommandée que si les résultats sont susceptibles d'entraîner une modification des
> mesures hygiéno-diététiques et/ou du traitement médicamenteux.** La réalisation systématique de l'ASG,
> chez les patients sous agents anti-hyperglycémiants ne provoquant pas d'hypoglycémie, n'est donc pas
> recommandée de principe. »
>
> « **L'ASG doit s'inscrire dans une démarche d'éducation du patient. Lors de la prescription d'un
> dispositif d'ASG, il est indispensable d'expliquer au patient les modalités et enjeux de cette
> autosurveillance : définir les moments, la fréquence, les objectifs glycémiques et les décisions à
> prendre en fonction des résultats.** »
>
> « **L'ASG est indispensable chez les patients vivant avec un DT2 : — traités par insuline, afin
> d'adapter les doses d'insuline et de prévenir les hypoglycémies** […] »
>
> « L'ASG est utile : […] **pour les patients avec un taux d'HbA1c ≥ 8 % dans le cadre d'un ajustement
> thérapeutique dont le passage à l'insuline** […] »
>
> « **En France, les bandelettes réactives utilisées avec un lecteur de glycémies capillaires sont
> remboursées à hauteur de 200 par an pour les patients vivant avec un DT2 non traités par insuline.** »

Sur la MCG (pour situer le sans-capteur) : remboursée si **insulinothérapie intensifiée (≥ 3
injections/j ou pompe), quel que soit le niveau d'HbA1c** ; **également prescriptible si < 3
injections/j et équilibre insuffisant** ; **primoprescription possible par le MG** chez le patient à 1
ou 2 injections. Et, chez l'âgé en EHPAD : « **les patients traités par insuline sont souvent surtraités
avec de fréquentes hypoglycémies, notamment la nuit** » ; « il peut être parfois nécessaire
d'**interrompre** de façon temporaire ou définitive l'usage de la MCG […] **en cas de difficultés
d'utilisation ou de futilité** ».

> Deux remarques utiles au périmètre de la passe : (a) la SFD **reconnaît explicitement le sur-traitement
> insulinique de l'âgé institutionnalisé, la nuit** — le tableau exact de V-A1 et V-A5 ; (b) la SFD
> prévoit elle-même des **sorties de capteur** (futilité, difficulté d'usage), donc le parcours « sans
> capteur » n'est pas seulement le parcours du patient non équipé, c'est aussi une **sortie normale** du
> parcours équipé.

### 3.6 Avis 5 / 5 bis — règles d'arrêt et déprescription (transverses, non spécifiques à l'insuline)

**Avis 5** — le **seuil de 0,5 %** de la SFD, à ne pas confondre avec R.105 de la HAS :
> les iDPP4/iSGLT2/AR GLP-1/AR GIP-GLP-1 « seront **arrêtés si la baisse d'HbA1c est de moins de 0,5 %
> (et que l'HbA1c reste supérieure à l'objectif)** trois à six mois après l'initiation » ; les SU et
> glinides idem « **OU en cas d'hypoglycémies répétées ou sévère(s)** ».
> ⚠ **L'insuline n'est pas dans cette règle d'arrêt.** Et le 0,5 % de l'Avis 5 est une **baisse
> insuffisante** (inefficacité), pas un **écart à la cible** comme dans R.105 HAS. Trois « 0,5 % »
> circulent donc dans le corpus, avec trois significations différentes — voir §8.

**Avis 5 bis** :
> « la **déprescription doit systématiquement être proposée devant la survenue d'effets secondaires
> invalidants** comme par exemple, **des hypoglycémies avec les SU, les glinides ou l'insuline** […] Elle
> peut aussi être envisagée **lorsque les cibles thérapeutiques méritent d'être relevées** au regard de
> la présentation clinique de la personne (cf. Avis n° 3). » · « La **réduction ou l'arrêt** d'un
> traitement constitue un acte médical qui nécessite une bonne connaissance de la personne malade […]
> pour adapter les objectifs thérapeutiques et **éviter le renouvellement automatique de l'ordonnance**. »

> ⚠ **Appui direct pour V-A2** : « la déprescription **doit systématiquement être proposée** devant […]
> **des hypoglycémies avec […] l'insuline** ». La SFD ne dit pas « proposer la réduction *à côté de*
> l'augmentation » ; elle en fait la conduite devant l'événement. C'est un argument de source pour faire
> de l'hypoglycémie sévère récurrente une **`exclusions`** de la titration (canal R8), et non une carte
> concurrente. **Force forte, certitude faible (avis d'experts).**

### 3.7 Avis 19 — le seul repère de « fortes doses »

> « En cas de résultats insuffisants sous insulinothérapie basale + metformine (**HbA1c > objectif malgré
> des glycémies à jeun dans la cible** ou **HbA1c > objectif et glycémie à jeun au-dessus de la cible
> malgré de fortes doses d'insuline basale, c'est-à-dire plus de 0,5 U/kg/j**), **l'avis d'un
> endocrinologue-diabétologue est souhaitable. Si elle n'a pas été mise en place jusque-là, une mesure en
> continu du glucose est indiquée.** »

→ Le **0,5 U/kg/j** de la SFD est un **descripteur de « fortes doses »** qui déclenche *avis spécialisé
+ MCG + choix entre trois options* (ajout oral / ajout AR GLP-1 **préféré** / intensification
insulinique). **Ce n'est pas un plafond**, et la SFD n'en énonce aucun. Cohérent avec la généalogie déjà
établie dans [`preuve-sur-basalisation.md`](../chantier-2026-07-27/preuve-sur-basalisation.md) (avis
d'expert, retiré par l'ADA en 2025-2026).
Noter aussi le **premier membre de la phrase** : « HbA1c > objectif **malgré des glycémies à jeun dans
la cible** » — c'est exactement le raisonnement par élimination de **V-A4**, et il est **sourcé SFD**,
sans capteur.

---

## 4. ebmfrance / CMG

### 4.1 ebmfrance — *Insulinothérapie dans le DT2* (ebm00491)

PDF local. Duodecim, MàJ **27/05/2022** ; contextualisation ebmfrance **26/06/2024** (la contextualisation
consiste à signaler la RBP HAS 2024 et à annoncer un guide ebmfrance-HAS « en cours de rédaction »).
**C'est la source la plus opérationnelle du corpus sur le pilotage capillaire**, et la seule qui donne un
**algorithme complet, montant ET descendant**.

**Surveillance — verbatim :**
> « **L'autosurveillance de la glycémie (uniquement la glycémie à jeun en cas d'utilisation d'insuline
> basale)** et l'auto-ajustement simple de la dose d'insuline **sont essentiels à la réussite**. »
> « **Pendant le traitement par insuline du soir, il suffit de mesurer la glycémie à jeun le matin et
> lorsque les symptômes d'hypoglycémie apparaissent.** » · « Une fois la dose stabilisée, la mesure de la
> glycémie à jeun peut être effectuée **moins fréquemment, par exemple une fois par semaine**. »
> Tableau 1 : « Il est possible de passer d'une surveillance **quotidienne** de la glycémie à jeun à une
> surveillance **hebdomadaire** […] lorsque la valeur cible a été atteinte. »

**Cible capillaire à jeun — verbatim :**
> « **Si la glycémie à jeun ne se situe pas dans l'intervalle cible (5,0 à 6,0 mmol/l), l'HbA1c cible de
> 53 mmol/l (7,0 %) ne sera pas atteinte.** » · ailleurs : « la **plage cible de 4,0 à 6,0 mmol/l** pour
> la glycémie à jeun ».
> Soit **0,72–1,08 g/L** (bande de titration 4,0–6,0) — encore une **troisième** borne haute.

**Algorithme d'auto-ajustement — verbatim, montant ET descendant :**
> « le patient reçoit par écrit un guide simple d'auto-ajustement : **augmenter la dose de 2 unités si la
> glycémie à jeun est supérieure à 6,0 mmol/l pendant 3 matins consécutifs.** »
> « **si la glycémie à jeun est inférieure à 4,0 mmol/l : — 1 fois sur 3 : pas de modification du dosage ;
> — plus fréquemment : réduire la dose de 2 unités ; — si les glycémies à jeun restent basses, contacter
> un(e) infirmier(e).** »
> Tableau 1 : « […] le patient augmente la dose de 2 unités à domicile (**sauf si la glycémie à jeun est
> au moins une fois inférieure à 4,0 mmol/l**). **Si le patient fait des hypoglycémies symptomatiques,
> réduire la dose de 4 unités.** Si le patient fait des hypoglycémies récurrentes, il doit contacter son
> centre de traitement. »

> ⚠ **Ceci répond intégralement au `COLLECTE` de V-A1** (« faut-il **une** GAJ basse ou **plusieurs**
> pour agir, et de combien réduire ? ») :
> — **combien d'occurrences** : une seule GAJ < 0,72 g/L sur trois **suspend la montée** (« sauf si…
> au moins une fois ») ; **plus d'une sur trois** commande la **descente** ;
> — **de combien** : **−2 U**, ou **−4 U** si hypoglycémies symptomatiques ;
> — **quand escalader** : glycémies qui restent basses / hypoglycémies récurrentes → contact soignant.
> Aucune preuve nouvelle n'est requise pour E1. **La question était : « où est-ce écrit ? » — c'est
> écrit là, et dans HAS R.87, et dans SFD Avis 18.**

**Pas de plafond de dose — verbatim :**
> « **La dose d'insuline dans le DT2 peut varier entre 10 et 200 unités** […] La dose moyenne est de
> **70 unités** lorsqu'un seul médicament oral est utilisé (1 médicament oral équivaut à environ 20
> unités d'insuline). » · Ordonnance suggérée : « **selon l'ajustement individuel 10 à 200 unités par
> jour par voie sous-cutanée** ».

**Pas de bolus, donc pas de cible post-prandiale — verbatim :**
> « **Les insulines prandiales ne devraient pas être incluses dans l'insulinothérapie moderne du diabète
> de type 2.** » · « Les préparations d'insuline prandiale et les préparations d'insuline prémélangée
> augmentent la fréquence des hypoglycémies et entraînent une prise de poids supplémentaire […] et
> **leur utilisation ne constitue pas un traitement fondé sur des preuves pour le diabète de type 2.** »
> Conduite en cas de GAJ à la cible mais HbA1c au-dessus : « **Si la glycémie à jeun du patient est dans
> la plage cible (moyenne des mesures à jeun comprise entre 4,0 et 6,0 mmol/l sur une période de 8
> semaines), mais que l'HbA1c est supérieure à la valeur cible de 53 mmol/mol (7,0 %), un analogue du
> GLP-1 peut être ajouté à l'insuline basale.** »

**Cible relâchée — sans capteur, verbatim :**
> « Un niveau cible plus élevé peut être justifié si le patient a : **des hypoglycémies sévères
> récurrentes ; une espérance de vie limitée ; une altération des fonctions cognitives, une réduction de
> la capacité fonctionnelle ; des complications vasculaires graves ; d'autres maladies systémiques
> graves.** »

**Grades imprimés** : ebmfrance grade **B** deux affirmations seulement — « l'association d'agents oraux
et d'insuline du soir constitue l'insulinothérapie de choix dans le DT2 » et la hiérarchie des analogues
lents vs NPH. **Ni la cible capillaire, ni l'algorithme d'auto-ajustement, ni la fréquence d'ASG ne
portent de grade.** → certitude **faible/très faible** pour tout ce qui nous intéresse ici, **force**
forte (« essentiels à la réussite »).

### 4.2 ebmfrance — *Traitement global et suivi du DT2* (ebm00488) : **la source du « < 1,80 g/L »**

Tableau 1, « Objectifs du traitement du diabète de type 2 » — verbatim :
> « **Glycémie plasmatique : 4 à 7 mmol/l avant les repas ; < 10 mmol/l après les repas ; augmentation
> postprandiale ne dépassant pas 2 à 3 mmol/l.** » (HbA1c « < 53 mmol/mol (< 7,0 %) »)

Soit **0,72–1,26 g/L préprandial** et **< 1,80 g/L post-prandial** — **le même 1,80 g/L que HAS 2011 et
que le nœud.** Et un critère qu'aucune source du dépôt ne portait jusqu'ici : **l'excursion
post-prandiale ≤ 2–3 mmol/L (0,36–0,54 g/L)**, c'est-à-dire un **delta**, pas une valeur absolue.

Sur l'ASG selon le traitement — verbatim :
> « **les patients sous insulinothérapie sont les principaux patients concernés par l'autosurveillance.
> L'objectif particulier pour le patient est d'apprendre à ajuster lui-même sa dose d'insuline** […]
> **il suffit de déterminer la glycémie à jeun lorsque le patient est sous insuline basale.** »
> « **Si le taux d'HbA1c est resté dans les limites de l'objectif […] pendant une longue période, il ne
> sera pas nécessaire de procéder à une autosurveillance régulière entre les visites.** »
> Objectif moins strict si : « une espérance de vie limitée ; des complications vasculaires graves ; des
> comorbidités systémiques sévères ; des antécédents d'hypoglycémies sévères récurrentes. »

**Tableau 1 ne porte aucun grade.**

### 4.3 CMG — **rien**

Recherche menée dans le dépôt et sur le web : **aucune position du Collège de la Médecine Générale
dédiée à l'ASG, aux cibles capillaires ou à la désintensification insulinique n'a été trouvée.**
Ceci **confirme et prolonge** deux constats déjà actés :
- `E-insuline.md` §5b correction 4 : la « position CMG » attribuée par OpenEvidence est une **invention**,
  non sourcée — **ne pas la ressusciter** ;
- `00-global.md` / mémoire projet : `sources/mmm_referentielmcg_ep11.pdf` **n'est pas** un référentiel du
  Collège de Médecine Générale ; c'est la **position d'experts française sur la Mesure Continue du
  Glucose** (Hanaire H. et al., *Méd. Mal. Métab.* 2017, hors-série n° 1, vol. 11, juin 2017). Confirmé
  par lecture de la page de titre.
→ **L'ancrage « soins premiers » du nœud reste `ebmfrance`**, comme déjà tranché pour le nœud D
(décision référent Q1-Q5 du 2026-07-24).

---

## 5. Position critique — Prescrire, Médicalement Geek/DragiWebdo, Minerva

### 5.1 Prescrire — **absent du sujet dans le corpus disponible**

Lecture intégrale de `docs/decision/sources/prescrire-dt2.md` (P1–P13, 17 ko) : **aucune occurrence** de
« autosurveillance », « ASG », « bandelette », « glycémie capillaire », « désintensification »,
« déprescription ». Prescrire, dans le matériau disponible, ne traite **ni la surveillance glycémique,
ni les cibles capillaires, ni la conduite de réduction de dose**.

Ce que Prescrire dit **et qui touche le sujet**, à ne pas sur-interpréter :
- **Échelle de cibles** (P1=P4, actualisation févr. 2026) : ~7 % les premières années puis ~7,5 % ;
  **âgés/fragiles 7,5–8,5 %** ; **8–9 %** si complication vasculaire majeure / affection grave /
  espérance de vie < 5 ans ; espérance de vie courte → **contrôle moins strict *sans médicament***.
- **Seuil de non-intensification** (P3, août 2023, p. 603) : espérance de vie faible → **ne pas ajouter
  de médicament tant que HbA1c ≤ 8,5 %, voire 9 %**. ⚠ C'est un seuil de **non-ajout**, **pas** un
  plancher de désintensification : il ne dit **pas** en dessous de quelle HbA1c réduire l'insuline.
- **Effets indésirables de l'insuline** (P3, p. 602) : « hypo, poids, **aggravation de la rétinopathie si
  baisse rapide d'HbA1c** » — argument *contre* la titration agressive, applicable à V-A6 (sujet âgé
  très au-dessus de sa cible), et **absent des cartes actuelles du nœud**.
- Position transverse (en-tête du fichier) : l'objectif est « **éviter/retarder les complications
  (surtout CV), pas la baisse d'HbA1c en soi** ».

**En clair : sur la question exacte de la passe A, Prescrire est un blanc, pas un contre-argument.**
Le pilier « position critique » de cette passe repose donc sur **Minerva + Méd. Geek + ebmfrance**, pas
sur Prescrire. Demandes en §9. Rappel : **`prescrire 12.pdf` est signalé vide dans le dépôt** et n'a pas
pu être lu.

### 5.2 Médicalement Geek / DragiWebdo

Fil éditorial constant : **anti-surtraitement**, relais critique des recos.

- **DragiWebdo n° 446** (10 juin 2024, revue de la RBP HAS 2024) — vérifié en ligne : sur les cibles, «
  **pas de changement de cible pour l'HbA1c par rapport aux recos de 2013** » ; la critique de l'auteur
  porte sur la metformine 1re ligne « malgré l'absence de bénéfice clinique » et sur le non-remboursement
  des iSGLT2/AR GLP-1 en monothérapie. **Le billet ne traite ni l'ASG ni la désintensification** —
  ne pas lui faire dire davantage.
- **Page thématique « Diabétologie »** du blog (index) — signale, entre autres :
  **« 2018 American College of Physicians — recommandation de dé-prescription si HbA1c < 6,5 % »** et
  **« 2017 Collège des médecins de famille du Canada — déprescription des agents hypoglycémiants chez les
  sujets âgés »**, ainsi que la titration ADA « 10 UI au coucher ou 0,1–0,2 UI/kg/j, avec une
  **augmentation de 2 UI tous les 3 jours** ».
  → Ce sont des **relais** de sources anglo-saxonnes. **`[À VÉRIFIER]` en primaire** avant tout usage :
  le seuil « **< 6,5 %** » est un chiffre décisionnel et il vient ici d'un relais, pas d'une lecture
  primaire. (Il est déjà présent ailleurs dans le projet — nœud `prescription`, gel D1/D2 « < 6,5 %
  déprescrit à tout âge » — donc la cohérence transverse est un point à vérifier, pas à ré-inventer.)
- Éléments déjà consignés dans `E-insuline.md` §3/E5, non re-vérifiés ici et donc toujours
  `[À VÉRIFIER]` : « **surtraitement des âgés : 15–40 % (sur l'HbA1c) / quasi tous (en MCG)** » ;
  « **aucune métrique (HbA1c/MCG) ne prédit fiablement le risque d'hypo** » ; repères « basal-plus si
  basale > 0,5 U/kg, post-prandial > 1,80 g/L, écart coucher-réveil > 0,5 g/L ». **Le troisième repère
  (écart coucher-réveil > 0,5 g/L) est le seul indicateur capillaire de sur-basalisation nocturne cité
  dans tout le corpus** — il mérite une vérification primaire, car il répondrait au garde-fou reporté par
  l'arbitrage A-3.

### 5.3 Minerva — deux analyses ouvertes et lues

**(a) « La fréquence de l'autocontrôle glycémique a-t-elle un impact sur l'équilibre glycémique moyen des
patients diabétiques de type 2 non traités par insuline ? »** (Minerva, **15 février 2021**, analyse
n° 710 ; étude analysée : Xu Y, Tan DH, Lee JY. *Int J Clin Pract* 2019;73:e13357).
Résultats rapportés : 8–14 contrôles/semaine → **HbA1c −0,46 % (IC 95 % −0,54 à −0,39) à 6 mois** et
**−0,20 % (−0,29 à −0,11) à 12 mois**. Conclusion Minerva, verbatim :
> « Cette méta-analyse montre que 8 à 14 contrôles glycémiques par semaine sont associés à une
> amélioration du contrôle glycémique jusqu'à un an chez les patients diabétiques de type 2 **non traités
> par insuline**, en contradiction avec la littérature qui ne montrait pas d'effet après stratification
> pour le nombre de tests réalisés. Cette étude montre cependant **de nombreux biais méthodologiques et
> n'apporte pas d'élément nouveau crédible** au problème de l'autocontrôle glycémique. »

→ **Population non insulino-traitée** : **ne transpose pas** au nœud E. Utile pour une seule chose :
montrer que **même là où une densité d'ASG a été étudiée, Minerva juge le résultat non crédible** —
autrement dit, la question « quelle densité minimale d'ASG ? » (`COLLECTE` de V-A8) n'a probablement
**pas** de réponse EBM, même hors insuline. **Critère de substitution** (HbA1c), horizon 6–12 mois.

**(b) « Quels bénéfices d'une mesure continue de la glycémie chez des patients présentant un diabète de
type 2 sous insuline basale ? »** (Minerva **2022, vol. 21 n° 9** ; Saubry MI, Kaoukab-Raji I, De
Jonghe M, Joly L ; étude analysée : **Aleppo G, Beck RW, Bailey R, et al., « The effect of discontinuing
continuous glucose monitoring in adults with type 2 diabetes treated with basal insulin », *Diabetes
Care* 2021;44:2729-37, DOI 10.2337/dc21-1304**). Conclusion Minerva, verbatim :
> « Cette étude randomisée, contrôlée, multicentrique, conduite sur 14 mois et répartie sur 15 centres
> aux États-Unis semble montrer chez des patients diabétiques de type 2 avec 1 ou 2 injection quotidienne
> d'insuline à longue durée d'action ou durée d'action intermédiaire depuis au moins 6 mois **un effet
> positif d'une mesure continue de la glycémie concernant le risque d'hyperglycémie intermittent à 8
> mois, mais pas à 14 mois, sans réduction significative de l'HbA1c ou du risque d'hypoglycémie.** »
Minerva relève « d'**importantes limites méthodologiques** » (biais d'allocation, biais de sélection lié
aux exigences d'observance, absence de critère cliniquement pertinent).

> ⚠ **C'est la pièce maîtresse de la position critique pour cette passe, et elle est *favorable* au
> parcours sans capteur.** Chez le DT2 sous **1–2 injections** — exactement la population du nœud sans
> capteur — **revenir du capteur au capillaire ne dégrade ni l'HbA1c ni le risque d'hypoglycémie** dans
> le seul essai randomisé qui l'ait testé. Contrepoids direct à l'enthousiasme MCG de la SFD 2025
> (Avis 23), lui-même adossé à des COI dispositifs déclarés.
> **Critères de substitution uniquement, certitude faible** (limites méthodologiques relevées par
> Minerva, un seul essai). `[À VÉRIFIER — primaire non ouverte : PMID de Aleppo 2021 non résolu ici ;
> DOI 10.2337/dc21-1304 tel qu'imprimé par Minerva]`
>
> ⚠ **Ne pas sur-lire** : cette étude teste **l'arrêt** du capteur chez des patients qui en avaient un,
> pas l'équivalence des deux stratégies chez un patient naïf de capteur.

### 5.4 Le contre-point qu'il faut afficher : ce que le capillaire ne voit pas

Source française, présente dans le dépôt : **Hanaire H. et al., « Éducation à l'utilisation pratique et
à l'interprétation de la Mesure Continue du Glucose : position d'experts français », *Méd. Mal. Métab.*,
hors-série n° 1, vol. 11, juin 2017** (`sources/mmm_referentielmcg_ep11.pdf`), §8.

> « Lorsque la variabilité glycémique […] est faible, la MCG permet d'identifier des situations
> caricaturales de franche hyperglycémie ou d'hypoglycémie marquée au premier rang desquelles **le
> phénomène de l'aube** […] et **l'hypoglycémie nocturne** […], **très mal évalués et difficiles à
> différencier par une glycémie capillaire au coucher et au lever**. »

**C'est la description exacte du mécanisme de V-A1** — et elle vient d'une source française. Deux
lectures à afficher ensemble, sans trancher :
- elle **justifie** le garde-fou réclamé par la vignette (le capillaire matinal seul peut faire prendre
  une hypoglycémie nocturne pour un besoin de titration) ;
- elle est écrite par un groupe aux **COI dispositifs lourds et déclarés** (Abbott, Medtronic, Dexcom,
  Roche, Insulet…), dans un document dont l'objet est de promouvoir la MCG. Une source qui vend le
  capteur a intérêt à noircir le capillaire. **Force : position d'experts. Certitude : très faible.**

Autre élément du même document, non exploité jusqu'ici et directement pertinent au sur-traitement :
> « Une étude conduite à partir d'un même set de glycémies capillaires a montré que **seules 30 % des
> décisions prises par les patients étaient portées vers l'augmentation des doses d'insuline, là où 65 %
> des décisions professionnelles conduisaient à une telle augmentation** » (réf. **[71] = Choleau C,
> Albisser AM, Bar-Hen A, Bihan H, Campinos C, Gherbi Z, et al. « A novel method for assessing insulin
> dose adjustments by patients with diabetes ». *J Diabetes Sci Technol* 2007;1:3-7**).
→ **Sur les mêmes chiffres capillaires, le soignant monte la dose deux fois plus souvent que le
patient.** C'est un argument documenté en faveur d'un outil qui affiche explicitement la branche
descendante. `[À VÉRIFIER — primaire Choleau 2007 non ouverte]`

---

## 6. Recommandations internationales — **en second, pour confrontation seulement**

> Couvertes en parallèle par le prompt **OE-A5** du référent. Ce qui suit a été lu sur les versions PMC
> libres et sert **uniquement** à situer les sources françaises. **Ne pas encoder depuis ce §.**

**ADA, *Standards of Care in Diabetes — 2026*, ch. 6 (Glycemic Goals)** — cibles capillaires de l'adulte
non enceinte (Table 6.3) : **préprandial 80–130 mg/dL** ; **pic post-prandial < 180 mg/dL** ; note :
« Postprandial glucose may warrant special attention if A1C goals are not met despite reaching
preprandial glucose goals ». **Aucun grade n'est attaché à ces valeurs dans la table.** Et — point utile
— **aucune recommandation ADA 2026 ne fixe un nombre de contrôles capillaires par jour selon le schéma
insulinique** (vérifié sur le ch. 6 ; le ch. 7 « Technology » n'a pas été ouvert → `[À VÉRIFIER]`).

**ADA 2026, ch. 13 (Older Adults)** — recommandations verbatim, avec **le grade imprimé** :
- **13.13 (B)** — « Select medications with low risk of hypoglycemia in older adults with type 2
  diabetes, specifically for those with hypoglycemia risk factors. »
- **13.14a (B)** — « **Deintensify hypoglycemia-causing medications** (e.g., insulin, sulfonylureas, or
  meglitinides) **or switch to a medication class with low hypoglycemia risk** for individuals who are at
  high risk for hypoglycemia, **using individualized glycemic goals**. »
- **13.14b (E)** — « In older adults with diabetes, **deintensify diabetes medications** for individuals
  for whom **the harms and/or burdens of treatment may be greater than the benefits**, within
  individualized glycemic goals. »
- **13.14c (B)** — « **Simplify complex treatment plans (especially insulin)** to reduce the risk of
  hypoglycemia and polypharmacy and to decrease treatment burden. »
- Texte : « Intensive glycemic management in older adults, particularly those with complex health status,
  with medication plans that increase the risk of hypoglycemia through use of insulin and/or
  sulfonylureas **has been identified as overtreatment, is common in clinical practice, and may increase
  the risk of mortality**. »
- Table des objectifs par statut de santé : **Healthy** A1C < 7,0–7,5 %, **à jeun/préprandial
  80–130 mg/dL**, coucher 80–180 ; **Complex** A1C < 8,0 %, **90–150 mg/dL**, coucher 100–180 ;
  **Very complex** « **Avoid reliance on A1C** », **100–180 mg/dL**, coucher 110–200.

**Ce que la confrontation apprend :**

1. **Sur la fréquence d'ASG, la France est plus prescriptive que l'ADA.** HAS 2011 chiffre (≥ 4/j,
   2–4/j) ; l'ADA 2026 ne chiffre pas. Le chiffre français est **plus vieux** et **moins gradé**, mais
   c'est le seul qui existe.
2. **Sur les cibles préprandiales, l'ADA (80–130 mg/dL) rejoint la SFD 2025 (0,80–1,30 g/L) et non la
   HAS 2011 (70–120 mg/dL).** La borne basse française de 0,70 g/L est l'**exception** — voir §7.2, c'est
   le point le plus important de ce document pour E1.
3. **Sur le post-prandial, tout le monde dit < 1,80 g/L** (HAS 2011, ebmfrance, ADA 2026), **sans grade
   nulle part**. Convergence totale sur la valeur, absence totale de preuve derrière.
4. **Sur la désintensification, l'ADA est la seule à grader** — et elle **grade B** l'acte
   (13.14a, 13.14c) tout en **gradant E** le principe général (13.14b). **Mais elle ne donne aucun seuil
   d'HbA1c** : elle renvoie aux « individualized glycemic goals ». **La SFD 2025 est plus précise que
   l'ADA 2026 sur ce point** (planchers 7 % / 7,5 %). C'est une remarque qui va à l'encontre du réflexe
   habituel — le référentiel français est ici *en avance* sur le point exact qui manque au nœud.
5. **Sur le sujet « very complex », l'ADA rejoint la SFD et la HAS** : on cesse de piloter sur l'HbA1c et
   on pilote sur une **fourchette de glycémie capillaire** (ADA 100–180 mg/dL ; SFD et HAS 1–2 g/L).
   **Trois référentiels sur trois donnent au patient le plus fragile une cible capillaire, sans capteur.**

---

## 7. Tableau de synthèse — qui dit quoi, avec quelle certitude, et où ça diverge

### 7.1 Fréquence d'ASG et remboursement

| Source | Ce qu'elle dit | Force imprimée | **Certitude GRADE** |
|---|---|---|---|
| **HAS 2011** (fiche BUTS, en vigueur par renvoi de HAS 2024) | **≥ 4/j si > 1 injection/j ; 2–4/j si une injection.** ASG « ni systématique ni passive » ; à n'employer que si elle peut changer le traitement | Reco officielle, **aucun grade imprimé** | **très faible** (avis CNEDiMTS, aucun essai cité) |
| **HAS 2024** | ASG « accompagne et idéalement précède » l'insuline (R.81) ; « réalisation d'une ASG » (R.82). **Aucune fréquence** | **AE** | **très faible** |
| **SFD 2025** (Avis 3, 23) | ASG « **indispensable** » sous insuline ; « définir les moments, la fréquence » **sans les chiffrer** | avis d'experts (auto-déclaré) | **très faible** |
| **ebmfrance** (ebm00491, ebm00488) | Sous basale : **glycémie à jeun seule**, **quotidienne** en titration → **hebdomadaire** une fois à la cible ; plus si symptômes d'hypo | **aucun grade** sur ce point | **très faible** |
| **ADA 2026** | Pas de nombre par schéma | — | — |
| **Minerva 2021** | Densité étudiée seulement **hors insuline** ; effet HbA1c réel mais « n'apporte pas d'élément nouveau crédible » | analyse critique | **très faible** (biais) |
| **Remboursement FR** | **200 bandelettes/an** (arrêté du **25 février 2011**) **SAUF insulinothérapie en cours ou prévue à court/moyen terme** — **pas de plafond pour l'insulino-traité**. Lecteur remboursé /4 ans, autopiqueur /an | texte réglementaire | n/a (fait juridique) |
| | *Confirmé indépendamment en décembre 2025* : SFD 2025 Avis 23, « 200 par an pour les patients vivant avec un DT2 **non traités par insuline** » | | |

**Divergence** : **HAS 2011 (≥ 4/j sous basal-bolus) vs ebmfrance (à jeun seule sous basale, puis
hebdomadaire)**. Les deux ne se contredisent pas frontalement — HAS chiffre le schéma multi-injections,
ebmfrance décrit la basale seule — mais **sur la basale seule, HAS dit 2–4/j et ebmfrance dit 1/j puis
1/semaine.** C'est un facteur **7 à 28** d'écart sur la charge de surveillance. **Non tranché.**

### 7.2 Cibles capillaires — ⚠ **quatre bornes différentes, aucune preuve derrière**

| Source | À jeun / préprandial | Post-prandial | Grade imprimé |
|---|---|---|---|
| **HAS 2011** *(= chiffres actuels du nœud)* | **0,70–1,20 g/L** « avant les repas » | **< 1,80 g/L à 2 h** | **aucun** |
| **SFD 2025** Avis 18 | **0,80–1,30 g/L** « au réveil » (pour viser HbA1c < 7 %) | — (non traité) | avis d'experts |
| **ebmfrance** ebm00491 / ebm00488 | **4,0–6,0 mmol/L = 0,72–1,08 g/L** (à jeun, titration) · Tableau : **4–7 mmol/L = 0,72–1,26 g/L** préprandial | **< 10 mmol/L = < 1,80 g/L** + **excursion ≤ 2–3 mmol/L (0,36–0,54 g/L)** | **aucun** |
| **ADA 2026** | **80–130 mg/dL = 0,80–1,30 g/L** | **< 180 mg/dL = < 1,80 g/L** | **aucun** (table) |
| **Sujet âgé dépendant / « très complexe »** — **SFD 21**, **HAS Annexe 3**, **ADA 13** | **1–2 g/L** préprandial (SFD, HAS) · **100–180 mg/dL** (ADA) | — | avis d'experts / AE / — |

> ⚠ **Observation la plus importante de ce document pour l'exigence E1, et je la signale sans la
> trancher.** La borne basse du nœud, **0,70 g/L**, est **exactement le seuil international
> d'hypoglycémie de niveau 1** : SFD 2025, Tableau II, définit le **TBR comme « < 0,70 g/L »**, et le TIR
> comme « 0,70–1,80 g/L ». Autrement dit, **la borne inférieure de `gaj_a_cible` coïncide avec la
> définition de l'hypoglycémie** : viser 0,70 g/L à jeun, c'est viser le seuil d'hypoglycémie. **SFD 2025
> (0,80) et ADA 2026 (0,80) laissent une marge ; HAS 2011 (0,70) n'en laisse aucune.** Trois lectures
> possibles — HAS 2011 est simplement plus ancienne ; ou « avant les repas » n'est pas « au réveil » ; ou
> le nœud a hérité de la borne la moins sûre. **Arbitrage clinique → référent.** Il porte directement sur
> V-A1 : à 0,58 g/L, le patient est *sous* les quatre bornes, quelle qu'on retienne.

**Divergence à afficher dans l'outil** : **HAS 2011 (0,70–1,20) vs SFD 2025 + ADA 2026 (0,80–1,30)**.
Les deux sont françaises et officielles ; la plus récente est la plus prudente en bas et la plus
permissive en haut.
**Convergence** : **< 1,80 g/L à 2 h**, unanime — et **sans aucun grade nulle part**. Le « chiffre sans
source » de V-A4 est en réalité un **chiffre à quatre sources concordantes et zéro preuve**.

### 7.3 Titration : montée **et** descente

| Source | Monter | **Descendre** | Rythme | Grade |
|---|---|---|---|---|
| **HAS 2024 R.87** | « la dose peut être **augmentée ou réduite de 1 ou 2 UI** » selon la GAJ au réveil et l'objectif | **oui — même phrase, même geste** | **tous les 3 jours** | **AE** |
| **SFD 2025 Avis 18** | +2 U (ou **+10 % si > 40 U/j**) | **oui — « augmentée ou réduite de 2 U — ou de 10 % »** | **tous les 3 jours** | avis d'experts |
| **ebmfrance** ebm00491 | **+2 U si GAJ > 6,0 mmol/L 3 matins consécutifs**, *sauf* si une GAJ < 4,0 mmol/L | **GAJ < 4,0 mmol/L : 1 fois sur 3 → rien ; plus souvent → −2 U ; hypo symptomatique → −4 U ; si ça persiste → contacter le soignant** | quotidien | **aucun** |
| **Nœud actuel** | +2 U si GAJ > cible 3 matins, ou +10-20 % si > 40 U | **absent** (la carte « corriger l'hypo » existe mais n'est pas branchée sur la GAJ basse) | tous les 3 jours | — |

> ⚠ **Conclusion de fait : le nœud a encodé la moitié d'une règle que ses trois sources écrivent
> entière.** Les deux référentiels que le nœud cite déjà (HAS R.87, SFD Avis 18) énoncent la descente
> **dans la même phrase** que la montée. L'exigence E1 n'a **aucun besoin de collecte** ; sa seule
> question ouverte (combien d'occurrences ?) est répondue par ebmfrance.
> **Certitude : faible partout.** Aucune de ces règles n'est rattachée à un essai — le protocole de
> Treat-to-Target (Riddle 2003) que le nœud cite est un **protocole d'essai**, pas un critère de jugement.

### 7.4 Désintensification / sur-traitement du sujet âgé — **la question centrale**

| Source | Déclencheur | **Seuil chiffré ?** | Geste | Force | **Certitude** |
|---|---|---|---|---|---|
| **HAS 2024 R.103** | « réévaluer régulièrement », « éviter le surtraitement » | **NON — aucun nombre** | « une désintensification **peut être proposée** » | **AE** | **très faible** |
| **HAS 2024 R.105** | Âgé **fragile ou malade** ET **écart à l'objectif < 0,5 % d'HbA1c** | **OUI, 0,5 %** — mais **sens de l'écart non précisé**, et geste = **arrêt de TOUT médicament**, pas réduction d'insuline | « l'absence de traitement médicamenteux peut être envisagée » | **AE** | **très faible** |
| **HAS 2024 R.102** | SU chez l'âgé | non | prudence + « surveillance accrue » ; ne pas instaurer si alternative | **AE** | **très faible** |
| **SFD 2025 Avis 3** | < 75 ans + EV < 5 ans / comorbidité sévère / IRC sévère / diabète > 10 ans difficile, **sous SU, glinide ou insuline** | **OUI — « ne pas chercher à atteindre < 7 % »** | plancher de cible | avis d'experts | **faible** |
| **SFD 2025 Avis 21** | **> 75 ans « fragile »**, sous SU/glinide/**insuline** | **OUI — cible ≤ 8 % « en restant au-dessus de 7 % »** | plancher de cible | avis d'experts | **faible** |
| **SFD 2025 Avis 21** | **> 75 ans « dépendant »**, **sous insuline** | **OUI — HbA1c < 9 % « en restant au-dessus de 7,5 % »**, et **glycémies capillaires préprandiales 1–2 g/L** | plancher de cible **+ cible capillaire** | avis d'experts | **faible** |
| **SFD 2025 Avis 5 bis** | **Hypoglycémies sous insuline** (effet indésirable invalidant) | non | « la déprescription **doit systématiquement être proposée** » | avis d'experts | **faible** |
| **ebmfrance** | Hypo sévères récurrentes / EV limitée / cognitif / complications vasculaires graves / comorbidité sévère | non | **« niveau cible plus élevé »** | **aucun grade** | **très faible** |
| **Prescrire** | EV courte / affection grave | **8,5–9 %** — mais c'est un seuil de **non-ajout** | contrôle moins strict, **sans médicament** | analyse indépendante | **faible** |
| **ADA 2026 13.14a** | Haut risque d'hypoglycémie | **non** (renvoie aux objectifs individualisés) | **désintensifier ou switcher** | **B** | **modérée** ← *le seul B de tout ce tableau* |
| **ADA 2026 13.14b / 13.14c** | Bénéfice < fardeau / plan complexe | non | désintensifier / **simplifier** | **E** / **B** | très faible / modérée |
| **Méd. Geek (relais ACP 2018)** | HbA1c **< 6,5 %** | **OUI, 6,5 %** | déprescription | relais | `[À VÉRIFIER]` |

> **Réponse à la question 3, sans ambiguïté : le seuil chiffré existe, il est français, et il est dans la
> SFD 2025 — pas dans la HAS.**
> — **HAS R.103** = principe, **zéro nombre**. Le nœud la cite correctement mais elle ne lui donne rien
> d'opérationnel.
> — **SFD Avis 21** = **plancher 7 % (fragile) / 7,5 % (dépendant sous insuline)**, plus une **cible
> capillaire 1–2 g/L** pour le dépendant.
> — La formulation SFD est un **plancher d'HbA1c absolu**, **pas un écart à la cible**. La vignette V-A11
> raisonne en écart. **Les deux modèles doivent être réconciliés par le référent** — ils ne sont pas
> équivalents (un patient à 6,9 % pour une cible de 7 % est *à* sa cible en écart, et *sous* le plancher
> de 7 % en absolu si et seulement si son terrain le place sous Avis 3/21 ; d'où l'importance du garde de
> terrain).
> — **Trois « 0,5 % » circulent** dans le corpus et **ne veulent pas dire la même chose** : R.105 HAS
> (écart à l'objectif), Avis 5 SFD (baisse d'HbA1c insuffisante = inefficacité), et le pas de titration.
> **Ne pas les fusionner.**

### 7.5 Plafond de dose de basale

| Source | Position |
|---|---|
| **HAS 2024** | **aucun plafond**. Seule dose citée : initiale, « en général 0,1 unité/kg par 24 heures » (R.87, AE) |
| **SFD 2025 Avis 19** | **pas un plafond** : « **fortes doses** […] c'est-à-dire **plus de 0,5 U/kg/j** » → **avis spécialisé** + **MCG indiquée** + choix entre 3 options (dont **AR GLP-1 préféré à l'insulinothérapie intensifiée**) |
| **ebmfrance** | **explicitement le contraire d'un plafond** : « la dose varie **entre 10 et 200 unités** », moyenne **70 U** ; à écrire tel quel sur l'ordonnance |
| **ADA** | le repère 0,5 U/kg/j a été **retiré** des Standards en 2025, absent en 2026 (cf. [`preuve-sur-basalisation.md`](../chantier-2026-07-27/preuve-sur-basalisation.md)) |
| **Méd. Geek** | repère « basal-plus si basale > 0,5 U/kg » `[À VÉRIFIER]` |

> **Réponse à la question 4 : aucun référentiel ne définit de plafond.** Le 0,5 U/kg/j est un
> **déclencheur de réévaluation de stratégie**, pas une borne de dose — et l'écart le plus net du corpus
> est entre **la SFD (0,5 U/kg/j = signal fort)** et **ebmfrance (10 à 200 U, sans réserve)**. Cohérent
> avec l'arbitrage déjà rendu en V-A8 (`ACQUIS` : « le seuil n'est ni consensuel ni abandonné, c'est au
> praticien d'arbitrer »). **Rien dans cette collecte ne justifie de revenir dessus.**

### 7.6 Où ça diverge — récapitulatif à afficher dans l'outil

| # | Divergence | Camps | Ce que l'outil devrait faire |
|---|---|---|---|
| **D-1** | **Cible capillaire à jeun** | **HAS 2011 : 0,70–1,20** vs **SFD 2025 + ADA 2026 : 0,80–1,30** | Afficher les deux ; **signaler que 0,70 g/L = seuil d'hypoglycémie** (SFD Tab. II) |
| **D-2** | **Densité d'ASG sous basale seule** | **HAS 2011 : 2–4/j** vs **ebmfrance : 1/j puis 1/semaine** | Afficher les deux ; l'écart est un facteur 7 à 28 |
| **D-3** | **Plancher de désintensification** | **SFD 2025 : 7 % / 7,5 % chiffrés** vs **HAS 2024 : principe sans nombre** vs **ADA 2026 : « individualized », aucun nombre** | Afficher le plancher SFD comme reco officielle FR, en disant qu'il est d'**avis d'experts** et que HAS/ADA ne le confirment pas |
| **D-4** | **Statut du capteur** | **SFD 2025 : MCG « recommandée » sous basale, COI dispositifs** vs **HAS 2024 : « encouragée »** vs **Minerva 2022 : arrêter le capteur ne dégrade rien** | Déjà tracé dans `E-insuline.md` §4 ; **Minerva renforce le camp réservé** |
| **D-5** | **Insuline prandiale** | **ebmfrance : « ne devraient pas être incluses »**, **SFD : dernier recours** vs **HAS R.88 : basal-bolus préférentiel, prémix admis sans réserve** | Déjà tracé (`E-insuline.md` §4 divergence 1) — **cette collecte le confirme mot pour mot** |
| **D-6** | **Plafond de dose** | **SFD : > 0,5 U/kg/j = alerte** vs **ebmfrance : 10–200 U sans réserve** vs **ADA : repère retiré** | Statu quo (arbitrage V-A8 `ACQUIS`) |

---

## 8. `[À VÉRIFIER]`

**Décisionnels (bloquent un encodage) :**

1. `[À VÉRIFIER]` **Statut administratif actuel de la fiche HAS 2011** — le document a été lu
   intégralement et il est **maintenu en vigueur par le renvoi explicite de HAS 2024** ; mais la page
   HAS `c_1045159` n'a **pas** pu être ouverte pour confirmer qu'elle n'est pas archivée depuis. Si la
   fiche a été retirée du site, la France n'a **plus aucune** fréquence d'ASG opposable, ce qui change la
   nature de ce qu'on peut afficher. **À trancher avant d'afficher « ≥ 4/j ».**
2. `[À VÉRIFIER]` **Le plafond de 200 bandelettes/an post-2011** — l'arrêté du 25 février 2011 est cité
   *par la HAS elle-même* (2011) et l'exception insuline est reconfirmée *par la SFD en décembre 2025*
   ; mais **le texte réglementaire n'a pas été ouvert** (ameli.fr renvoie **HTTP 403**), et je n'ai pas
   pu vérifier s'il existe une règle particulière pour un patient **porteur d'un capteur** (une question
   d'usagers l'évoque). N'affecte pas la conclusion « pas de plafond pour l'insulino-traité ».
3. `[À VÉRIFIER]` **Sens de l'écart dans HAS R.105** (« si l'écart à l'objectif est faible, moins de
   0,5 % en valeur absolue d'HbA1c ») — au-dessus, en dessous, ou les deux ? Le texte ne le dit pas.
   **Question clinique, à trancher par le référent, pas par un agent.**
4. `[À VÉRIFIER]` **Le seuil « HbA1c < 6,5 % → déprescrire »** — présent dans le projet (nœud
   `prescription`, gel D1/D2) et relayé par Méd. Geek comme reco ACP 2018, mais **non lu en primaire ici**.
   Si le nœud `insuline` s'aligne sur la SFD (7 % / 7,5 %) et le nœud `prescription` sur 6,5 %, **les
   deux nœuds diront des choses différentes du même patient**. Cohérence transverse à vérifier.
5. `[À VÉRIFIER]` **Aleppo 2021** (*Diabetes Care* 2021;44:2729-37, DOI 10.2337/dc21-1304) — lu **via
   l'analyse Minerva**, **primaire non ouverte**, **PMID non résolu**. C'est la pièce la plus favorable au
   parcours sans capteur : elle **doit** passer au red-team avant tout usage.
6. `[À VÉRIFIER]` **Repère capillaire « écart coucher-réveil > 0,5 g/L »** (attribué à Méd. Geek dans
   `E-insuline.md` §3/E5) — **jamais vérifié en primaire**. C'est **le seul indicateur capillaire de
   sur-basalisation nocturne** de tout le corpus ; s'il tient, il répond au garde-fou reporté par
   l'arbitrage **A-3**.

**Non décisionnels :**

7. `[À VÉRIFIER]` **« Profils 6-7 points »** — la formule est dans le nœud et dans `E-insuline.md`,
   mais **elle n'apparaît dans aucune** des sources françaises lues ici (HAS 2011, HAS 2024, SFD 2025,
   ebmfrance). Origine inconnue.
8. `[À VÉRIFIER]` **Coquille interne de la SFD 2025** : Avis 21 imprime « cible d'HbA1c **≤ 8 %
   (69 mmol/mol)** » alors que l'Avis 3 et le Tableau I impriment « **≤ 8 % (64 mmol/mol)** ». 69 mmol/mol
   correspond à 8,5 %. **C'est une erreur d'unité dans la source** ; retenir **8 %**, ne pas encoder 8,5 %.
9. `[À VÉRIFIER]` **ADA 2026 ch. 7 (Diabetes Technology)** — non ouvert. Le ch. 6 ne donne aucune
   fréquence de BGM ; il reste possible que le ch. 7 le fasse. **Couvert par OE-A5** — ne pas doublonner.
10. `[À VÉRIFIER]` **Choleau 2007** (*J Diabetes Sci Technol* 2007;1:3-7, 30 % vs 65 %) — cité par la
    position d'experts MCG 2017, primaire non ouverte.
11. `[À VÉRIFIER]` **Méd. Geek : « surtraitement des âgés 15–40 % »** et « aucune métrique ne prédit le
    risque d'hypo » — repris de `E-insuline.md` §3, **non re-vérifiés dans cette passe**.

**Ce qui est au contraire *vérifié en primaire* dans cette passe** (PDF locaux lus, double extraction
concordante) : toutes les citations HAS 2024 (R.81-R.89, R.102-R.105, Annexe 2, Annexe 3, périmètre p. 5) ;
toutes les citations SFD 2025 (Avis 3, 5, 5 bis, 18, 18 bis, 19, 21, 21 bis, 23, Tableaux I et II) ;
toutes les citations ebmfrance (ebm00491, ebm00488) ; la fiche HAS 2011 intégrale ; la position d'experts
MCG 2017 ; les deux analyses Minerva ; ADA 2026 ch. 6 et ch. 13 via PMC.

---

## 9. Demandes au référent

**Textes manquants (droit d'auteur — usage interne, invariant 7) :**

1. ⚠ **`prescrire 12.pdf` est signalé VIDE dans le dépôt et reste à re-fournir.** Il est le seul
   « trou » identifié du corpus Prescrire (P1–P11, P13 sont présents ; **P12 manque**).
2. **Prescrire sur l'autosurveillance glycémique / les glycémies capillaires dans le DT2** — s'il existe
   un article dédié. Le corpus P1–P13 n'en contient **aucune trace**, et aucune recherche publique n'a
   permis d'identifier une position Prescrire sur ce point. **Sans ce texte, l'outil affichera une
   « position critique » sur la surveillance qui ne vient pas de Prescrire mais de Minerva et
   d'ebmfrance** — c'est acceptable, mais il faut le savoir et l'assumer.
3. **Prescrire sur la désintensification / le sur-traitement du sujet âgé diabétique** — même constat :
   les notes locales donnent l'échelle de cibles et un seuil de **non-ajout** (8,5–9 %), jamais un seuil
   de **réduction**.

**Arbitrages qui ne peuvent pas être rendus par un agent :**

4. **D-1 (cible à jeun)** — retient-on **0,70–1,20 g/L** (HAS 2011, chiffres actuels du nœud) ou
   **0,80–1,30 g/L** (SFD 2025 + ADA 2026) ? Point dur : **0,70 g/L est le seuil d'hypoglycémie** au sens
   de la SFD elle-même (Tableau II). Cet arbitrage **détermine la borne de l'état `gaj_basse` de E1**.
5. **D-3 (plancher de désintensification)** — encode-t-on les planchers **SFD 7 % / 7,5 %** ? Si oui,
   sous quelle forme : plancher **absolu** gardé par le terrain (formulation SFD) ou **écart à la cible**
   (formulation V-A11) ? Et **cohérence avec le « < 6,5 %» du nœud `prescription`** (point 4 du §8).
6. **Portée de la reco pour V-A5** — HAS R.105 (le seul nombre HAS) **ne couvre pas** le patient de V-A5.
   Le seul appui chiffré est la SFD. Accepte-t-on d'encoder une conduite (« alléger le schéma ») sur un
   **avis d'experts SFD sans confirmation HAS ni ADA** ? La `GRAMMAIRE-NOEUD.md` R5 et la règle de
   granularité de `00-global.md` (« n'encoder une distinction que si l'EBM la soutient ; les gradations
   d'accord d'experts sont **affichées**, pas **pilotantes** ») **s'opposent frontalement** ici à ce que
   le nœud a besoin de faire. **C'est l'arbitrage le plus important de cette passe.** Mon avis, à titre
   consultatif : le **garde-fou de sécurité** (ne pas titrer à la hausse un patient sous le plancher)
   relève de la sécurité et non de la granularité, et la règle de granularité ne devrait pas l'interdire —
   mais c'est un arbitrage de portée, et je ne le rends pas.
7. **Alertes de cibles et garde `mcg_disponible` (E5 / dette I14)** — cette collecte établit que **HAS
   2024 (Annexe 3), SFD 2025 (Avis 21) et ADA 2026 (ch. 13) donnent tous les trois une cible capillaire
   au patient âgé fragile/dépendant, sans capteur** (1–2 g/L préprandial ; 100–180 mg/dL). **Aucune source
   ne conditionne une cible à la possession d'un capteur.** Le garde actuel n'a donc pas d'appui
   documentaire. Confirmation de portée demandée.
8. **La question ouverte du §0 des vignettes** (« A-3 couvre-t-il aussi le défaut `gaj_a_cible` ? ») —
   cette collecte apporte un élément factuel : **la règle de descente est écrite dans HAS R.87, SFD
   Avis 18 et ebmfrance**, avec les occurrences et les unités. Ce n'est donc pas un manque de preuve.
   La décision reste au référent.

---

*Fin de la note. Aucun fichier de contenu, de code ou de schéma n'a été modifié.*
