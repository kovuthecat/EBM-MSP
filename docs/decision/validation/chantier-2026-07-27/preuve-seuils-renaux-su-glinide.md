# Seuils rénaux du sulfamide et du glinide — sourçage dur (collecte de preuve)

- **Statut** : collecte de preuve en lecture seule, sources primaires récupérées et ouvertes le
  2026-07-27. **Aucun fichier de `content/` ni aucun test modifié.** Décisions à prendre par le référent.
- **Nœud concerné** : `content/noeuds/diabete-type-2/prescription.yaml`, entrées `incertitudes`
  « SEUIL "DFG < 30" DU SULFAMIDE — convention, pas citation » (`:1316-1320`) et « GLINIDE SEUL
  (sans sulfamide) + DFG < 30 » (`:1303-1315`, résiduels (a) et (b)).
- **Antériorité** : `docs/decision/validation/chantier-2026-07-26/rcp-glinide-insuffisance-renale.md`
  (vérification RCP du 2026-07-26) — non contredite ici, complétée.
- **Méthode** : les PDF ont été téléchargés puis extraits en texte (`pdftotext -layout`) et lus
  directement ; les citations ci-dessous sont des extraits courts recopiés depuis ce texte extrait.
  Les numéros de page sont ceux des marqueurs de pagination présents dans le PDF.

---

## Avertissement d'identification de source (piège déjà rencontré dans ce dépôt)

Une page **hébergée sur `sfdiabete.org`** est apparue en tête des résultats et paraît être un
référentiel SFD sur exactement notre sujet. **Elle n'en est pas un.**

`https://www.sfdiabete.org/mediatheque/kiosque/articles-qdm/insuffisance-renale-chronique-adapter-les-antidiabetiques`
→ identité réelle vérifiée sur la page elle-même : **article de presse du *Quotidien du Médecin*
n° 9369, jeudi 27 novembre 2014**, signé Pr Patrice Darmon, republié dans la section
**« Kiosque » de la médiathèque** de la SFD. Ce n'est **ni un référentiel, ni une prise de position
SFD** ; il cite les recommandations HAS **2013**. Son contenu (« on préférera le gliclazide ou le
glipizide … au glibenclamide ou au glimépiride ») est **intéressant mais de rang presse, 2014**, et
**n'est pas repris** par les prises de position SFD 2023 ni 2025 (voir §1.4). **À ne pas citer comme
source de rang recommandation.** C'est le même mécanisme d'erreur que le `mmm_referentielmcg_ep11.pdf`
déjà consigné en mémoire projet.

---

# QUESTION 1 — Sourçage dur du seuil « DFG < 30 » du sulfamide

## Verdict en une phrase

**OUI, un seuil chiffré de rang recommandation existe, et il vaut 30 : la SFD écrit noir sur blanc
que les sulfamides sont contre-indiqués en IRC sévère ou terminale et définit numériquement ces
stades comme DFG < 30 mL/min/1,73 m² — mais la source est la SFD (2023 puis 2025), PAS la HAS et PAS
la KDIGO, qui ne donnent aucun chiffre pour cette classe.**

## 1.1 Ce qui est établi — SFD (source décisive, rang recommandation, française, à jour)

**Document** : Darmon P, Bauduceau B, Bordier L, Detournay B, Dupuy O, Gourdy P, et al., pour la SFD.
*Prise de position de la Société Francophone du Diabète (SFD) sur les stratégies d'utilisation des
traitements de l'hyperglycémie dans le diabète de type 2 — 2025.* **Médecine des Maladies
Métaboliques 2025;19(8):630-662**. DOI **10.1016/j.mmm.2025.10.002**. En ligne le 13 novembre 2025.
Rubrique « Recommandations et référentiels ». PDF ouvert et lu intégralement en texte.

> ⚠ **Le dépôt raisonne peut-être encore sur la version 2023.** La version **2025 est parue** et,
> sur ce point précis, **le libellé est inchangé** entre 2023 et 2025 — ce qui est un argument de
> stabilité, pas un argument pour rester sur 2023. La numérotation des avis, elle, a changé
> (2023 : Avis n° 23 / 24 → 2025 : Avis n° 12 / 12 bis).

### (a) La contre-indication elle-même, et sa définition chiffrée — le point-clé

C'est la **conjonction de deux notes de bas de page du Tableau I** (objectifs d'HbA1c, p. 633) qui
transforme le qualitatif du RCP en chiffre :

> **Note 1** — « Stade 4 : débit de filtration glomérulaire (DFG) entre 15 et 29 mL/min/1,73 m² ;
> stade 5 : DFG < 15 mL/min/1,73 m². »
>
> **Note 2** — « Les sulfamides hypoglycémiants sont contre-indiqués en cas d'IRC sévère ou
> terminale. »

**Ce qui est écrit** : « IRC sévère ou terminale » = stades 4 ou 5 = **DFG < 30 mL/min/1,73 m²**, et
dans cette zone les sulfamides sont **contre-indiqués**. La SFD fait donc explicitement, dans son
propre document, la traduction que le dépôt avait faite lui-même « en convention ».
**Ce qui est déduit** : rien — l'équation stade 4/5 ↔ < 30 et l'équation IRC sévère/terminale ↔
stade 4/5 sont toutes deux écrites, dans le même tableau, avec renvoi croisé des appels de note.

### (b) Confirmation directe dans le corps du texte — Avis n° 12 (p. 643)

*Avis n° 12. Insuffisance rénale chronique (IRC) : objectifs glycémiques (tableau I)* :

> « Chez les patients vivant avec un DT2 et présentant une IRC sévère (DFG entre 15 et
> 29 mL/min/1,73 m²) ou terminale (DFG < 15 mL/min/1,73 m²), on visera une HbA1c cible ≤ 8 %
> (64 mmol/mol), avec une limite inférieure de 7 % (53 mmol/mol) en cas de traitement par glinide ou
> insuline **(SU contre-indiqués)**, pour minimiser le risque hypoglycémique. »

L'incise « (SU contre-indiqués) » est **attachée à une plage de DFG explicitement chiffrée**. C'est
la citation la plus directe que la collecte ait trouvée. Elle a en outre la vertu, pour ce nœud, de
**séparer le glinide du sulfamide dans la même phrase** : le glinide reste un traitement possible
(avec plancher d'HbA1c à 7 %), le sulfamide non.

### (c) La conduite associée, par palier — Avis n° 12 bis (p. 643-644)

*Avis n° 12 bis. IRC : gestion des traitements de l'hyperglycémie (figure 3)* :

- **DFG 30-59 (IRC modérée) → adaptation posologique, pas arrêt** :
  > « Au stade d'IRC modérée (DFG entre 30 et 59 mL/min/1,73 m²), les molécules à élimination rénale
  > doivent être utilisées avec précaution car il existe un risque accru d'effets secondaires,
  > notamment en ce qui concerne les hypoglycémies sous SU ou insuline. La posologie de ces
  > traitements sera adaptée […] »

- **DFG 15-29 (IRC sévère) → le sulfamide est absent de la liste des molécules utilisables** :
  > « Au stade d'IRC sévère (DFG 15 à 29 mL/min/1,73 m²), la metformine doit être arrêtée et seuls
  > l'insuline, le répaglinide (avec un risque d'hypoglycémies pour ces deux traitements), le
  > liraglutide, le sémaglutide, le dulaglutide, le tirzépatide […], la vildagliptine à la dose de
  > 50 mg/j et la sitagliptine à la dose de 25 mg/j […] peuvent être utilisés. »

- **DFG < 15 (IRC terminale) → idem, sulfamide toujours absent** (verbatim au §2.1 ci-dessous).

**Ce qui est écrit** : la liste est introduite par « **seuls** … peuvent être utilisés » — c'est une
liste fermée, et le sulfamide n'y figure pas, aux deux paliers sous 30.
**Ce qui est déduit** : que l'absence de la liste vaut interdiction. Cette déduction est **couverte
par ailleurs** par la mention explicite « (SU contre-indiqués) » de l'Avis n° 12 et par la note 2 du
Tableau I — les trois canaux concordent. Elle ne repose donc pas sur le seul argument *a silentio*.

### (d) Concordance avec l'édition précédente

Mêmes phrases, mêmes chiffres, dans : Darmon P, et al. *Prise de position … — 2023*, **Méd Mal
Métab 2023**, DOI **10.1016/j.mmm.2023.10.007** — Tableau I notes 1 et 2 (p. 4 du tiré à part),
**Avis n° 23** (p. 22) et **Avis n° 24** (p. 23). Le point est donc **stable sur deux éditions
consécutives** de la même société savante.

## 1.2 Ce que dit la HAS 2024 — rien de chiffré (vérifié en texte intégral)

**Documents ouverts et extraits en entier** :
- HAS. *Stratégie thérapeutique du patient vivant avec un diabète de type 2 — **Recommandation***,
  mai 2024 (validée par le collège le 30/05/2024, publiée le 06/06/2024). PDF, 3 126 lignes de texte.
- HAS. *Idem — **Rapport d'élaboration***, mai 2024. PDF, 14 123 lignes de texte.
- HAS. *Idem — **Fiche de synthèse***, mai 2024.

**Constat, après extraction et recherche exhaustive sur `sulfamide`, `glinide`, `répaglinide`, `DFG`,
`mL/min`, `insuffisance rénale`** :

- **Aucun seuil de DFG n'est attaché aux sulfamides**, nulle part, dans aucun des trois documents.
- Le **chapitre 12 « Personne avec une maladie rénale chronique »** produit exactement trois
  recommandations — **R.131** (prescrire/envisager un iSGLT2, grade A), **R.132** (aGLP1 si échec ou
  intolérance à l'iSGLT2, grade AE), **R.133** (renvoi au guide parcours de soins MRC, grade AE) —
  et **aucune ne mentionne les sulfamides**. R.131 se borne à « quitte à réduire les autres
  hypoglycémiants pour prévenir le risque d'hypoglycémie si besoin », sans nommer de classe ni de
  seuil.
- Les seules recommandations HAS visant les sulfamides sont **qualitatives et non rénales** :
  - **R.69** (grade AE) : « La prescription des sulfamides hypoglycémiants en bithérapie en
    association avec MET n'est plus la stratégie préférentielle recommandée en raison des risques
    d'hypoglycémies sévères […] ».
  - **R.102** (grade AE, sujet âgé) : « En raison des risques d'hypoglycémies, les sulfamides sont à
    utiliser avec précaution chez les personnes âgées […] Lorsqu'il existe une alternative,
    l'instauration des sulfamides, en particulier ceux à longue durée d'action, chez les personnes
    les plus âgées n'est pas recommandée ».
- La HAS **définit bien les stades** de MRC en annexe (« 4 : entre 15 et 29 — Insuffisance rénale
  chronique sévère ; 5 : < 15 — Insuffisance rénale chronique terminale ») mais **ne raccorde jamais
  cette grille aux sulfamides**.

**Conclusion HAS** : la HAS 2024 **ne peut pas servir de source du seuil 30 pour le sulfamide**. Elle
délègue explicitement le sujet rénal à son *Guide du parcours de soins — Maladie rénale chronique de
l'adulte (MRC), septembre 2023* (cité en R.133 et en tête du chapitre 12) — guide que la collecte
**n'a pas réussi à ouvrir** (voir §1.5).

## 1.3 Ce que dit la KDIGO 2022 — rien de chiffré non plus (vérifié en texte intégral)

**Document ouvert et extrait en entier** : *KDIGO 2022 Clinical Practice Guideline for Diabetes
Management in Chronic Kidney Disease*, **Kidney International 2022;102(5S):S1-S127**. PDF officiel
KDIGO, 8 242 002 octets, extrait en texte (≈ 8 000 lignes) et recherché sur `sulfonylurea`,
`glipizide`, `gliclazide`, `glimepiride`, `glyburide`, `glibenclamide`, `repaglinide`, `meglitinide`.

**Le seul énoncé de la KDIGO reliant les sulfamides au DFG, verbatim** (chapitre 4, texte
introductif précédant la section 4.1 Metformin) :

> « All glucose-lowering medications should be selected and dosed according to eGFR. For example,
> sulfonylureas that are long-acting or cleared by the kidney should be avoided at low eGFRs. »

**Aucun chiffre.** L'énoncé renvoie à la **référence 349**, qui est une **revue** (Neumiller JJ,
Alicic RZ, Tuttle KR, *Therapeutic considerations…*), pas une norme.

Vérification complémentaire : la KDIGO 2022 contient bien des figures de posologie par DFG, mais
**seulement pour la metformine (Figure 27) et les AR GLP-1 (Figure 29)** — **il n'existe pas de
figure ni de tableau KDIGO de posologie des sulfamides par DFG**. La Figure 25 (« Patient factors
influencing the selection of glucose-lowering drugs… ») est un schéma de facteurs, pas une grille de
seuils.

**Conséquence directe pour le dépôt** : l'attribution actuelle **« convention KDIGO/SFD »**
(`prescription.yaml:377`, `:382`, `:1318`) est **inexacte pour la moitié KDIGO**. Ce qui vient de la
KDIGO, c'est la **stadification** de la MRC (G4 = 15-29, G5 = < 15), pas un énoncé KDIGO sur les
sulfamides. Le seuil de 30 appliqué au sulfamide vient de la **SFD**.

## 1.4 La question molécule par molécule (gliclazide vs glimépiride) — non soutenue au rang recommandation

La mission demandait de vérifier l'idée courante « le gliclazide est le mieux toléré des sulfamides
en IRC ». **Résultat : aucune source française de rang recommandation ne l'écrit.**

- **SFD 2023 et 2025** : parlent uniquement de « **SU** » / « sulfamides hypoglycémiants » **en
  classe**. Aucune distinction gliclazide / glimépiride / glipizide nulle part dans les avis rénaux.
- **HAS 2024** : idem, aucune distinction inter-molécule. R.102 distingue seulement les sulfamides
  « **à longue durée d'action** » (critère pharmacologique, pas nominatif, et dans le contexte du
  sujet âgé, pas rénal).
- **RCP français** (vérifiés le 2026-07-26) : gliclazide et glimépiride portent **le même libellé**
  de contre-indication (« insuffisance rénale ou hépatique sévère »).
- **Collège National de Pharmacologie Médicale** (`pharmacomedicale.org`, page « Sulfamides
  hypoglycémiants », dernière modification 24/05/2024) — **source secondaire universitaire**,
  utilisée ici en simple corroboration : donne bien le chiffre (« jusqu'à un débit de filtration
  glomérulaire de 30 ml/min »), avec la conduite « utilisation prudente à posologies réduites en cas
  d'insuffisance modérée, et une contre-indication en cas d'insuffisance sévère » — et **ne
  différencie aucune molécule** non plus.

**Deux sources différencient les molécules, mais aucune n'est utilisable ici** :

1. L'article du *Quotidien du Médecin* 2014 (cf. avertissement en tête) : rang presse, 2014.
2. Zanchi A, Lehmann R, Philippe J. *Antidiabetic drugs and kidney disease.* **Swiss Med Wkly 2012**,
   DOI 10.4414/smw.2012.13629 — revue **suisse, 2012, secondaire**, adossée aux **libellés d'AMM
   suisses** : « In Switzerland, gliclazide is the only sulfonylurea that can be used in subjects
   with a GFR of 40-60 ml/min. However, it must be stopped once GFR falls below 40 ml/min » et
   « The use of glimepiride is contraindicated in patients with a GFR of < 60 ml/min ».
   **Non transposable** : ces seuils (40, 60) sont ceux d'une autre juridiction réglementaire et
   contrediraient les RCP français vérifiés. **À ne surtout pas importer dans le nœud** — c'est
   précisément le genre de chiffre qui, sorti de son contexte réglementaire, produirait une
   régression de sécurité.

## 1.5 Ce qui n'a pas pu être vérifié (Q1)

- **HAS, *Guide du parcours de soins — Maladie rénale chronique de l'adulte (MRC)*, septembre 2023** :
  **non ouvert**. C'est le renvoi explicite de la HAS 2024 (R.133), donc le candidat le plus probable
  pour une grille HAS d'adaptation des antidiabétiques par DFG. Le miroir `ameli.fr` répond **403**,
  et aucune des URL `has-sante.fr/upload/docs/application/pdf/...` essayées n'a résolu (404) ; la
  page `jcms` ne sert pas de lien PDF exploitable en HTML brut. **Signalé plutôt que deviné** : je ne
  sais pas ce que ce guide contient sur les sulfamides. C'est le seul angle mort français sérieux de
  cette collecte.
- **ADA Standards of Care** : le chapitre **11 (CKD, éd. 2025, PMC11635029)** a été ouvert
  intégralement → **aucune mention de sulfamide ni de répaglinide avec seuil de DFG**. Le contenu
  attendu se trouve dans le **Tableau 9.2** du chapitre 9, qui est publié **sous forme d'image**
  (`dc25S009t2.jpg`) et **n'a donc pas pu être lu en texte**. Une source secondaire de synthèse
  rapporte l'ADA comme disant « glyburide généralement non recommandé en MRC ; glipizide et
  glimépiride à initier prudemment » — **je n'ai pas pu le vérifier sur la source primaire, donc je
  ne le cite pas comme acquis**. Note : l'ADA ne mentionne pas le gliclazide (non commercialisé aux
  États-Unis), ce qui limite de toute façon sa portée pour le contexte français.
- **Figure 3 de la SFD 2025** (« Fonction rénale (DFG estimé) et utilisation des traitements de
  l'hyperglycémie ») : c'est une **image**, non extractible en texte. Le texte des Avis n° 12 et
  12 bis, cité ci-dessus, en est la version rédigée et suffit ; mais je n'affirme rien sur ce que la
  figure ajouterait éventuellement.
- **ANSM** : aucune fiche de bon usage spécifique « sulfamides + insuffisance rénale » n'a été
  trouvée. La seule publication ANSM 2021 citée par la HAS sur le thème « … acidose lactique en cas
  d'insuffisance rénale » concerne la **metformine**, pas les sulfamides.
- **`ebmfrance` / GPR** : non consultés (accès abonné) — non explorés dans cette collecte.

## 1.6 Ce que ça change pour le nœud

**Le seuil de 30 est CONFIRMÉ. Il ne bouge pas. Ce qui change, c'est son statut et son attribution.**

1. **Le seuil n'est plus une convention assumée : c'est une citation.** L'entrée `incertitudes`
   « SEUIL "DFG < 30" DU SULFAMIDE — convention, pas citation » (`:1316-1320`) peut être **close**.
   Sa prémisse (« ni le RCP du gliclazide ni celui du glimépiride ne donnent de valeur chiffrée »)
   reste vraie et doit être conservée ; ce qui devient faux, c'est la conclusion « aucun sourçage plus
   dur n'existe ». Il existe : **SFD 2025, Avis n° 12 + Tableau I note 2**.
2. **Corriger l'attribution.** Remplacer « convention KDIGO/SFD » (`:377`, `:382`, `:1318`) par une
   attribution exacte, par exemple : *« contre-indication en IRC sévère/terminale (RCP, qualitatif),
   chiffrée à DFG < 30 par la SFD (prise de position 2025, Avis n° 12 ; stades KDIGO G4-G5) »*. La
   KDIGO ne doit plus apparaître comme caution du seuil **appliqué au sulfamide** — seulement, si on
   le souhaite, comme origine de la **stadification**. C'est une correction de rigueur de sourçage,
   pas de comportement : **aucun changement de règle du moteur n'en découle.**
3. **La conduite par palier du nœud est validée telle quelle** : « réduire » entre 30 et 59
   (SFD : « la posologie de ces traitements sera adaptée »), « arrêter » sous 30 (SFD : « SU
   contre-indiqués »). C'est exactement la structure à deux options déjà en place
   (`Réduire la posologie du sulfamide` / `Arrêter le sulfamide (DFG < 30)`).
4. **Ne pas introduire de distinction gliclazide / glimépiride** sur le critère rénal : aucune source
   de rang recommandation ne la porte, et les deux seules qui la portent sont hors périmètre
   (presse 2014 ; AMM suisses 2012). Le libellé de classe actuel du nœud est le bon.
5. **Piste optionnelle, hors périmètre de cette question** : la SFD 2025 durcit la règle sur le sujet
   âgé — note 6 du Tableau I, p. 633 : « Il est recommandé d'éviter de prescrire un sulfamide ou un
   glinide chez les sujets âgés “fragiles” et de **ne jamais les utiliser** chez les sujets âgés
   “dépendants” » (2023 disait « il est préférable d'éviter » pour les deux catégories). Si le nœud
   croise `fragilite`, c'est un durcissement de source à considérer — **à arbitrer séparément**, ce
   n'est pas l'objet de cette collecte.

---

# QUESTION 2 — Répaglinide sous 20 mL/min et en dialyse

## Verdict en une phrase

**Ce n'est pas un résultat négatif : le silence du RCP sous 20 mL/min est comblé par deux canaux
indépendants et concordants — la SFD autorise nommément le répaglinide au stade d'IRC terminale
(DFG < 15), et l'étude pharmacocinétique princeps comportait un bras d'hémodialysés montrant que la
dialyse ne modifie pas sa clairance.**

## 2.1 Recommandation de société savante — SFD 2025, Avis n° 12 bis (p. 644)

Même document qu'au §1.1 (Méd Mal Métab 2025;19(8):630-662, DOI 10.1016/j.mmm.2025.10.002), rubrique
« Recommandations et référentiels ».

> « Au stade d'IRC terminale (DFG < 15 mL/min/1,73 m²), parmi les molécules commercialisées en
> France, seuls l'insuline, le **répaglinide** (avec un risque d'hypoglycémies pour ces deux
> traitements), la vildagliptine à la dose de 50 mg/j et la sitagliptine à la dose de 25 mg/j (forme
> non commercialisée en France) peuvent être utilisés. »

Et un palier au-dessus (p. 643-644, déjà cité au §1.1c) :

> « Au stade d'IRC sévère (DFG 15 à 29 mL/min/1,73 m²), la metformine doit être arrêtée et seuls
> l'insuline, le **répaglinide** (avec un risque d'hypoglycémies pour ces deux traitements), […]
> peuvent être utilisés. »

**Ce qui est écrit** : le répaglinide est **l'un des quatre traitements** que la SFD retient comme
utilisables sous 15 mL/min en France, et l'**un des deux seuls réellement disponibles** en pratique
française avec l'insuline (la sitagliptine 25 mg n'est pas commercialisée ; reste la vildagliptine
50 mg/j). La formule « parmi les molécules commercialisées en France » montre que la SFD raisonne
explicitement sur la disponibilité française — ce qui est exactement le cadrage du dépôt.
**Ce qui est déduit** : rien. La mention est nominale et le palier est chiffré.
**Réserve portée par la source elle-même** : « avec un risque d'hypoglycémies pour ces deux
traitements » — la SFD n'autorise pas sans réserve, elle autorise en signalant l'hypoglycémie.
Cohérent avec le plancher d'HbA1c à 7 % qu'elle impose sous glinide ou insuline à ce stade (Avis
n° 12, cité au §1.1b).

Libellé **identique en 2023** (Avis n° 24, DOI 10.1016/j.mmm.2023.10.007) : point stable sur deux
éditions.

## 2.2 Recommandation française HAS — R.78, grade C (Recommandation mai 2024, p. 23)

HAS, *Stratégie thérapeutique du patient vivant avec un diabète de type 2 — Recommandation*, mai
2024. **R.78** (trithérapie avec metformine, grade C), liste par ordre préférentiel, dernier item
avant les inhibiteurs des alphaglucosidases :

> « répaglinide (demi-vie courte) et en raison de sa **« non-CI » en cas de maladie rénale** »

**Ce qui est écrit** : la HAS motive explicitement le recours au répaglinide par son **absence de
contre-indication rénale**, mise entre guillemets par la HAS elle-même. C'est **une source française
de rang recommandation** confirmant la lecture du RCP faite le 2026-07-26.
**Ce qui est déduit** : la portée en dessous de 20 mL/min. La HAS écrit « en cas de maladie rénale »
**sans plancher** — elle ne dit ni « jusqu'à », ni « sauf en dialyse ». L'absence de plancher n'est
pas la même chose qu'une autorisation explicite sous 15 ; c'est la SFD (§2.1) qui fournit celle-là.

## 2.3 Donnée pharmacocinétique en dialyse — l'étude princeps comportait un bras hémodialysé

**Marbury TC, Ruckle JL, Hatorp V, Andersen MP, Nielsen KK, Huang WC, Strange P.** *Pharmacokinetics
of repaglinide in subjects with renal impairment.* **Clin Pharmacol Ther 2000;67(1):7-15.**
**PMID 10668848**. DOI **10.1067/mcp.2000.103973**. Notice PubMed ouverte et lue.

Extraits du résumé, verbatim :

> « Subjects with normal renal function (n = 6) and subjects with renal impairment (mild to moderate,
> n = 6; severe, n = 6) received treatment with 2 mg repaglinide for 7 days. **Subjects in the
> hemodialysis group (n = 6) received two single doses of 2 mg repaglinide** separated by a 7- to
> 14-day washout period. […] Serum steady-state levels, urine levels, and **dialysate levels** were
> also measured. »
>
> « **Hemodialysis did not significantly affect repaglinide clearance.** »
>
> « Repaglinide was safe and well tolerated in subjects with varying degrees of renal impairment.
> Although **adjustment of starting doses of repaglinide is not necessary for renal impairment or
> renal failure**, severe impairment may require more care when upward adjustments of dosage are
> made. »

**Ce qui est établi** : il **existe** une donnée PK spécifique de l'hémodialysé, avec dosage du
dialysat, et elle est **négative au bon sens du terme** (la dialyse n'épure pas le répaglinide, donc
pas de perte d'effet ni de nécessité de redoser autour des séances). La conclusion des auteurs
couvre nommément l'« insuffisance rénale **terminale** » (*renal failure*) pour la **dose de départ**,
et transfère la prudence sur la **titration ascendante**.

**Point d'attention méthodologique** : cette étude est **distincte** de celle citée à la rubrique 5.2
du RCP français (5 jours, 2 mg × 3/j, clairance 20-39 mL/min, ASC × 2) — protocole différent (2 mg,
7 jours, + bras dialyse). Les deux coexistent dans la littérature du produit ; le RCP a retenu
l'autre. Cela explique pourquoi le RCP paraît « silencieux » sous 20 : le bras dialyse existe, mais
**n'est pas celui que le RCP a choisi de résumer**.

## 2.4 Donnée clinique de sécurité/efficacité en insuffisance rénale avancée

**Hasslacher C, Multinational Repaglinide Renal Study Group.** *Safety and efficacy of repaglinide in
type 2 diabetic patients with and without impaired renal function.* **Diabetes Care
2003;26(3):886-891.** **PMID 12610054**. DOI **10.2337/diacare.26.3.886**. Notice PubMed ouverte.

Extraits du résumé, verbatim :

> « Patients with normal renal function (n = 151) and various degrees of renal impairment (n = 130)
> were treated with repaglinide (maximal dose of 4 mg, three times daily). »
>
> « Percentage of patients with hypoglycemic episodes increased significantly (P = 0.007) with
> increasing severity of renal impairment **during run-in but not during repaglinide treatment**
> (P = 0.074). »
>
> « Final repaglinide dose tended to be lower for patients with **severe and extreme renal
> impairment** than for patients with less severe renal impairment or normal renal function
> (P = 0.032). »
>
> « Repaglinide has a good safety and efficacy profile in type 2 diabetic patients complicated by
> renal impairment and is an appropriate treatment choice, **even for individuals with more severe
> degrees of renal impairment**. »

**Ce qui est établi** : sur 281 patients, 3 mois d'entretien, une catégorie « **extreme renal
impairment** » existe et le signal clinique est rassurant — le taux d'hypoglycémies **augmentait**
avec la sévérité rénale **sous le traitement antérieur** (run-in) mais **plus significativement sous
répaglinide**. Le fait que la dose finale soit spontanément plus basse dans les groupes sévère/extrême
est le corrélat clinique de l'ASC × 2 du RCP : titration prudente, dose d'entretien plus faible.
**Ce qui n'est PAS établi** (voir §2.5) : les bornes exactes de clairance des catégories « severe » et
« extreme », et la présence ou non de dialysés dans cette cohorte-là.

## 2.5 Ce qui n'a pas pu être vérifié (Q2)

- **Bornes de clairance de Hasslacher 2003** : le résumé PubMed **ne définit pas** les intervalles de
  clairance des cinq catégories (normale, légère, modérée, sévère, « extrême »), ni les effectifs par
  catégorie, ni si des dialysés y étaient inclus. Le texte intégral (`diabetesjournals.org`) répond
  **403**. **Signalé plutôt que deviné** : je ne sais pas ce que « extreme renal impairment » recouvre
  numériquement dans cette étude. Cette étude est donc citée ici pour son **signal de sécurité
  clinique**, pas pour un seuil.
- **Bornes de clairance de Marbury 2000** : le résumé nomme les groupes (« mild to moderate »,
  « severe », « hemodialysis ») **sans donner les intervalles chiffrés**. Le bras hémodialyse, lui, est
  sans ambiguïté (c'est un critère de définition, pas une plage). Texte intégral non ouvert.
- **RCP centralisé EMA de Novonorm** : toujours non exploité (déjà signalé le 2026-07-26, PDF non
  extractible en texte). Non retenté ici.
- Source secondaire de corroboration, citée pour transparence et **non pour établir le fait** :
  Zanchi A, Lehmann R, Philippe J, *Antidiabetic drugs and kidney disease*, Swiss Med Wkly 2012, DOI
  10.4414/smw.2012.13629 — « the use of repaglinide is not contraindicated in patients with renal
  impairment **or dialysis patients** ». Revue suisse de 2012, **secondaire**, et qui **ne cite ni
  Marbury ni Hasslacher** ; elle concorde, elle ne prouve pas.

## 2.6 Ce que ça change pour le nœud

**Les deux résiduels signalés de l'entrée `incertitudes` du glinide (`:1310-1315`) tombent.**

1. **Résiduel (a) — « le RCP est SILENCIEUX en dessous de 20 mL/min (dialyse) — l'option reste
   offerte, sans donnée pour la borner »** : **à clore**. Le RCP reste effectivement silencieux (fait
   inchangé), mais l'option n'est plus « sans donnée » : elle est **positivement soutenue** par la SFD
   au stade DFG < 15 (§2.1) et par une PK spécifique de l'hémodialysé (§2.3). Le nœud n'a **pas** à
   poser de borne inférieure au glinide ; la formulation actuelle (option de réduction offerte sans
   exclusion rénale) est **la bonne** et devient sourçable au lieu d'être seulement non-contredite.
2. **Résiduel (b) — « aucune source de société savante (SFD/HAS) propre au répaglinide en IRC n'a été
   récupérée ; le sourçage repose sur le seul RCP »** : **factuellement caduc**. Il en existe **deux**,
   toutes deux françaises et de rang recommandation : **SFD 2025 Avis n° 12 bis** (§2.1) et
   **HAS 2024 R.78, grade C** (§2.2). L'entrée doit être réécrite en conséquence.
3. **Ce qu'il faut conserver, en revanche** : la réserve d'hypoglycémie que **la source elle-même
   porte** (« avec un risque d'hypoglycémies pour ces deux traitements »), et le plancher d'HbA1c de
   7 % que la SFD impose sous glinide ou insuline à DFG < 30 (Avis n° 12). Autrement dit : le geste
   correct sous 30, glinide compris, reste **réduction de dose + surveillance**, jamais
   intensification — ce que le nœud fait déjà. Le durcissement SFD 2025 sur le sujet âgé « dépendant »
   (« ne jamais les utiliser », §1.6-5) vise **aussi** les glinides et constitue le seul motif d'arrêt
   franc du répaglinide trouvé dans cette collecte — motif **gériatrique, pas rénal**.
4. **Rien à changer dans le comportement du moteur.** Les deux conclusions de la vérification du
   2026-07-26 (pas de contre-indication rénale du glinide ; scission de l'option en deux branches)
   sont **confirmées et renforcées**, pas révisées.

---

## Sources — URL et identité vérifiées

**Rang recommandation (primaires, ouvertes et lues)**

| Source | Identité vérifiée | URL |
|---|---|---|
| SFD 2025 (décisive Q1 + Q2) | Darmon P, et al., *Prise de position de la SFD sur les stratégies d'utilisation des traitements de l'hyperglycémie dans le DT2 — 2025*, Méd Mal Métab 2025;19(8):630-662, DOI 10.1016/j.mmm.2025.10.002, en ligne 13/11/2025 | `https://www.sfdiabete.org/sites/www.sfdiabete.org/files/files/ressources/11-698.pdf` |
| SFD 2023 (concordance) | Darmon P, et al., *… dans le diabète de type 2 — 2023*, Méd Mal Métab, DOI 10.1016/j.mmm.2023.10.007 | `https://www.sfdiabete.org/sites/www.sfdiabete.org/files/files/ressources/1-s2.0-s1957255723002298-main.pdf` |
| HAS 2024 — Recommandation (R.69, R.78, R.102) | HAS, *Stratégie thérapeutique du patient vivant avec un DT2 — Recommandation*, mai 2024 | `https://www.has-sante.fr/upload/docs/application/pdf/2024-06/strategie_therapeutique_du_patient_vivant_avec_un_diabete_de_type_2_-_recommandations.pdf` |
| HAS 2024 — Rapport d'élaboration (chap. 12 MRC, R.131-133) | idem, *Rapport d'élaboration*, mai 2024 | `https://www.has-sante.fr/upload/docs/application/pdf/2024-06/strategie_therapeutique_du_patient_vivant_avec_un_diabete_de_type_2_-_rapport_delaboration.pdf` |
| HAS 2024 — Fiche de synthèse | idem, mai 2024 | `https://www.has-sante.fr/upload/docs/application/pdf/2024-06/strategie_therapeutique_du_patient_vivant_avec_un_diabete_de_type_2_-_fiche_de_synthese.pdf` |
| Page HAS de référence | validation collège 30/05/2024, publication 06/06/2024 | `https://www.has-sante.fr/jcms/p_3191108/fr/strategie-therapeutique-du-patient-vivant-avec-un-diabete-de-type-2` |
| KDIGO 2022 | *KDIGO 2022 Clinical Practice Guideline for Diabetes Management in CKD*, Kidney Int 2022;102(5S):S1-S127 | `https://kdigo.org/wp-content/uploads/2022/10/KDIGO-2022-Clinical-Practice-Guideline-for-Diabetes-Management-in-CKD.pdf` |
| ADA SOC 2025, chap. 11 (CKD) — négatif | *11. Chronic Kidney Disease and Risk Management: Standards of Care in Diabetes—2025*, Diabetes Care 48(Suppl 1):S239 | `https://pmc.ncbi.nlm.nih.gov/articles/PMC11635029/` |

**Études (primaires, notices PubMed ouvertes)**

| Source | Identité vérifiée | URL |
|---|---|---|
| Marbury 2000 (bras hémodialyse) | Clin Pharmacol Ther 2000;67(1):7-15 · PMID **10668848** · DOI 10.1067/mcp.2000.103973 | `https://pubmed.ncbi.nlm.nih.gov/10668848/` |
| Hasslacher 2003 (sécurité clinique) | Diabetes Care 2003;26(3):886-891 · PMID **12610054** · DOI 10.2337/diacare.26.3.886 | `https://pubmed.ncbi.nlm.nih.gov/12610054/` |

**Secondaires — corroboration uniquement, jamais probantes**

| Source | Nature réelle | URL |
|---|---|---|
| Collège National de Pharmacologie Médicale, « Sulfamides hypoglycémiants » (maj 24/05/2024) | ressource pédagogique universitaire de pharmacologie | `https://pharmacomedicale.org/medicaments/par-specialites/item/sulfamides-hypoglycemiants` |
| Zanchi A, Lehmann R, Philippe J, Swiss Med Wkly **2012**, DOI 10.4414/smw.2012.13629 | revue suisse 2012, seuils adossés aux **AMM suisses** — **non transposable en France** | `https://smw.ch/index.php/smw/article/download/1582/2049?inline=1` |

**Écartée — identité vérifiée et disqualifiante**

| Source | Ce que c'est réellement | URL |
|---|---|---|
| « Insuffisance rénale chronique : adapter les antidiabétiques » | **article de presse**, *Le Quotidien du Médecin* n° 9369, 27/11/2014, Pr P. Darmon, republié en section « Kiosque » de la médiathèque SFD. **Ni référentiel ni prise de position SFD** ; cite la HAS 2013 | `https://www.sfdiabete.org/mediatheque/kiosque/articles-qdm/insuffisance-renale-chronique-adapter-les-antidiabetiques` |

**Non ouverte, angle mort assumé**

- HAS, *Guide du parcours de soins — Maladie rénale chronique de l'adulte (MRC)*, septembre 2023 —
  page : `https://www.has-sante.fr/jcms/p_3288950/fr/guide-du-parcours-de-soins-maladie-renale-chronique-de-l-adulte-mrc` ·
  miroir ameli **403** : `https://www.ameli.fr/sites/default/files/Documents/guide__mrc.pdf`.
  **Contenu inconnu sur les sulfamides** — c'est le renvoi explicite de la HAS 2024 (R.133) et le seul
  document français de rang recommandation non couvert par cette collecte.

**Dépôt interne consulté (lecture seule)**

- `content/noeuds/diabete-type-2/prescription.yaml` (`:370-383`, `:1292-1320`)
- `docs/decision/validation/chantier-2026-07-26/rcp-glinide-insuffisance-renale.md`
