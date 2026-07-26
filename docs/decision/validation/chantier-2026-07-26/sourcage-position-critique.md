# Sourçage de la « position critique » — recensement, classement, reformulations proposées

> Mission en lecture seule (sauf ce fichier). Aucun YAML, argumentaire ou document de grammaire n'a été
> modifié. Ce document propose ; la validation clinique reste un acte du référent (CLAUDE.md invariants 4
> et 6).

**Périmètre analysé** : les 5 nœuds DT2 encodés — `cible-glycemique`, `insuline`, `prescription` (fusion
B+C+D), `rhd`, `statine` — soit `content/noeuds/diabete-type-2/*.yaml` et
`content/noeuds/diabete-type-2/*.argumentaire.md` (10 fichiers, ~3 470 lignes). Revues recherchées :
Prescrire, Médicalement Geek, DragiWebdo, Minerva, ebmfrance/Duodecim/EBM Guidelines, RecoMédicales,
Louvain Médical.

**Méthode T2** : pour trancher ce qui est réellement « affiché au praticien », j'ai lu
`src/features/decision/lib/vueDecision.ts`, `src/features/decision/components/OptionCard.tsx` et
`AlertList.tsx` (comme demandé), **et** `src/features/decision/components/ArgumentPanel.tsx` +
`DecisionNodeScreen.tsx` (nécessaire : c'est ce composant, pas OptionCard, qui rend
`sources.prescrire.synthese`, `sources.medicalement_geek.synthese`, `sources.reco_officielle.*`,
`node.incertitudes`, `node.references_primaires`, et — via `loadArgumentaires.ts` + `MiniMarkdown` — le
contenu brut des `*.argumentaire.md` sous forme de « niveau de lecture 3 »). Sans cette lecture, la moitié
des occurrences de ce rapport (tout ce qui vit dans `sources:`) aurait été classée à tort comme non
rendue.

---

## 0. Constat structurel préalable — à lire avant le tableau

`ArgumentPanel.tsx` (lignes 49-63) code en dur le libellé de la colonne « Position critique » :

```tsx
<span className="argument-panel__source-label">Prescrire — </span>{prescrire.synthese}
<span className="argument-panel__source-label">Médicalement Geek — </span>{medicalement_geek.synthese}
```

Et son propre commentaire de tête (lignes 18-21) l'assume : *« Position critique » = synthèses
Médicalement Geek + Prescrire (`sources.medicalement_geek`, `sources.prescrire`) — le schéma n'a pas de
champ "position critique" séparé*. Conséquence : **tout** contenu placé dans `sources.prescrire.synthese`
ou `sources.medicalement_geek.synthese`, quel que soit son texte, s'affiche préfixé du nom de la revue. Le
schéma (`node.types.ts` `Source`) n'offre d'ailleurs aucun autre foyer pour loger une « position critique »
sourcée autrement. C'est le mécanisme structurel qui explique pourquoi le nom des revues revient aussi
systématiquement dans le contenu : le champ lui-même est nommé d'après la revue, pas d'après la donnée.
Reformuler le texte (T3, ci-dessous) réduit l'argument d'autorité **dans la prose** ; le préfixe visuel
« Prescrire — » / « Médicalement Geek — » restera néanmoins à l'écran tant que le schéma n'est pas
retouché — hors périmètre de cette mission (lecture seule), mais à signaler au référent car T4 seule ne le
résorbe pas entièrement. Un exemple de champ où le texte lui-même ne nomme même pas la revue mais hérite
quand même du préfixe : `cible-glycemique.yaml:124-126` (`medicalement_geek.synthese`, texte anonyme —
non compté ci-dessous comme « occurrence textuelle », mais concerné par ce constat).

---

## 1-2. T1 (recensement) + T2 (classement) — par nœud

Colonnes : **écran** = ce que `vueDecision`/`OptionCard`/`AlertList`/`ArgumentPanel` rendent réellement.
*Carte option* = visible dès l'affichage des résultats (avantages/inconvénients/effet attendu/CI/alertes,
`OptionCard.tsx`). *Panneau argumentaire* = visible après un clic « Déplier l'argumentaire »
(`sources.*`, `incertitudes`, `references_primaires` — `ArgumentPanel.tsx`). *Niveau 3* = visible après un
second clic « Argumentaire exhaustif » (contenu brut du `.md`, `MiniMarkdown`). *Non rendu* = le champ
n'atteint jamais l'écran dans le build actuel (commentaire YAML `#…`, `meta.changelog[].resume`, ou le
champ `Noeud.argumentaire` top-level — **constat annexe** : ce dernier champ, distinct de
`argumentaire_exhaustif`, n'est référencé nulle part dans `src/features/decision/**` ; il est rédigé dans
les 5 nœuds mais jamais rendu, `grep` à l'appui).

### 1.1 `cible-glycemique` (nœud A)

| # | Fichier:ligne | Champ | Citation (extrait) | Écran | Étiquette |
|---|---|---|---|---|---|
| CG2 | `cible-glycemique.yaml:127-132` | `sources.prescrire.synthese` | « viser ≈ 7 % les premières années puis ≈ 7,5 % ; […] 7,5–8,5 %, voire 8–9 % » | Panneau argumentaire | **ARGUMENT D'AUTORITÉ** → [R-CG](#r-cg) |
| CG3 | `cible-glycemique.yaml:141` | `sources.reco_officielle.explication` | « mais Prescrire vise ≈7 % et Médicalement Geek propose de déprescrire si < 6,5 % » | Panneau argumentaire | **ARGUMENT D'AUTORITÉ** → [R-CG](#r-cg) |
| CG4 | `cible-glycemique.argumentaire.md:128-134` | § « Reco officielle vs position critique » | « **Position critique — Prescrire** […] viser ≈ 7 % […] 8–9 % » | Niveau 3 | **ARGUMENT D'AUTORITÉ** → [R-CG](#r-cg) |
| CG5 | `cible-glycemique.argumentaire.md:136-137` | même section | « **Médicalement Geek / DragiWebdo** (EBM francophone) : mêmes bandes […] déprescription si HbA1c < 6,5 % » | Niveau 3 | **ARGUMENT D'AUTORITÉ** → [R-CG](#r-cg) |
| CG6 | `cible-glycemique.argumentaire.md:166-167` | § « Sources (liste complète) », item 18 | « **Prescrire** — « Diabète de type 2 chez un adulte » (Premiers Choix, févr 2026)… » | Niveau 3 | RÉFÉRENCE BIBLIOGRAPHIQUE — légitime (liste de sources) |
| CG7 | `cible-glycemique.argumentaire.md:168` | § « Sources », item 19 | « **Médicalement Geek / DragiWebdo** — pages « diabétologie »… » | Niveau 3 | RÉFÉRENCE BIBLIOGRAPHIQUE — légitime |
| CG8 | `cible-glycemique.yaml:157` | `meta.changelog[].resume` | « … Prescrire, Médicalement Geek, OpenEvidence) et double vérification… » | Non rendu (changelog) | RÉFÉRENCE — note de méthode interne, non prioritaire |

*Occurrence structurelle non comptée en occurrence textuelle* : `cible-glycemique.yaml:124-126`
(`medicalement_geek.synthese`, cf. §0).

### 1.2 `insuline` (nœud E)

| # | Fichier:ligne | Champ | Citation (extrait) | Écran | Étiquette |
|---|---|---|---|---|---|
| IN1 | `insuline.yaml:28` | commentaire `#` | « Prescrire ne pose PAS la NPH en référence (invention écartée)… » | Non rendu (commentaire) | RÉFÉRENCE — note red-team, bonne pratique, rien à faire |
| IN2 | `insuline.argumentaire.md:13` | § « En bref » | « = schéma de choix (ebmfrance niveau B) » | Niveau 3 | **ARGUMENT D'AUTORITÉ** → [R-IN-BASALE](#r-in-basale) |
| IN3 | `insuline.argumentaire.md:35` | § 1 | « (ebmfrance/Duodecim, niveau B). Le bras basal a le meilleur profil de tolérance » | Niveau 3 | **ARGUMENT D'AUTORITÉ** → [R-IN-BASALE](#r-in-basale) |
| IN4 | `insuline.argumentaire.md:47` | § 1 | « « ne constituent pas un traitement fondé sur les preuves » — ebmfrance » | Niveau 3 | **ARGUMENT D'AUTORITÉ** → [R-IN-PREMIX](#r-in-premix) |
| IN5 | `insuline.argumentaire.md:49` | § 1 (titration) | « repli fixe 10 U le soir — ebmfrance » | Niveau 3 | **ARGUMENT D'AUTORITÉ — DONNÉE À FOURNIR** |
| IN6 | `insuline.argumentaire.md:177-181` | § 8 | « **Position critique** (ebmfrance, Prescrire, Médicalement Geek) — affichée à côté… » | Niveau 3 | **ARGUMENT D'AUTORITÉ** → [R-IN-CRITIQUE](#r-in-critique) |
| IN9 | `insuline.argumentaire.md:184` | § 8 (Divergences) | « … là où ebmfrance/SFD l'écartent ou l'énoncent explicitement » | Niveau 3 | **ARGUMENT D'AUTORITÉ** → [R-IN-2GEN](#r-in-2gen) |
| IN10 | `insuline.argumentaire.md:190-193` | § 8 (Réserves red-team) | « La position « Prescrire tient la NPH pour référence »… sont des inventions non sourcées » | Niveau 3 | RÉFÉRENCE — mise en garde contre une fausse attribution, exemplaire, rien à faire |
| IN-b | `insuline.argumentaire.md:231` | § Sources | « ebmfrance/Duodecim « Insulinothérapie dans le DT2 » (ebm00491) » | Niveau 3 | RÉFÉRENCE BIBLIOGRAPHIQUE — légitime |
| IN11 | `insuline.yaml:127` | `avantages` (option « Initier une insuline basale ») | « … est l'insulinothérapie de choix du DT2 (ebmfrance/Duodecim, niveau B) » | **Carte option** | **ARGUMENT D'AUTORITÉ** → [R-IN-BASALE](#r-in-basale) |
| IN12 | `insuline.yaml:133-135` | `effet_attendu` (même option) | « repli fixe : 10 U le soir — ebmfrance » | **Carte option** | **ARGUMENT D'AUTORITÉ — DONNÉE À FOURNIR** |
| IN13 | `insuline.yaml:149` | `avantages` (option 2ᵉ génération) | « a fortiori à la NPH (ebmfrance niveau B ; SFD 2025 Avis 18 bis) » | **Carte option** | **ARGUMENT D'AUTORITÉ** → [R-IN-2GEN](#r-in-2gen) |
| IN14 | `insuline.yaml:251` | `inconvenients` (option prémix) | « Non fondé sur les preuves en 1ʳᵉ intention (ebmfrance) : … (Bertuol […] ; 4T […]) » | **Carte option** | RÉFÉRENCE — donnée (Bertuol, 4T) déjà dans la phrase ; tag « ebmfrance » redondant, nettoyage mineur non prioritaire |
| IN15 | `insuline.yaml:449-451` | `sources.medicalement_geek.synthese` | « Ligne EBM francophone (ebmfrance/Duodecim, Médicalement Geek/DragiWebdo) : basale + oraux/GLP-1 = schéma de choix… » | Panneau argumentaire | **ARGUMENT D'AUTORITÉ** → [R-IN-MG](#r-in-mg) |
| IN16 | `insuline.yaml:458` | `sources.prescrire.synthese` (fin) | « NB : Prescrire ne traite pas la hiérarchie NPH / analogues de 2ᵉ génération dans ces sources » | Panneau argumentaire | RÉFÉRENCE — caveat honnête sur les limites de la source, rien à faire |
| IN17 | `insuline.yaml:476` | `sources.reco_officielle.explication` | « … là où ebmfrance et la SFD 2025 l'écartent ou l'énoncent explicitement » | Panneau argumentaire | **ARGUMENT D'AUTORITÉ** → [R-IN-2GEN](#r-in-2gen) |
| IN18 | `insuline.yaml:479-481` | `sources.reco_officielle.explication` | « … et à la position critique (Prescrire, Médicalement Geek : les cibles de TIR sont un consensus / un substitut…) » | Panneau argumentaire | **ARGUMENT D'AUTORITÉ** → [R-IN-TIR](#r-in-tir) |
| IN19 | `insuline.yaml:487` | `incertitudes` | « Seuil d'over-basalisation de 0,5 U/kg = repère (SFD / Médicalement Geek), **non validé par un essai** — à confirmer » | Panneau argumentaire | RÉFÉRENCE — modèle d'honnêteté (dit lui-même l'absence de preuve), rien à faire |
| — | `insuline.yaml:452` | `medicalement_geek.lien` (URL) | `ebmfrance.net/...` | Panneau argumentaire | *exclu* — simple lien, pas un argument |

### 1.3 `prescription` (fusion B+C+D)

| # | Fichier:ligne | Champ | Citation (extrait) | Écran | Étiquette |
|---|---|---|---|---|---|
| PR1 | `prescription.yaml:674` | `inconvenients` (option Gliptine) | « … pancréatite (signal méta). **Prescrire l'écarte.** Ne jamais associer à un AR GLP‑1. » | **Carte option** | **ARGUMENT D'AUTORITÉ** → [R-PR-GLIPTINE](#r-pr-gliptine) |
| PR2 | `prescription.yaml:847` | `argumentaire` (top-level) | « … Prescrire réserve d'ailleurs la dapagliflozine à l'IC / l'insuffisance rénale » | **Non rendu** (champ jamais câblé à l'écran — cf. §1-2) | **ARGUMENT D'AUTORITÉ** (non prioritaire écran) → [R-PR-DAPA](#r-pr-dapa) |
| PR3 | `prescription.yaml:949` | `sources.prescrire.synthese` | « Gliptines et pioglitazone « plus dangereuses qu'utiles, à écarter quelle que soit la situation » » | Panneau argumentaire | **ARGUMENT D'AUTORITÉ** → [R-PR-GLIPTINE](#r-pr-gliptine) |
| PR4 | `prescription.yaml:962-963` | `sources.reco_officielle.explication` | « (1) Prescrire écarte l'iDPP4 quelle que soit la situation, là où HAS/SFD le gardent en place résiduelle » | Panneau argumentaire | **ARGUMENT D'AUTORITÉ** → [R-PR-GLIPTINE](#r-pr-gliptine) |
| PR5 | `prescription.argumentaire.md:73` | § Palette glycémique | « *Divergence Prescrire* : réserve la dapagliflozine à l'IC / l'insuffisance rénale » | Niveau 3 | **ARGUMENT D'AUTORITÉ** → [R-PR-DAPA](#r-pr-dapa) |
| PR6 | `prescription.yaml:1122` | `meta.changelog[].resume` | « … divergence Prescrire (iSGLT2 non durci en bénéfice d'organe…) » | Non rendu (changelog) | ARGUMENT D'AUTORITÉ dans le texte, non prioritaire (interne) |

### 1.4 `statine` (nœud F)

| # | Fichier:ligne | Champ | Citation (extrait) | Écran | Étiquette |
|---|---|---|---|---|---|
| — | `statine.yaml:33` | `titre` | « **Prescrire** une statine dans le DT2 » | Carte nœud | *exclu — faux positif* : « prescrire » verbe (« prescribe »), pas la revue |
| ST1 | `statine.yaml:98` | `inconvenients` (option prévention primaire) | « sinon la dose modérée suffit (Prescrire ; LODESTAR : viser une cible ≡ dose fixe) » | **Carte option** | **ARGUMENT D'AUTORITÉ** → [R-ST-DOSEFIXE](#r-st-dosefixe) |
| ST2 | `statine.yaml:235-238` | `sources.medicalement_geek.synthese` | « Ligne EBM francophone (Prescrire, Minerva, RecoMédicales, Louvain Médical) : dose fixe … pas de cible LDL dogmatique » | Panneau argumentaire | **ARGUMENT D'AUTORITÉ** → [R-ST-DOSEFIXE](#r-st-dosefixe) |
| ST3 | `statine.yaml:245-246` | `sources.prescrire.synthese` | « … molécule préférée = simvastatine (la mieux évaluée) » | Panneau argumentaire | **ARGUMENT D'AUTORITÉ — DONNÉE À FOURNIR** |
| ST4 | `statine.yaml:284` | `sources.reco_officielle.explication` | « … l'outil pondère l'EBM et les sources critiques indépendantes (Prescrire, Minerva) pour le grain de la décision » | Panneau argumentaire | RÉFÉRENCE — transparence méthodologique (comment l'outil a été construit), pas un argument clinique, rien à faire |
| ST5 | `statine.yaml:293` | `incertitudes` | idem ST4 | Panneau argumentaire | RÉFÉRENCE — idem ST4 |
| ST6 | `statine.argumentaire.md:162` | § Conflits d'intérêt | idem ST4 | Niveau 3 | RÉFÉRENCE — idem ST4 |
| ST7 | `statine.argumentaire.md:164-166` | § 7 « Position critique » | « **Position critique** (Prescrire, Minerva, EBM francophone) : dose fixe … molécule préférée simvastatine » | Niveau 3 | **ARGUMENT D'AUTORITÉ** → [R-ST-DOSEFIXE](#r-st-dosefixe) + [DONNÉE À FOURNIR (simvastatine)] |
| ST8 | `statine.argumentaire.md:226` | § Sources | « Prescrire (« une statine pour certains patients », 2005) ; RecoMédicales / Minerva… » | Niveau 3 | RÉFÉRENCE BIBLIOGRAPHIQUE — légitime |

### 1.5 `rhd` (nœud H)

| # | Fichier:ligne | Champ | Citation (extrait) | Écran | Étiquette |
|---|---|---|---|---|---|
| RH1 | `rhd.yaml:3` | commentaire `#` | « … lecture directe HAS 2024 / SFD 2025 / ebmfrance / Prescrire » | Non rendu (commentaire) | RÉFÉRENCE — méta, non prioritaire |
| RH2 | `rhd.yaml:57` | `avantages` (option socle) | « bénéfiques MÊME en l'absence de perte de poids (grade A, EBM Guidelines/ebmfrance) » | **Carte option** | **ARGUMENT D'AUTORITÉ — DONNÉE À FOURNIR** |
| RH3 | `rhd.yaml:66` | `effet_attendu` (option socle) | « amélioration glycémique et des FDR CV (SFD/HAS/Prescrire) — bénéfice sur critères DURS non démontré » | **Carte option** | RÉFÉRENCE — SFD/HAS = recos officielles légitimes ; phrase déjà honnête (« non démontré ») ; tag « Prescrire » redondant, nettoyage mineur non prioritaire |
| RH4 | `rhd.yaml:74` | `avantages` (option rémission) | « informer le patient de cette possibilité (grade A, ebmfrance) » | **Carte option** | **ARGUMENT D'AUTORITÉ** → [R-RH-INFORMER](#r-rh-informer) |
| RH5 | `rhd.yaml:78` | `inconvenients` (option rémission) | « Recommandation appuyée sur l'EBM (DiRECT/DIADEM-1, ebmfrance grade A) et ADA/EASD » | **Carte option** | RÉFÉRENCE — essais nommés (DiRECT/DIADEM-1), tag « ebmfrance » redondant mais mineur |
| RH6 | `rhd.yaml:181-182` | `sources.medicalement_geek.synthese` | « … cohérente avec Prescrire/Minerva […] (rappel de la neutralité CV de Look AHEAD) » | Panneau argumentaire | RÉFÉRENCE — Look AHEAD nommé et porteur de la donnée |
| RH7 | `rhd.yaml:193` | `sources.reco_officielle.source` | « … EBM Guidelines/ebmfrance (grade A) ; Prescrire (Premiers Choix 2026) » | Panneau argumentaire | RÉFÉRENCE BIBLIOGRAPHIQUE (liste de sources) — **mais note de modélisation** : Prescrire logé dans `reco_officielle.source` aux côtés de HAS/SFD/ADA est une incohérence de schéma (Prescrire n'est pas une reco officielle), à signaler séparément au référent |
| RH8 | `rhd.yaml:209` | `argumentaire` (top-level) | « … l'EBM (DiRECT/DIADEM-1, ebmfrance grade A) et… » | **Non rendu** (champ jamais câblé) | RÉFÉRENCE — DiRECT/DIADEM-1 nommés, non prioritaire (non affiché) |
| RH9 | `rhd.yaml:213` | `argumentaire` (top-level) | « (Prescrire/Minerva ; Look AHEAD neutre sur le cardiovasculaire) » | **Non rendu** | RÉFÉRENCE — Look AHEAD nommé, non prioritaire |
| RH10 | `rhd.yaml:285` | `meta.changelog[].resume` | « … lecture directe HAS/SFD/ebmfrance/Prescrire » | Non rendu (changelog) | RÉFÉRENCE — méta, non prioritaire |
| RH11 | `rhd.argumentaire.md:8` | intro (blockquote) | « … HAS 2024 / HAS parcours obésité / SFD 2025 / EBM Guidelines-ebmfrance / Prescrire » | Niveau 3 | RÉFÉRENCE — liste des sources consultées (méthodologie), légitime |
| RH12 | `rhd.argumentaire.md:44` | § Option 1 | « … même sans perte de poids (grade A, ebmfrance) » | Niveau 3 | **ARGUMENT D'AUTORITÉ — DONNÉE À FOURNIR** (doublon de RH2) |
| RH13 | `rhd.argumentaire.md:48` | § Option 2 | « informer… la possibilité d'une rémission (grade A, ebmfrance) » | Niveau 3 | **ARGUMENT D'AUTORITÉ** → [R-RH-INFORMER](#r-rh-informer) (doublon de RH4) |
| RH14 | `rhd.argumentaire.md:97` | § Reco vs position critique | « … ADA/EASD 2022, ebmfrance (grade A), Prescrire. **Divergences** : » | Niveau 3 | RÉFÉRENCE — liste de convergence (méthodologie), légitime |
| RH15 | `rhd.argumentaire.md:101` | même § | « l'**EBM** (DiRECT/DIADEM-1, ebmfrance grade A) et **ADA/EASD** soutiennent… » | Niveau 3 | RÉFÉRENCE — essais nommés, légitime |
| RH16 | `rhd.argumentaire.md:108` | même § | « critère de substitution non validé sur critères durs (Prescrire, Minerva ; Look AHEAD neutre) » | Niveau 3 | RÉFÉRENCE — Look AHEAD nommé, légitime |
| RH17 | `rhd.argumentaire.md:141` | § Sources | « EBM Guidelines/ebmfrance ; Prescrire (`docs/decision/sources/prescrire-dt2.md`…) » | Niveau 3 | RÉFÉRENCE BIBLIOGRAPHIQUE — légitime |

---

## 3. T3 — Catalogue des reformulations (occurrences ARGUMENT D'AUTORITÉ)

Chaque bloc regroupe les occurrences qui partagent la même donnée d'appui, pour éviter les redites. La
« donnée » citée est chaque fois **présente dans le dépôt**, avec son chemin.

### R-CG — Cible glycémique : seuils précis attribués à Prescrire / Médicalement Geek
*(CG2, CG3, CG4, CG5)*

- **Texte actuel** (ex. CG4) : « Position critique — Prescrire […] viser ≈ 7 % les premières années puis
  ≈ 7,5 % ; […] 7,5–8,5 %, voire 8–9 % […] ».
- **Donnée sur laquelle appuyer** : `cible-glycemique.argumentaire.md:104` (« Aucun ECR de bandes
  étroites → les seuils fins des recommandations sont extrapolés », point 7 de la synthèse critique) ;
  Boussageon, méta 13 essais/34 533 patients, hypoglycémie sévère RR ~2,33 (`cible-glycemique.yaml:116-119`,
  DOI 10.1136/bmj.d4169) ; ACCORD, surmortalité HR 1,22 inexpliquée au serrage intensif vs ADVANCE, 6,5 %
  atteint **sans** surmortalité (`cible-glycemique.yaml:92-99`, DOI 10.1056/NEJMoa0802743 /
  NEJMoa0802987).
- **Reformulation proposée** : « Aucun essai n'a comparé de bandes de cible étroites (extrapolation) ; le
  risque d'hypoglycémie sévère double à triple sous contrôle intensif (Boussageon, méta-analyse BMJ 2011,
  RR ~2,3) sans bénéfice de mortalité démontré chez le diabète établi, et ACCORD a montré une surmortalité
  inexpliquée au serrage agressif (HR 1,22) — d'où une cible plus prudente (~7 %, voire déprescription
  sous 6,5 %) hors du profil UKPDS (sujet jeune, diabète récent, sans maladie cardiovasculaire). »

### R-IN-BASALE — « schéma de choix » de l'insuline basale
*(IN2, IN3, IN11)*

- **Texte actuel** : « … est l'insulinothérapie de choix du DT2 (ebmfrance/Duodecim, niveau B) ».
- **Donnée** : essai randomisé **4T** (Holman, *NEJM* 2007/2009, PMID 17890232 / 19850703, cité juste
  après dans le même document/la même option — `insuline.argumentaire.md:39` tableau,
  `insuline.yaml:128`) : hypoglycémie 2,3 vs 12,0 évén./patient/an et poids +1,9 vs +5,7 kg à 1 an, basale
  vs prandial.
- **Reformulation** : « L'insuline basale du soir associée aux antidiabétiques (oraux et/ou GLP-1) a le
  meilleur profil de tolérance parmi les schémas testés en essai randomisé : hypoglycémie 2,3 vs 12,0
  événements/patient/an et poids +1,9 vs +5,7 kg vs un schéma prandial à 1 an (4T, PMID 17890232) ;
  réalisable en soins primaires. »

### R-IN-PREMIX — prandial/prémélangé « non fondés sur les preuves »
*(IN4)*

- **Donnée** : Bertuol, méta-analyse en réseau 2026, 58 essais/19 122 patients (`insuline.yaml:419-422`,
  DOI 10.1007/s00125-025-06633-x) : prandial −0,38 %, biphasique −0,24 % d'HbA1c seulement (substitution),
  +~1 kg, hausse limite de l'hypoglycémie sévère.
- **Reformulation** : « Le gain d'HbA1c des schémas prandial et prémélangé est modeste (−0,24 à −0,38 %,
  critère de substitution) et se paie en hypoglycémie et en poids (Bertuol, méta-analyse en réseau 2026,
  58 essais/19 122 patients) : ils ne s'imposent pas en 1ʳᵉ intention. »

### R-IN-CRITIQUE — paragraphe « Position critique » du nœud insuline
*(IN6)*

- **Donnée** : ORIGIN (déjà nommé dans le même paragraphe), MACE HR 1,02, mortalité HR 0,98 —
  CV-neutre (`insuline.yaml:359-360`, PMID 22686416) ; Battelino/ATTD 2019, cibles TIR = consensus
  d'experts, pas un critère dur (`insuline.yaml:423-426`, PMID 31177185).
- **Reformulation** : « L'insuline améliore le contrôle glycémique et prévient le microvasculaire
  (extrapolé) mais n'a aucun bénéfice cardiovasculaire démontré (ORIGIN, MACE HR 1,02) ; les schémas
  prandial/prémélangé systématiques ne sont pas soutenus par les essais (cf. Bertuol, R-IN-PREMIX) ; les
  cibles de Time in Range restent un consensus d'experts (Battelino/ATTD 2019), non un critère dur validé
  sur les complications — d'où une vigilance sur le surtraitement, surtout chez l'âgé. »

### R-IN-2GEN — préférence 2ᵉ génération / GLP-1 avant le bolus
*(IN9, IN13, IN17)*

- **Donnée** : SWITCH 2, RR 0,70 global / 0,58 nocturne (`insuline.yaml:371-374`, PMID 28672317) ; EDITION
  poolée, −31 % nocturne (`insuline.yaml:383-386`, PMID 25929311) ; DEVOTE, RR 0,60 hypoglycémie sévère
  degludec vs U100, NNT ~59/2 ans (`insuline.yaml:367-370`, PMID 28605603) ; DUAL VII, hypo rate ratio
  0,11, −3,6 kg, 1 injection vs ≥ 4 (`insuline.yaml:403-406`, PMID 29483185) ; méta Eng RR 0,67
  (`insuline.yaml:407-410`) et Maiorino RR 0,66 (`insuline.yaml:411-414`).
- **Reformulation** : « Chez le patient à risque d'hypoglycémie, préférer un analogue de 2ᵉ génération :
  réduction démontrée de l'hypoglycémie nocturne (SWITCH 2 RR 0,70 ; EDITION U300 −31 %) et, vs glargine
  U100, de l'hypoglycémie sévère (DEVOTE, NNT ~59/2 ans). Avant tout bolus : le GLP-1/l'association fixe
  donne le même contrôle avec moins d'hypoglycémie et de poids (DUAL VII ; méta Eng/Maiorino) — la HAS
  2024 (R.88, accord d'experts) reste silencieuse sur ces deux points. »

### R-IN-MG — synthèse Médicalement Geek du nœud insuline
*(IN15)*

- **Donnée** : cumul de R-IN-BASALE, R-IN-PREMIX, R-IN-2GEN (toutes déjà sourcées dans le même fichier).
- **Reformulation** : « Schéma de choix = basale + oraux/GLP-1, meilleur profil tolérance/poids en essai
  randomisé (4T) ; prandial/prémélangé hors 1ʳᵉ intention (gain HbA1c modeste, Bertuol 2026) ; GLP-1 avant
  le bolus, même contrôle avec moins d'hypoglycémie/poids (DUAL VII, méta Eng/Maiorino) ; vigilance sur le
  surtraitement du sujet âgé (aucune métrique ne prédit fiablement l'hypoglycémie — Battelino 2019 =
  consensus, pas un critère dur). »

### R-IN-TIR — cibles de Time in Range = consensus, pas critère dur
*(IN18)*

- **Donnée** : `insuline.yaml:485` (le champ `incertitudes` du **même fichier**) le dit déjà noir sur
  blanc : Battelino 2019 (PMID 31177185, consensus) ; Beck 2019, DT1, observationnel (PMID 30352896) ; Lu
  2021, DT2, observationnel (PMID 33097560).
- **Reformulation** : « … et le fait que les cibles de Time in Range restent un consensus d'experts
  (Battelino/ATTD 2019), non un critère dur — le lien entre TIR et complications est observationnel (Beck
  2019 en DT1 ; Lu 2021 en DT2) et aucune métrique ne prédit fiablement l'hypoglycémie, d'où un risque de
  surtraitement guidé par la technologie. »

### R-PR-GLIPTINE — gliptines « écartées » par Prescrire
*(PR1, PR3, PR4)*

- **Texte actuel** (PR1) : « … Prescrire l'écarte. » ; (PR3) « … à écarter quelle que soit la situation » ;
  (PR4) « Prescrire écarte l'iDPP4 quelle que soit la situation ».
- **Donnée** : déjà énoncée dans la **même phrase** (PR1) et dans les sources du même fichier : TECOS,
  MACE neutre, IC neutre HR 1,00 (`prescription.yaml:911-914`, DOI 10.1056/NEJMoa1501352) ; SAVOR-TIMI 53,
  signal d'insuffisance cardiaque HR 1,27 pour la saxagliptine (`prescription.yaml:915-918`) ; Lee 2020,
  pemphigoïde bulleuse HR 1,42 (`prescription.yaml:919-922`, DOI 10.1001/jamadermatol.2020.2158) ; signal
  FDA arthralgies, signal méta pancréatite (cités en toutes lettres dans `prescription.yaml:674`).
- **Reformulation** (PR1) : « AUCUN bénéfice sur critère dur (4 CVOT neutres) ; efficacité modeste
  (~0,5-0,8 % HbA1c). Effets indésirables : pemphigoïde bulleuse (Lee 2020 HR 1,42), arthralgies (signal
  FDA), pancréatite (signal méta). Ne jamais associer à un AR GLP‑1. » *(suppression pure de « Prescrire
  l'écarte » — la phrase se suffit déjà à elle-même).*
- **Reformulation** (PR3/PR4) : « Gliptines : aucun bénéfice sur critère dur dans 4 CVOT (TECOS neutre ;
  SAVOR-TIMI 53, signal d'insuffisance cardiaque HR 1,27 pour la saxagliptine), et effets indésirables
  documentés (pemphigoïde bulleuse HR 1,42, signal pancréatite) — une lecture plus prudente les écarte
  entièrement quand HAS/SFD les gardent en place résiduelle bien tolérée pour le reste : c'est le même
  socle de preuve, soupesé différemment. »

### R-PR-DAPA — dapagliflozine réservée à l'IC/l'IR par Prescrire
*(PR2, PR5)*

- **Texte actuel** : « Prescrire réserve d'ailleurs la dapagliflozine à l'IC / l'insuffisance rénale
  (divergence de degré) ».
- **Donnée** : EMPA-REG OUTCOME (`prescription.yaml:851-854`, DOI 10.1056/NEJMoa1504720), DAPA-CKD, NNT
  19/2,4 ans (`prescription.yaml:855-858`, DOI 10.1056/NEJMoa2024816), EMPEROR-Reduced, NNT 19
  (`prescription.yaml:863-866`, DOI 10.1056/NEJMoa2022190) — le bénéfice dur des iSGLT2 est démontré dans
  des essais menés sur des populations **enrichies** (IC, maladie rénale).
- **Reformulation** : « … le bénéfice d'organe des iSGLT2 (mortalité CV, événements rénaux) est démontré
  dans des essais menés sur des populations enrichies en insuffisance cardiaque ou maladie rénale
  (EMPA-REG OUTCOME ; DAPA-CKD, NNT 19/2,4 ans ; EMPEROR-Reduced, NNT 19) — pas dans une population
  purement glycémique, d'où une place plus restreinte hors indication d'organe. »

### R-ST-DOSEFIXE — « dose fixe, pas de cible LDL dogmatique »
*(ST1, ST2, ST7)*

- **Donnée** : LODESTAR, *JAMA* 2023, non-infériorité d'une stratégie dose fixe vs treat-to-target
  (`statine.yaml:205-208`, DOI 10.1001/jama.2023.2487, développée en détail
  `statine.argumentaire.md:104-112`) ; CARDS et HPS, bénéfice démontré à dose fixe, indépendamment du LDL
  de base (`statine.yaml:157-164`).
- **Reformulation** : « Dose fixe de statine calée sur le risque absolu, pas de cible LDL chiffrée : aucun
  essai n'a randomisé deux valeurs cibles de LDL, et une stratégie de treat-to-target n'est pas supérieure
  à une dose fixe de haute intensité (LODESTAR, *JAMA* 2023, non-infériorité) ; CARDS et HPS ont démontré
  le bénéfice à dose fixe, indépendamment du LDL de base. » *(Pour ST1, même logique appliquée localement :
  « … sinon la dose modérée suffit — la population démontrée par CARDS/HPS est traitée à dose fixe
  modérée, et LODESTAR confirme qu'une stratégie de cible n'apporte pas de bénéfice supplémentaire ».)*

### DONNÉE À FOURNIR — 5 occurrences

1. **IN5 / IN12** — `insuline.argumentaire.md:49` / `insuline.yaml:133-135` — « repli fixe 10 U le soir —
   ebmfrance ». Le dossier documente et source la dose d'initiation poids × 0,1-0,2 U/kg (Treat-to-Target,
   PMID 14578243), mais **aucun essai du dépôt ne valide spécifiquement les « 10 U fixes »** comme repli
   quand le poids n'est pas connu — c'est une convention pragmatique d'ebmfrance, non un résultat d'essai.
   **DONNÉE À FOURNIR.**
2. **ST3 / ST7 (volet simvastatine)** — `statine.yaml:245-246` / `statine.argumentaire.md:164-166` —
   « molécule préférée = simvastatine (la mieux évaluée) ». Aucun essai comparatif entre statines n'est
   cité dans le dépôt pour ce point ; à l'inverse, `statine.argumentaire.md:142-144` (§ 6 Sécurité) va
   plutôt dans le sens contraire : simvastatine et atorvastatine, métabolisées par le CYP3A4, ont **plus**
   d'interactions que pravastatine/rosuvastatine/pitavastatine, « à préférer en cas de co-prescription à
   risque ». **DONNÉE À FOURNIR — et tension interne au dossier à signaler au référent** (le nœud
   lui-même argumente plutôt pour pravastatine/rosuvastatine sur le critère interactions).
3. **RH2 / RH12** — `rhd.yaml:57` / `rhd.argumentaire.md:44` — « bénéfiques MÊME en l'absence de perte de
   poids (grade A, EBM Guidelines/ebmfrance) ». Les seules données chiffrées du dossier sur l'activité
   physique (Umpierre, Boulé) portent sur son effet HbA1c en général, pas spécifiquement sur le bénéfice
   *en l'absence* de perte de poids. **DONNÉE À FOURNIR.**

---

## Occurrences exclues du recensement

| Occurrence | Raison de l'exclusion |
|---|---|
| `statine.yaml:33` (`titre`) | Faux positif — « Prescrire » y est le verbe (« Prescrire une statine dans le DT2 »), pas la revue. |
| `insuline.yaml:452` (`medicalement_geek.lien`) | URL brute, pas un argument textuel. |
| `cible-glycemique.yaml:124-126` (`medicalement_geek.synthese`) | Le texte lui-même ne nomme aucune revue (attribution purement structurelle par le libellé de champ/UI — cf. §0), pas une « occurrence textuelle » au sens strict du recensement T1. |

---

## 4. T4 — Règle de rédaction proposée (pour `docs/decision/GRAMMAIRE-NOEUD.md`)

> **R7 — L'argument affiché est la donnée, jamais l'autorité qui la relaie.** Toute affirmation clinique
> visible à l'écran (avantages, inconvénients, effet attendu, alertes, contre-indications, `synthese`,
> `explication`) doit nommer l'essai, la méta-analyse ou le chiffre qui la fonde — jamais le nom d'une
> revue secondaire (Prescrire, Médicalement Geek/DragiWebdo, Minerva, ebmfrance…) comme sujet de la
> phrase (« X écarte… », « X vise… »). Ces revues restent légitimes en référence bibliographique, à côté
> d'une donnée déjà énoncée. Si aucune donnée du dépôt ne soutient une position qui leur est attribuée,
> l'écrire « DONNÉE À FOURNIR » plutôt que de laisser l'autorité de la revue porter seule l'argument.

---

## Retour

**Rapport** : `docs/decision/validation/chantier-2026-07-26/sourcage-position-critique.md`.

**Décompte** — 56 occurrences textuelles classées (+ 3 exclues : 1 faux positif, 1 lien URL, 1 attribution
purement structurelle sans texte) :

| | ARGUMENT D'AUTORITÉ | dont AFFICHÉ AU PRATICIEN | RÉFÉRENCE BIBLIOGRAPHIQUE | Total |
|---|---|---|---|---|
| `cible-glycemique` | 4 | 4 | 3 | 7 |
| `insuline` | 12 | 12 | 6 | 18 |
| `prescription` | 6 | 4 | 0 | 6 |
| `statine` | 4 | 4 | 4 | 8 |
| `rhd` | 4 | 4 | 13 | 17 |
| **Total** | **30** | **28** | **26** | **56** |

**DONNÉE À FOURNIR** : 5 occurrences (IN5, IN12, ST3, RH2, RH12 — détail §3 en fin de catalogue T3), dont
une (ST3, molécule « simvastatine préférée ») en tension avec un autre passage du même dossier.

**Occurrences AFFICHÉ AU PRATICIEN les plus urgentes** (rendues sans aucun clic, directement sur la carte
d'option — donc lues par tout praticien qui consulte le nœud) :

- `prescription.yaml:674` (PR1) — « Prescrire l'écarte » dans les inconvénients de l'option Gliptine.
- `statine.yaml:98` (ST1) — « sinon la dose modérée suffit (Prescrire ; LODESTAR…) » dans les
  inconvénients d'une option de prévention primaire.
- `insuline.yaml:127, 133-135, 149, 251` (IN11, IN12, IN13, IN14) — avantages/effet attendu de 2 options
  d'insuline basale.
- `rhd.yaml:57, 66, 74, 78` (RH2, RH3, RH4, RH5) — avantages/inconvénients/effet attendu des 2 options du
  nœud RHD.

Les occurrences vivant dans `sources.prescrire.synthese` / `sources.medicalement_geek.synthese` /
`sources.reco_officielle.explication` (CG2/CG3, IN15/IN17/IN18, PR3/PR4, ST2/ST7) sont AFFICHÉES dès le
premier clic « Déplier l'argumentaire » (pas besoin d'aller au niveau 3) — deuxième niveau de priorité.

Constat transverse à part (§0) : le préfixe visuel « Prescrire — » / « Médicalement Geek — » est codé en
dur dans `ArgumentPanel.tsx`, indépendamment du contenu du champ — la reformulation du texte (T3) ne
supprime pas ce préfixe ; seule une évolution du schéma le pourrait (hors périmètre de cette mission).
