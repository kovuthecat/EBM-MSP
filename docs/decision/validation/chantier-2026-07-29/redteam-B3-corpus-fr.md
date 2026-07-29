# Red-team B3 — corpus institutionnel français (passe A, nœud `insuline`)

> **Nature** : passe adversariale **agent B3**, chantier 2026-07-29. Vérifie le **corpus FR** invoqué par
> les collectes A2 · A3 · A4 · A5 — la part qu'OpenEvidence ne sait pas traiter (`00-global.md`
> §Règles de sourcing) et où le dépôt s'est déjà trompé deux fois.
>
> **Aucun fichier modifié** hors celui-ci. Ni `content/`, ni `src/`, ni `schema/`, ni les `preuve-A*.md`,
> ni `E-insuline.md`.
>
> **Méthode.** Tous les PDF de `docs/decision/sources/` ont été **ouverts et extraits ici**
> (`pdftotext -layout -enc UTF-8`, recoupé par PyMuPDF), page par page. Là où l'extraction texte échoue
> (figures rastérisées de la SFD 2025), **la méthode a été changée** : rendu de la page en PNG à 200 dpi
> et **lecture visuelle** — cf. §2.0. Deux documents ont été **téléchargés depuis les sites officiels**
> (fiche HAS BUTS 2011 ; guide HAS Parcours de soins 2025) et lus intégralement. Aucune référence,
> aucun chiffre, aucune position n'a été écrit de mémoire.
>
> ⚠ **Force ≠ certitude** (principe référent du 2026-07-27). Chaque verdict distingue **la force de la
> recommandation telle qu'imprimée** (grade AE, « recommandé », « indispensable ») de **la certitude de
> la preuve au sens GRADE**. Sur *tout* ce corpus l'écart est maximal : **force forte, certitude faible
> à très faible**, et c'est ce que l'outil doit afficher.
>
> ⚠ **Droit d'auteur (invariant 7)** : citations **courtes**, résumé critique + référence. **Aucune
> citation de Prescrire** dans ce document (§8 est un résultat négatif, il n'a rien à citer).

---

## §0. Le constat qui domine cette passe

Sur les 9 points demandés, **8 sont VÉRIFIÉS** et l'un d'eux (§2, seuil 0,5 U/kg) **réfute une
conclusion actée du 2026-07-27**. Mais le résultat le plus lourd n'était dans aucune des 9 questions :

> ★ **La HAS a re-publié sa doctrine d'autosurveillance glycémique le 26 juin 2025**, dans le *Guide
> Parcours de soins du patient adulte vivant avec un diabète de type 2* (§5.2, pp. 38-40) — document
> **absent du corpus local** et **cité par aucune des cinq collectes**. A3 et A5 écrivent tous deux que
> « la doctrine ASG de la HAS date de 2011 et n'a pas été révisée depuis ». **C'est faux dans la
> forme** (elle a été reprise et re-validée en 2025), **vrai dans le fond** (les chiffres sont
> identiques). Détail en **§5.2**. C'est exactement le motif d'erreur du 2026-07-27 : *dater une reco
> française d'après le document qu'on a sous la main, pas d'après le plus récent.*

---

## §1. HAS 2024 — R.87, R.103, R.105, périmètre ASG

Source : `sources/strategie_therapeutique_du_patient_vivant_avec_un_diabete_de_type_2_-_recommandations.pdf`
(RBP « Stratégie thérapeutique du patient vivant avec un DT2 », **mai 2024**). PDF **intégralement
extractible** (144 902 caractères, 60 p.).

### 1.1 R.87 — « augmentée **ou réduite** de 1 ou 2 UI, tous les 3 jours » → **VÉRIFIÉ**

**PDF p. 25**, dans R.87 (grade **AE**, imprimé en marge et dans le chapeau « il est recommandé […] de
débuter (grade AE) ») :

> « adaptation des doses d'insuline **tous les 3 jours** en fonction des glycémies au réveil et de
> l'objectif fixé (à titre indicatif, la dose peut être **augmentée ou réduite de 1 ou 2 UI**, sauf cas
> particulier) »

Également vérifiés dans la même recommandation : « définition d'un objectif pour la glycémie à jeun au
réveil selon l'objectif d'HbA1c personnalisé » ; dose initiale « en général de **0,1 unité/kg** par
24 heures » ; « réévaluation du traitement (ADO et/ou insuline) […] en cas d'hypoglycémies fréquentes
ou d'une hypoglycémie sévère ».

**Verdict** : A5 §2.2 est **exact, mot pour mot**. La règle est **écrite symétrique** ; le nœud n'en a
encodé que la moitié montante. **Force : recommandation officielle FR. Certitude : `tres_faible`**
(grade AE = accord d'experts, aucun essai cité à l'appui de ce pas de titration).

### 1.2 R.103 — désintensification → **VÉRIFIÉ**, et **aucun chiffre**

**PDF p. 29**, grade **AE** :

> « Il est recommandé de **réévaluer les objectifs glycémiques régulièrement**. Il faut **éviter le
> surtraitement** et **une désintensification peut être proposée** pour réduire le risque iatrogénique,
> en particulier d'hypoglycémies (grade AE). »

**Verdict** : la lecture d'A5 (« juste sur le principe, **vide sur le déclencheur** ») est **confirmée** :
ni seuil, ni ampleur de réduction, ni signal déclencheur. **Force forte / certitude `tres_faible`.**

### 1.3 R.105 — écart < 0,5 % → **VÉRIFIÉ**, avec la réserve d'A5

**PDF p. 29**, grade **AE** :

> « Pour les personnes âgées dites « fragiles » ou « malades », et **si l'écart à l'objectif est faible
> (moins de 0,5 % en valeur absolue d'HbA1c)**, **l'absence de traitement médicamenteux** peut être
> envisagée en maintenant une surveillance de l'équilibre glycémique (grade AE). »

**Verdict** : R.105 **porte bien un écart chiffré (< 0,5 %)**. Et A5 a raison sur les deux réserves :
(a) le texte **ne précise pas le sens** de l'écart ; (b) la conclusion porte sur l'**arrêt total du
traitement médicamenteux**, **pas** sur une réduction de dose d'insuline. Pour un patient à 1,7 %
en-dessous de sa cible, **R.105 ne s'applique pas telle qu'écrite**. ⚠ Voir **§5.2** : la HAS 2025 y
ajoute un signal que 2024 n'a pas.

### 1.4 « HAS 2024 exclut explicitement l'ASG de son périmètre (p. 5) » → **VÉRIFIÉ**

**PDF p. 5** (A5 donne la bonne page) :

> « Cette mise à jour ne concerne pas les recommandations portant sur : ‒ la redéfinition des objectifs
> glycémiques ou **la place de l'autosurveillance glycémique qui restent maintenues selon les
> recommandations de bonne pratique en cours** (voir annexe pour rappel) »

**La phrase existe, à la page annoncée.** Contrôle complémentaire : « autosurveillance » n'apparaît que
**5 fois** dans toute la RBP (p. 5 ; R.52 p. ~21 ; R.81, R.82, R.87), **jamais avec une fréquence ni un
seuil capillaire**. Confirmé.

⚠ **Correction de portée à porter au dossier.** A5 §2.1 écrit que la HAS « renvoie » et que « son renvoi
maintient en vigueur un texte de 2011 ». **L'annexe visée par ce renvoi est l'Annexe 3** (p. 42), qui
**ne rappelle que les cibles d'HbA1c de 2013** — elle **ne nomme nulle part la fiche BUTS de 2011**, et
aucune annexe de la RBP 2024 ne la cite (Annexe 1 vérifiée p. 37 : liste des travaux HAS liés, la fiche
ASG **n'y figure pas**). **L'identification de la fiche 2011 comme « le texte ASG en vigueur » était donc,
au 2026-07-29, une inférence d'agent, non un énoncé de la HAS.** Elle est **désormais démontrée par
ailleurs** — c'est la HAS **2025** qui la cite explicitement (§5.2). Le raccourci était juste ; il ne
l'était pas encore *par cette source-là*.

*Confirmé au passage* : Annexe 2 (p. 38) — la reco indexée la plus récente analysée est **ADA 2023**
(item 6). A5 §2.1 est exact.

---

## §2. SFD 2025 — Avis 3, 18, 19, 21, 23

Source : `sources/SFD 2025.pdf` — Darmon P, Bauduceau B, Bordier L, Detournay B, Dupuy O, Gourdy P,
et al., *Méd. Mal. Métab.* 2025;19(8):630-662, DOI 10.1016/j.mmm.2025.10.002. **33 pages.**

### 2.0 ⚠ « PDF partiellement non extractible » (alerte A2) → **VÉRIFIÉ, et circonscrit**

Le PDF est **chiffré** (AES-256, `copy:no`) mais **le texte des Avis est intégralement extractible**
(120 079 caractères utiles). **Ce qui ne l'est pas, ce sont les figures** : les algorithmes (Figures
6 à 10) sont des **images rastérisées** de ~3 427 × 1 921 px. Mesure page par page : p. 23 ne rend que
**307 caractères** (contre 2 200-6 000 ailleurs) — c'est la double page Figures 6-7.

**Changement de méthode appliqué** : rendu PNG 200 dpi + lecture visuelle des pages porteuses de
figures. **Figure 9** (« Échec de bithérapie par metformine et insuline basale », p. 26 / journal 655)
lue : elle porte « *Avec titration sur la glycémie à jeun* » et l'arbre à trois branches, **et aucun
seuil chiffré supplémentaire**. Aucune information décisionnelle n'est donc perdue par l'extraction
texte — **mais la vérification ne pouvait pas le savoir sans regarder.**

### 2.1 Avis 18 — titration : « ± 2 U, ou ± 10 % au-delà de 40 U/j » → **VÉRIFIÉ**

**PDF pp. 24-25** (journal 653-654) :

> « pour obtenir une HbA1c < 7 % (53 mmol/mol), il faudra viser une **glycémie au réveil entre 0,80 g/L
> et 1,30 g/L** et « titrer » l'insuline basale dans ce sens (par exemple : **adaptation des doses
> d'insuline tous les trois jours** en fonction des glycémies au réveil, la dose pouvant être
> **augmentée ou réduite de 2 U — ou de 10 % chez les patients traités par de fortes doses d'insuline
> basale, par exemple supérieures à 40 U/j**). »

Également : dose de départ « **6 à 10 U/jour ou 0,1 à 0,2 U/kg/jour** ». **Verdict** : exact, y compris
la symétrie montée/descente et la cible **0,80-1,30 g/L** — qui **n'est pas** celle du nœud (0,70-1,20).
**Force : prise de position d'experts. Certitude : `faible`/`tres_faible`** — la SFD **auto-déclare**
que ses propositions « relèvent de l'avis d'experts », et **aucun avis SFD ne porte de grade**.

### 2.2 Avis 19 — le seuil de **0,5 U/kg/j** → **VÉRIFIÉ VERBATIM · RÉFUTE la conclusion du 2026-07-27**

**PDF p. 25** (journal 654) :

> « En cas de résultats insuffisants sous insulinothérapie basale + metformine (**HbA1c > objectif
> malgré des glycémies à jeun dans la cible** ou HbA1c > objectif et glycémie à jeun au-dessus de la
> cible **malgré de fortes doses d'insuline basale, c'est-à-dire plus de 0,5 U/kg/j**), l'avis d'un
> endocrinologue-diabétologue est souhaitable. Si elle n'a pas été mise en place jusque-là, une mesure
> en continu du glucose est indiquée. »

**A2 a raison. Le dossier `chantier-2026-07-27/preuve-sur-basalisation.md` a produit un faux négatif** :
§2.5 (« aucun document SFD énonçant ce seuil n'a été retrouvé »), §6-10 (« recherche négative ») et la
proposition **P4** (« retirer l'attribution SFD ») sont **factuellement fausses**.

**Cause tracée, et elle est la cause annoncée par le prompt.** `redteam-sur-basalisation.md` §7-4 écrit :
« *Prise de position SFD 2025, PDF officiel — téléchargé (1,6 Mo) mais flux PDF compressé non
extractible par l'outil de lecture* ». L'agent a téléchargé une **copie web**, n'a pas su l'ouvrir, et a
conclu à l'absence — **alors que `sources/SFD 2025.pdf` (15 Mo) était dans le dépôt depuis le 23 juillet
et s'extrait sans difficulté.** « Je n'ai pas trouvé » a été écrit « ça n'existe pas ».

**Ce que ça ne change pas** : la SFD **n'en fait pas un plafond**. C'est un **descripteur de « fortes
doses »** qui déclenche *avis spécialisé + MCG + choix entre trois options*. L'analyse de fond du
2026-07-27 (grade E, post-hoc Umpierrez non pré-spécifié, retiré par l'ADA en 2025) **tient**. Ce qui
tombe, c'est **l'attribution** : le repère est **retenu par la reco française de référence du nœud, en
décembre 2025**. La phrase affichée à l'utilisateur (« retiré des Standards ADA en 2025 mais reste
retenu par l'AACE ») est donc **incomplète**.

### 2.3 Avis 21 — planchers d'HbA1c et cible capillaire du sujet âgé → **VÉRIFIÉ**

**PDF p. 27** (journal 656) :

> — « **fragiles** » : cible d'HbA1c ≤ 8 %, « **en restant au-dessus de 7 % (53 mmol/mol) en cas de
> traitement par SU, glinide ou insuline** pour limiter le risque d'hypoglycémie. »
> — « **dépendantes et/ou à la santé très altérée** » : « des **glycémies capillaires préprandiales
> comprises entre 1 et 2 g/L** et/ou une HbA1c < 9 % (75 mmol/mol) sont recommandées, **en restant
> au-dessus de 7,5 % (58 mmol/mol) en cas de traitement par insuline**. »

Note 8 du Tableau I confirme « entre **1,00 et 2,00 g/L** ». Avis 21 bis (p. 27) confirme la vigilance
« minoré en gardant une HbA1c > 7,5 % » et la déprescription à envisager.

**Verdict** : les trois chiffres annoncés par A5 (**7 %**, **7,5 %**, **1-2 g/L préprandial**) sont
exacts et attachés aux bons profils. **Force : « recommandé ». Certitude : `tres_faible`** (avis
d'experts, auto-déclaré ; aucun essai ne randomise un plancher d'HbA1c).

⚠ **Nuance à porter au dossier** : A5 (§0, ligne V-A5) écrit que « la cible capillaire du sujet âgé
**fragile** est explicitement donnée sans capteur par HAS 2024 (Annexe 3) *et* par SFD Avis 21 ». Vérifié
sur pièces : **le 1-2 g/L préprandial est attaché, dans les deux textes, à la catégorie
« malades »/« dépendantes »**, pas à « fragiles » (HAS 2024 Annexe 3, p. 42 : « fragiles » → ≤ 8 %
d'HbA1c **seulement** ; « malades » → ≤ 9 % **et/ou glycémies capillaires préprandiales entre 1 et
2 g/l»). L'appui existe, il ne porte pas sur le profil annoncé.

### 2.4 Avis 23 — MCG remboursée et **primoprescriptible par le généraliste** → **VÉRIFIÉ**

**PDF p. 30** (journal 659) :

> « la mesure en continu du glucose interstitiel […] peut être prescrite chez les patients vivant avec
> un DT2 traités par insulinothérapie intensifiée (au moins 3 injections d'insuline par jour ou par
> pompe, quel que soit le niveau d'HbA1c) ; elle peut également être prescrite chez les patients […]
> traités par **insulinothérapie non intensifiée (< 3 injections par jour) dont l'équilibre glycémique
> est insuffisant**. Dans les conditions actuelles de prise en charge, **la primoprescription de la
> mesure en continu du glucose peut être réalisée par le médecin généraliste chez les patients traités
> par une ou deux injections d'insuline**, alors qu'elle relève du médecin spécialiste chez le patient
> traité par un schéma insulinique intensifié. »

**L'affirmation d'A3 est exacte, y compris dans sa conséquence de périmètre** : un DT2 sous 1-2
injections mal équilibré est éligible au capteur et **son généraliste peut le primoprescrire**. La
branche « sans capteur » du nœud décrit donc souvent une situation **réversible en consultation**.
**Corroboré indépendamment** par la HAS : *Parcours de soins 2025* §5.2.3.2 (p. 40) reprend les mêmes
deux indications d'après l'**avis CNEDiMTS du 23 juillet 2024** — donc **deux sources institutionnelles
concordantes, dont une HAS**.

Vérifiés aussi dans Avis 23 : « **L'ASG est indispensable chez les patients vivant avec un DT2 : traités
par insuline** […] » ; « définir les moments, la fréquence, les objectifs glycémiques et les décisions à
prendre » ; « les bandelettes […] sont remboursées à hauteur de **200 par an** pour les patients vivant
avec un DT2 **non traités par insuline** » ; EHPAD : « les patients traités par insuline **sont souvent
surtraités avec de fréquentes hypoglycémies, notamment la nuit** » ; cétonémie sous iSGLT2 + **10
électrodes/an**.

⚠ **La SFD 2025 ne donne aucune fréquence chiffrée d'ASG**, pour aucun schéma — **confirmé** par
balayage du texte intégral (aucune occurrence de « x par jour » rattachée à l'ASG). A3 §7.2 et A5 §3.2
sont exacts.

### 2.5 Avis 3 → **VÉRIFIÉ**

**PDF p. 3** (journal 632) : « dans ces situations, si les patients sont traités par sulfamide
hypoglycémiant (SU), glinide ou insuline, **il est recommandé de ne pas chercher à atteindre une valeur
d'HbA1c < 7 % (53 mmol/mol)** pour minimiser le risque hypoglycémique » ; et « l'ASG […] **devient
indispensable en cas de traitement par insuline** ». **Le plancher de 7 % existe donc avant 75 ans**,
conditionné au **traitement**, pas à l'âge — lecture d'A5 confirmée.

---

## §3. Tableau II de la SFD — le seuil d'hypoglycémie vaut-il 0,70 g/L ? → **VÉRIFIÉ**

**PDF p. 5** (journal 634), TABLEAU II, « Objectifs individualisés de temps dans la cible […] chez les
patients vivant avec un DT2 utilisant un dispositif de mesure en continu du glucose (selon Battelino
et al. *Diabetes Care* 2019;42:1593-1603) » — en-têtes de colonnes, verbatim :

> Temps passé dans la cible (TIR) : **0,70–1,80 g/L** · Temps passé **en dessous de la cible (TBR)** :
> **< 0,70 g/L** | **< 0,54 g/L** · Temps au-dessus (TAR) : > 1,80 g/L | > 2,50 g/L

**La divergence D-1 d'A5 est fondée** : **0,70 g/L est bien le seuil d'hypoglycémie de niveau 1** dans
la source française de référence, et c'est aussi la **borne basse de la cible** du nœud (`gaj_a_cible`
0,70-1,20 g/L). Une valeur à la borne basse de la cible **est** une hypoglycémie au sens du Tableau II.

⚠ **Deux nuances que le dossier doit porter** : (a) le Tableau II est un tableau **MCG** (glucose
interstitiel), pas capillaire — l'inférence vers le capillaire est raisonnable mais n'est pas écrite ;
(b) la coïncidence n'est **pas une bizarrerie SFD** : c'est la définition **du consensus international**
(Battelino 2019 : hypo niveau 1 < 70 mg/dL, TIR commençant à 70). Ce n'est donc pas une erreur d'une
source, c'est une propriété du référentiel — mais elle rend le libellé du nœud ambigu **et ça, c'est un
vrai problème de conception**.

---

## §4. ebmfrance — règle de descente graduée et intervalle cible

Source : `sources/Insulinothérapie dans le diabète de type 2 _ ebmfrance.pdf` (ebm00491, Duodecim,
MàJ 27/05/2022, contextualisation ebmfrance 26/06/2024 ; 8 p., intégralement extractible).

### 4.1 La règle de descente → **VÉRIFIÉ**, mais **en deux morceaux**

Bloc « auto-ajustement » (p. 4 du PDF), verbatim :

> « **si la glycémie à jeun est inférieure à 4,0 mmol/l** — 1 fois sur 3 : pas de modification du
> dosage ; — plus fréquemment : réduire la dose de 2 unités ; — si les glycémies à jeun restent basses,
> contacter un(e) infirmier(e) »

Tableau 1 (p. 5 du PDF), verbatim :

> « le patient augmente la dose de 2 unités à domicile (**sauf si la glycémie à jeun est au moins une
> fois inférieure à 4,0 mmol/l**). **Si le patient fait des hypoglycémies symptomatiques, réduire la
> dose de 4 unités.** Si le patient fait des hypoglycémies récurrentes, il doit contacter son centre de
> traitement. »

**Verdict** : la règle annoncée par A2 et A5 (« 1 fois sur 3 : ne rien changer ; plus souvent : −2 U ;
hypoglycémie symptomatique : −4 U ») est **exacte**, mais ⚠ **elle n'est pas écrite d'un seul tenant** :
les deux premières clauses viennent du bloc d'auto-ajustement, la troisième du Tableau 1, et **le −4 U
n'est pas conditionné à la GAJ < 4,0 mmol/L** — il est conditionné à l'**hypoglycémie symptomatique**,
quelle que soit la glycémie à jeun. Un encodage qui les fusionnerait en une règle unique
« GAJ < 0,72 g/L → … → −4 U » **déformerait la source**. À dire tel quel dans l'argumentaire.

### 4.2 L'intervalle cible → **VÉRIFIÉ**, et la fiche est **contradictoire avec elle-même**

- « la **plage cible de 4,0 à 6,0 mmol/l** pour la glycémie à jeun » (p. 7) → **0,72-1,08 g/L** ;
- « Si la glycémie à jeun ne se situe pas dans l'**intervalle cible (5,0 à 6,0 mmol/l)**, l'HbA1c cible
  de 53 mmol/l (7,0 %) ne sera pas atteinte » (p. 4) → **0,90-1,08 g/L** ;
- seuils opérants de l'algorithme : **> 6,0** → +2 U ; **< 4,0** → −2 U.

**Le 0,72-1,08 g/L annoncé est bien dans la fiche** — c'est la borne opérante de l'algorithme. Mais
**la même fiche imprime deux bornes basses différentes** (4,0 et 5,0 mmol/L). A2 §2 signale déjà
l'incohérence ; **elle est réelle et je la confirme sur pièce.** La borne **haute** (6,0 mmol/L =
1,08 g/L) est, elle, constante.

**Certitude** : les grades **B** de la fiche portent sur **deux autres énoncés** (association ADO +
insuline du soir ; hiérarchie analogues lents vs NPH). **Ni la cible capillaire, ni l'algorithme
d'auto-ajustement, ni la fréquence d'ASG ne portent de grade** → certitude `faible`/`tres_faible`,
**force** forte (« essentiels à la réussite »).

Vérifié également dans `Traitement global et suivi du DT2 _ ebmfrance.pdf` (ebm00488), Tableau 1 :
« **4 à 7 mmol/l avant les repas ; < 10 mmol/l après les repas** » → **0,72-1,26** et **< 1,80 g/L** —
**troisième** intervalle préprandial du corpus, et confirmation indépendante du 1,80 g/L post-prandial.
Tableau 1 **sans grade**.

---

## §5. Fiche HAS « BUTS » avril 2011 — et le document que personne n'a vu

### 5.1 La fiche 2011 → **VÉRIFIÉ intégralement** (téléchargée et lue)

**Existe, à cette date, sous ce titre.** *L'autosurveillance glycémique dans le diabète de type 2 : une
utilisation très ciblée*, collection **Bon usage des technologies de santé**, **avril 2011**, validée par
la **CNEDiMTS**. Page HAS `r_1438006` (« mis en ligne le 14 avr. 2011 », « mis à jour le 11 janv. 2013 »,
**aucun bandeau de retrait, d'archivage ou de remplacement**).
PDF : `has-sante.fr/upload/docs/application/pdf/2011-04/autosurveillance_glycemique_diabete_type_2_fiche_de_bon_usage.pdf`

**Les rythmes annoncés y sont, verbatim**, colonne « **Rythme d'ASG suggéré** (dans les cas où cette
surveillance est indiquée) », ligne « Insulinothérapie en cours » :

> « **Au moins 4 par jour** si l'insulinothérapie comprend **plus d'une injection** d'insuline par jour ·
> **2 à 4 par jour** si elle n'en comprend qu'une »

Et, dans la **même case** : « **Objectifs glycémiques : avant les repas, 70 à 120 mg/dL ; en
post-prandial (2 heures après le repas) : < 180 mg/dL.** »

**Aucun grade n'est imprimé** dans le document — ni A/B/C, ni AE. Mention de méthode, verbatim : « ce
document a été élaboré à partir des études disponibles et des avis de la CNEDiMTS/CEPP ». **Aucun essai
n'est cité.** → **Force : recommandation officielle française. Certitude : `tres_faible`.** La
qualification d'A3 et A5 (« accord d'experts, rythme *suggéré* ») est **exacte au mot près**.

### 5.2 ★ **Toujours en vigueur — et re-publiée le 26 juin 2025** (finding non demandé)

**HAS, *Parcours de soins du patient adulte vivant avec un diabète de type 2*, guide, validé par le
Collège le 26 juin 2025, mis en ligne le 16 juillet 2025, 113 p.**
(`has-sante.fr/jcms/p_3634754/` · PDF `…/2025-07/parcours_de_soins_du_patient_adulte_vivant_avec_un_diabete_de_type_2_-_guide_2025-07-15_16-42-8_797.pdf`)
**Téléchargé et lu ici. Absent de `docs/decision/sources/`. Cité par aucune collecte de la passe A.**

Son **§5.2 « Autosurveillance glycémique » (pp. 38-40)** ouvre par : « **Cette partie reprend notamment
les éléments de la fiche de bon usage sur l'autosurveillance glycémique dans le DT2 (35)** » — avec le
lien vers le PDF de 2011, et la fiche 2011 en **référence bibliographique n° 35**. Puis, verbatim :

> « Patient insulinotraité […] **Rythme de surveillance : au moins 4 par jour si l'insulinothérapie
> comprend plus d'une injection d'insuline par jour ; 2 à 4 par jour si elle n'en comprend qu'une.**
> **Objectifs glycémiques** (à adapter selon l'HbA1c cible, cas général à adapter chez la personne âgée
> ou fragile) : **avant les repas : 0,70 à 1,20 g/l** ; **en post-prandial (2 heures après le repas) :
> < 1,80 g/l.** »

**Trois conséquences, toutes favorables au nœud et aucune anticipée par les collectes :**

1. **La question V4 d'A3 (« la fiche 2011 est-elle toujours en vigueur ? ») est LEVÉE** : la HAS la cite
   et la reprend dans un guide de **juin 2025**. Ce n'est plus une inférence.
2. **Les deux seuils capillaires du nœud ne sont plus adossés à un texte de 2011** : ils sont écrits
   **en g/L, à l'identique, dans une reco HAS de 2025**. `gaj_a_cible` **0,70-1,20 g/L** et le
   **< 1,80 g/L à 2 h** ont une source officielle française **actuelle**. C'est la meilleure nouvelle de
   cette passe pour l'ancrage FR du nœud — et **la formulation « la doctrine ASG de la HAS date de 2011
   et n'a pas été révisée depuis » (A3 §7.1, A5 §2.1/§2.3) est à corriger**.
3. **HAS 2025 ajoute un signal de sur-traitement que HAS 2024 n'a pas** (§8.1, p. 66), verbatim :
   « Réévaluer régulièrement les objectifs glycémiques, éviter le surtraitement et proposer, quand cela
   est possible, une **désintensification** […] **La baisse de l'HbA1c survenant en l'absence
   d'intensification du diabète évoque un surtraitement et l'influence délétère de la comorbidité, en
   particulier la dénutrition.** » — R.105 y est reprise à l'identique (< 0,5 %). ⚠ **Ce déclencheur
   (HbA1c qui baisse sans qu'on ait intensifié) est exactement ce qui manquait à V-A5**, et il est
   **absent des cinq collectes**. Force : reco officielle FR 2025. Certitude : `tres_faible` (aucun
   essai cité).

**Le guide 2025 ne porte en revanche AUCUNE règle de titration chiffrée** (« 1 ou 2 UI / 3 jours » reste
dans HAS 2024 R.87) : vérifié, zéro occurrence.

---

## §6. Remboursement — le plafond de 200 bandelettes exclut-il les insulino-traités ? → **VÉRIFIÉ, 3×**

1. **HAS 2011**, verbatim : « **Par arrêté ministériel du 25 février 2011**, la prise en charge des
   bandelettes d'autosurveillance glycémique par l'Assurance maladie est **limitée à 200 par an**, **à
   l'exception des patients pour lesquels une insulinothérapie est en cours ou prévue à court ou moyen
   terme.** » Également : lecteur remboursable **tous les 4 ans** (garanti 4 ans min.), autopiqueur
   **tous les ans**.
2. **HAS 2025**, §5.2.3.1 (p. 40), verbatim : « limitée à **200 par an**, **à l'exception des patients
   pour lesquels une insulinothérapie est en cours ou prévue à court ou moyen terme et où les
   bandelettes sont remboursées dans les conditions habituelles** ».
3. **SFD 2025**, Avis 23 : « remboursées à hauteur de **200 par an** pour les patients vivant avec un
   DT2 **non traités par insuline** ».

**Verdict** : **oui, sans ambiguïté, et confirmé à quatorze ans d'intervalle par trois sources dont deux
HAS.** La conséquence tirée par A3 et A5 est correcte : **l'obstacle à une densification de l'ASG chez
l'insulino-traité n'est pas économique.** Le prescripteur doit par ailleurs préciser « **le nombre
d'autosurveillances à réaliser par jour ou par semaine, et non le nombre de boîtes à délivrer** »
(HAS 2011 **et** HAS 2025 §5.2.3.1) — obligation confirmée deux fois.

⚠ `[À VÉRIFIER]` **maintenu, et il reste le même qu'en A3 (V6)** : **le texte de l'arrêté du 25 février
2011 n'a pas été ouvert au JO/Légifrance** ici non plus. Trois sources institutionnelles le citent de
façon concordante, dont une de 2025 ; c'est solide, ce n'est pas la source primaire.

---

## §7. SFD 2017, hors-série MCG — §8.6.3 → **VÉRIFIÉ sur le fond, à reformuler sur la forme**

Source : `sources/mmm_referentielmcg_ep11.pdf` — **identité confirmée par lecture de la page de titre** :
*Éducation à l'utilisation pratique et à l'interprétation de la Mesure Continue du Glucose : position
d'experts français*, **Hors-série n° 1, vol. 11, juin 2017**, *Médecine des maladies Métaboliques*
(Hanaire H. et al.). **Ce n'est pas le Collège de la Médecine Générale** — l'erreur d'étiquetage relevée
au nœud D est **confirmée pour la troisième fois**. COI dispositifs massifs et déclarés (Abbott,
Medtronic, Dexcom, Roche…) sur la quasi-totalité des auteurs.

**§8.6.2 et §8.6.3 sont bien sur la MÊME PAGE** (PDF p. 30 = journal S24), en deux colonnes voisines.
Chapitre 8 = « Analyse rétrospective » ; §8.6 = « Apport de la MCG à l'ajustement » — **contexte
dominant DT1 / pompe** (le texte raisonne en « débit basal »).

**§8.6.2**, verbatim : « le phénomène de l'aube […] et l'hypoglycémie nocturne, **très mal évalués et
difficiles à différencier par une glycémie capillaire au coucher et au lever**. Il est alors plus facile
de **modifier l'insulinothérapie basale** en conséquence ».

**§8.6.3**, verbatim : « En cas d'**hypoglycémie de fin de matinée, d'après-midi, de fin de soirée ou de
début de nuit**, il convient de se poser la question d'un **bolus prandial trop fort ou souvent trop
tardif** […] De la même façon, **la période (0-4 heures) peut être influencée par le bolus prandial du
soir**, surtout lorsque les repas sont pris tardivement (après 20 heures). Il convient dans ce cas
d'**avancer ou de réduire le bolus prandial plutôt que de baisser le débit basal** ».

**Verdict** : les deux citations d'A4 sont **exactes**, sur la même page. **Deux corrections de
formulation, dans le sens de la prudence :**

- ⚠ **« il écrit la table créneau horaire → composant » est trop fort.** Le §8.6.3 donne une **liste
  partielle** (fin de matinée / après-midi / fin de soirée / début de nuit → bolus prandial) et un
  contre-cas (0-4 h). **Il ne publie aucune table à quatre créneaux**, et aucun mapping exhaustif. A4
  l'écrit d'ailleurs correctement dans son §3 (« assortie de son contre-exemple ») ; c'est le résumé qui
  durcit.
- ⚠ **« se contredit » est inexact.** §8.6.2 traite de l'**identification** des épisodes nocturnes,
  §8.6.3 de la **détermination des besoins basaux jour/soirée** ; les auteurs énoncent l'attribution
  **et son exception, délibérément**. C'est une **réserve assumée**, pas une contradiction interne — et
  c'est plus fort ainsi : **la source elle-même dit que le créneau nocturne est ambigu.** La conclusion
  d'A4 (ne pas gater sur l'heure, niveau `tres_faible`/`faible`) est **confirmée**, par un chemin plus
  propre.

Vérifié aussi : `pdp_pompe_insuline_externe_mcg.pdf` = **Prise de position SFD PARAMÉDICAL 2022**
(147 p.) — étiquetage d'A3/A4 **correct** ; il porte bien « les objectifs concernant les glycémies
postprandiales mesurées en capillaire sont **< 1,80 g/l, une à deux heures après le début du repas** »
et le constat « la **période nocturne définie selon des critères propres à chaque étude** ».

---

## §8. Prescrire — zéro occurrence → **VÉRIFIÉ**

`sources/prescrire-dt2.md` (17 ko, P1→P13), comptage exhaustif, insensible à la casse :

| Terme | Occurrences |
|---|---|
| autosurveillance | **0** |
| ASG | **0** |
| bandelette | **0** |
| capillaire | **0** |
| surveillance | **0** |
| désintensification | **0** |
| déprescription / deprescription | **0** |

(« glycémi\* » : 12 · « hypoglyc\* » : 7 — tous dans des contextes de cibles d'HbA1c et d'effets
indésirables, aucun sur l'instrument de mesure.)

**A3 et A5 disent vrai.** ⚠ **Et c'est une absence dans NOTRE corpus, pas une absence de position de
Prescrire** — la distinction est la même que celle qui a produit le faux négatif SFD, et elle doit être
écrite partout sous cette forme.

> **Ce qu'il faut en écrire, et qui n'est pas neutre.** Sur son **propre instrument de mesure**, le nœud
> n'a **aucune contre-expertise indépendante**. Les deux sources qui portent tous les chiffres —
> fréquences, seuils capillaires, indications — sont **institutionnelles** (HAS, SFD), et la SFD est
> **aussi** la source qui pousse le capteur, avec des **COI dispositifs massifs et déclarés** (Abbott,
> Dexcom, Medtronic). Le seul contrepoids réellement indépendant du corpus est **Minerva** (Aleppo 2021 :
> revenir du capteur au capillaire chez le DT2 sous 1-2 injections **ne dégrade ni l'HbA1c ni les
> hypoglycémies**), plus **ebmfrance**, seule source FR qui autorise à *diminuer* la surveillance.
> **Ce déséquilibre doit être écrit dans l'argumentaire, pas seulement dans une demande au référent.**

---

## §9. Hygiène du corpus

### 9.1 `NICE 2023.pdf` → **A1 et A4 ont raison : c'est NG238, pas NG28**

Page de titre, verbatim : « **Cardiovascular disease: risk assessment and reduction, including lipid
modification — NICE guideline — Published: 14 December 2023 — www.nice.org.uk/guidance/ng238** ».
**52 occurrences de « NG238 », 0 de « NG28 », 0 de « insulin », 0 de « self-monitoring ».**

**Le fichier n'est pas « mal nommé » au sens strict** — c'est bien une *NICE guideline* de *2023*. Il est
**dangereusement nommé** : rien dans `NICE 2023.pdf` ne dit qu'il s'agit des **lipides**, et sa date de
dépôt (27 juillet, avec `statin-intolerance-pathway.pdf`) montre qu'il a été collecté pour le **nœud F
(statine)**. **Recommandation : renommer `NICE-NG238-2023-cardiovascular-lipids.pdf`.** Pour mémoire :
HAS 2025 cite, elle, **NG28 (2020)** en référence n° 38 — le vrai référentiel diabète, **absent du
dépôt**.

### 9.2 Pièce non extractible

`10_petites_astuces_anti-sédentarité.pdf` : **0 caractère extractible** (PDF image, sans couche texte).
Hors sujet pour le nœud E ; à signaler pour le nœud H, où il ne pourra pas être interrogé par recherche
texte.

### 9.3 Pièces dont l'identité a été contrôlée et est **conforme** à l'étiquetage des collectes

`strategie_therapeutique…pdf` (HAS RBP mai 2024) · `SFD 2025.pdf` (Darmon et al., *Méd Mal Métab*
2025;19(8):630-662) · `mmm_referentielmcg_ep11.pdf` (SFD, MCG, hors-série 2017 — **pas le CMG**) ·
`pdp_pompe_insuline_externe_mcg.pdf` (SFD Paramédical 2022) · `Insulinothérapie…ebmfrance.pdf`
(ebm00491) · `Traitement global…ebmfrance.pdf` (ebm00488) · `rapport_gtg_glucides_sfd.pdf` (SFD,
glucides, **septembre 2016**) · `guide HAS._parcours_surpoids-obesite_de_ladulte.pdf` ·
`HAS activité physique.pdf` · `statin-intolerance-pathway.pdf` · `manger bouger reco.pdf` ·
`4DDK001…pdf`.

---

## §10. Tableau récapitulatif

| # | Objet vérifié | Verdict | Localisation |
|---|---|---|---|
| 1a | **HAS 2024 R.87** — « augmentée **ou réduite** de 1 ou 2 UI, tous les 3 jours », grade **AE** | **VÉRIFIÉ** | `strategie_therapeutique…pdf` **p. 25** |
| 1b | **HAS 2024 R.103** — désintensification, **aucun chiffre**, grade AE | **VÉRIFIÉ** | idem **p. 29** |
| 1c | **HAS 2024 R.105** — écart **< 0,5 %** → **absence de traitement**, grade AE | **VÉRIFIÉ** (chiffre présent ; porte sur l'arrêt, pas la dose ; sens de l'écart non précisé) | idem **p. 29** |
| 1d | **HAS 2024 exclut l'ASG de son périmètre**, p. 5 | **VÉRIFIÉ** (phrase et page exactes) | idem **p. 5** |
| 1e | « le renvoi de HAS 2024 maintient en vigueur la fiche 2011 » | **NUANCÉ** — l'annexe visée (Annexe 3) ne rappelle que les cibles 2013 ; **la RBP 2024 ne nomme jamais la fiche 2011** | idem **pp. 37, 42** |
| 2a | **SFD Avis 18** — ± 2 U, ou ± 10 % au-delà de 40 U/j, tous les 3 j, cible **0,80-1,30 g/L** | **VÉRIFIÉ** | `SFD 2025.pdf` **pp. 24-25** (journal 653-654) |
| 2b | **SFD Avis 19** — **0,5 U/kg/j** *verbatim* | **VÉRIFIÉ** → **RÉFUTE** `chantier-2026-07-27/preuve-sur-basalisation.md` §2.5/§6-10/**P4** | idem **p. 25** (journal 654) |
| 2c | **SFD Avis 21** — planchers **7 %** (fragile) / **7,5 %** (dépendant sous insuline) ; préprandial **1-2 g/L** | **VÉRIFIÉ** (⚠ le 1-2 g/L vaut pour « dépendantes », pas « fragiles ») | idem **p. 27** (journal 656) |
| 2d | **SFD Avis 23** — MCG remboursée < 3 inj/j si déséquilibre ; **primoprescription par le MG** à 1-2 injections | **VÉRIFIÉ**, + corroboré par HAS 2025 §5.2.3.2 (avis CNEDiMTS 23/07/2024) | idem **p. 30** (journal 659) |
| 2e | **SFD Avis 3** — plancher 7 % sous SU/glinide/insuline avant 75 ans | **VÉRIFIÉ** | idem **p. 3** (journal 632) |
| 2f | « SFD 2025 ne donne aucune fréquence d'ASG » | **VÉRIFIÉ** (balayage texte intégral) | — |
| 2g | « SFD 2025.pdf partiellement non extractible » (A2) | **VÉRIFIÉ et circonscrit** : **les figures** sont des images ; le texte des Avis s'extrait entièrement | p. 23 = 307 car. ; figures 3427×1921 px |
| 3 | **Tableau II SFD** — seuil d'hypoglycémie **< 0,70 g/L** (et < 0,54) ; TIR 0,70-1,80 | **VÉRIFIÉ** — divergence **D-1 fondée** (⚠ table MCG, définition Battelino 2019) | idem **p. 5** (journal 634) |
| 4a | **ebmfrance** — « 1 fois sur 3 : rien ; plus souvent : −2 U ; hypo symptomatique : −4 U » | **VÉRIFIÉ**, ⚠ **en deux morceaux** ; le −4 U n'est **pas** conditionné à GAJ < 4,0 | `Insulinothérapie…ebmfrance.pdf` **pp. 4-5** |
| 4b | **ebmfrance** — cible **0,72-1,08 g/L** (4,0-6,0 mmol/L) | **VÉRIFIÉ**, ⚠ la fiche imprime **aussi** 5,0-6,0 mmol/L (0,90-1,08) | idem **pp. 4 et 7** |
| 5a | **Fiche HAS BUTS avril 2011** — existe, ce titre, cette date ; rythmes **≥ 4/j** et **2-4/j** ; cibles **70-120 / < 180 mg/dL** ; **aucun grade** | **VÉRIFIÉ** (PDF téléchargé et lu) | HAS `r_1438006` |
| 5b | **Toujours en vigueur ?** | **VÉRIFIÉ — OUI**, et **reprise par la HAS le 26 juin 2025** (réf. n° 35 du guide Parcours de soins) | HAS Parcours 2025 **§5.2, pp. 38-40** |
| 5c | « la doctrine ASG de la HAS n'a pas été révisée depuis 2011 » (A3 §7.1, A5 §2.1) | ⚠ **RÉFUTÉ dans la forme** (re-publiée en 2025, en g/L), **confirmé dans le fond** (chiffres identiques) | idem |
| 6 | **Plafond 200 bandelettes/an — exclut les insulino-traités ?** | **VÉRIFIÉ, OUI** — 3 sources concordantes (HAS 2011, HAS 2025, SFD 2025) ; ⚠ arrêté non lu au JO | HAS 2011 · HAS 2025 §5.2.3.1 · SFD Avis 23 |
| 7 | **SFD 2017 MCG §8.6.3** — attribution horaire + contre-cas 0-4 h, **même page** que §8.6.2 | **VÉRIFIÉ** ; ⚠ « table complète » et « se contredit » à reformuler (liste partielle ; réserve assumée) | `mmm_referentielmcg_ep11.pdf` **p. 30** (journal S24) |
| 8 | **Prescrire — zéro occurrence** ASG / désintensification | **VÉRIFIÉ** (0/0/0/0/0/0/0) | `prescrire-dt2.md` |
| 9 | **`NICE 2023.pdf` = NG238 (lipides), pas NG28 (diabète)** | **VÉRIFIÉ** (52× « NG238 », 0× « insulin ») | `NICE 2023.pdf` p. 1 |
| ★ | **HAS Parcours de soins 2025 — signal de sur-traitement** (« baisse de l'HbA1c en l'absence d'intensification ») | **VÉRIFIÉ**, **absent des 5 collectes** | HAS Parcours 2025 **§8.1, p. 66** |

---

## §11. État du corpus local `docs/decision/sources/`

### Manquantes (et une seule est bloquante)

| Pièce | Pourquoi elle manque à ce nœud | Gravité |
|---|---|---|
| ★ **HAS, *Parcours de soins du patient adulte vivant avec un diabète de type 2*, juin/juillet 2025** (113 p.) | **La reco HAS en vigueur sur l'ASG** (§5.2), sur les **objectifs capillaires en g/L**, sur le **remboursement**, sur l'**indication MCG** (avis CNEDiMTS 23/07/2024) et sur le **signal de sur-traitement de l'âgé** (§8.1). Le corpus s'arrête à la RBP 2024, qui **exclut** l'ASG de son périmètre | ★★★ **à ajouter au dépôt** |
| **Fiche HAS BUTS avril 2011** (2 p.) | Tous les chiffres FR de densité et de seuils capillaires en dépendent ; elle a été lue en ligne par A3, A5 et moi, mais **n'est pas dans le dépôt** | ★★ |
| **Prescrire sur l'ASG** (article dédié, s'il existe) | Sans lui, **aucune contre-expertise indépendante** sur l'instrument de mesure du nœud (§8) | ★★ |
| **`prescrire 12.pdf`** | **Toujours signalé vide** ; dette héritée des nœuds D, E, H. **Absent du dépôt** (`find` : seul `prescrire-dt2.md` existe) | ★ (sans effet ici) |
| **Arrêté du 25 février 2011** (texte JO/Légifrance) | Le contenu est corroboré 3 fois, la source primaire n'est pas ouverte | ★ |
| **NICE NG28** (*Type 2 diabetes in adults: management*) | Cité par HAS 2025 (réf. 38) ; le dépôt n'a que **NG238** (lipides) | ★ |

### Vides ou non extractibles

- `10_petites_astuces_anti-sédentarité.pdf` — **0 caractère** (PDF image, pas de couche texte).
- `SFD 2025.pdf` — texte **intégralement extractible** ; **figures 6 à 10 rastérisées**, illisibles par
  `pdftotext` (p. 23 = 307 car.). **Méthode obligatoire pour les figures : rendu PNG + lecture visuelle.**
  ⚠ **C'est la cause du faux négatif du 2026-07-27** : ne jamais conclure à une absence dans ce PDF sans
  avoir aussi regardé les figures **et** vérifié qu'on lit bien la copie locale (15 Mo) et non une copie
  web tronquée.
- `4DDK001…pdf` — 810 caractères (affiche).

### Mal ou dangereusement nommées

- **`NICE 2023.pdf` → NG238 (risque CV / lipides)**, **pas** NG28. Renommer.
- **`mmm_referentielmcg_ep11.pdf`** — nom trompeur (« mcg » lu comme *Médecine Générale*) ; c'est
  **SFD, Mesure Continue du Glucose, 2017**. Erreur déjà commise au nœud D. Renommer, ou porter la
  mention dans le tableau des sources de `00-global.md`.
- **`pdp_pompe_insuline_externe_mcg.pdf`** — identité **correcte** (SFD Paramédical 2022) mais **absent
  du tableau « Sources locales déjà disponibles » de `00-global.md`**, comme `HAS activité physique.pdf`,
  `manger bouger reco.pdf`, `10_petites_astuces…`, `4DDK001…`, `NICE 2023.pdf`,
  `statin-intolerance-pathway.pdf`. **Le tableau du `00-global.md` liste 7 pièces ; le dossier en
  contient 15.** C'est le terreau exact des erreurs d'étiquetage : à remettre à jour.

---

## §12. Ce qui doit remonter au référent (3 points, et un seul est un arbitrage)

1. **Fait, pas arbitrage** — ajouter **HAS Parcours de soins 2025** au corpus et **re-sourcer les deux
   seuils capillaires du nœud dessus** (0,70-1,20 g/L ; < 1,80 g/L à 2 h). Ils cessent d'être « un texte
   de 2011 » pour devenir « une reco HAS de 2025 ». Rien à trancher : la source existe et est publique.
2. **Fait, pas arbitrage** — corriger `chantier-2026-07-27` **P4** : la SFD **porte** le 0,5 U/kg
   (Avis 19). L'analyse de fond tient, l'attribution était fausse. La phrase affichée à l'utilisateur
   doit citer **SFD 2025 Avis 19** à côté de l'AACE.
3. **Arbitrage** — le **déclencheur de désintensification de HAS 2025** (« la baisse de l'HbA1c
   survenant **en l'absence d'intensification** évoque un surtraitement ») est un **accord d'experts**
   (certitude `tres_faible`) mais c'est **le seul déclencheur français qui décrive V-A5**. Doit-il être
   **affiché** comme reco officielle (la règle `00-global.md` §granularité EBM l'autorise), ou reste-t-il
   hors périmètre faute de donnée ? **Je ne tranche pas.**

---

### Annexe — traçabilité

Extractions : `pdftotext -enc UTF-8 -layout` (poppler), recoupé par PyMuPDF 1.27 pour la structure et le
comptage d'images ; rendus PNG 200 dpi par PyMuPDF pour les figures SFD. Téléchargements : fiche HAS
BUTS 2011 (`has-sante.fr/upload/docs/application/pdf/2011-04/…`) et guide HAS Parcours de soins 2025
(`has-sante.fr/upload/docs/application/pdf/2025-07/…_guide_2025-07-15_16-42-8_797.pdf`), tous deux
extraits et lus intégralement. Fichiers de travail en scratchpad, hors dépôt. **Aucun fichier du dépôt
modifié hors celui-ci.** Toute citation entre guillemets de ce document a été lue par moi dans la source
citée ; les deux seuls éléments non ouverts en primaire sont signalés `[À VÉRIFIER]` (§6 : texte de
l'arrêté du 25 février 2011 ; §5.1 : absence de bandeau de retrait constatée sur la page HAS, non
confirmée par une décision de retrait publiée).
