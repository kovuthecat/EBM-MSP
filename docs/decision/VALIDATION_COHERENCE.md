# Plan de validation systémique du module DT2 — couche 7 : cohérence & robustesse inter-nœuds

> **Statut :** plan (à lancer). **Portée :** domaine `diabete-type-2`, les 7 nœuds A–F, H.
> **Complète** — ne remplace pas — les 6 couches de vérification par nœud décrites dans
> [`00-global.md`](00-global.md) (§ « Garde-fous de vérification »). Ce fichier est aussi une
> **pièce du dossier de défendabilité** : il documente que le module a été soumis à une épreuve
> contradictoire globale, et comment.

---

## 1. Pourquoi ce plan (le trou que les 6 couches ne couvrent pas)

Les 6 couches actuelles sont solides mais ont **toutes le même périmètre : un nœud isolé**
(dossier de preuve OU YAML d'un nœud). Aucune ne regarde le module **comme un système**. Or la
cartographie d'architecture montre que les nœuds sont réellement silotés :

- **aucun graphe de décision, aucun routeur** : l'enchaînement A→B→C→D/E/H n'est encodé nulle part,
  il ne vit que dans la prose (`argumentaire`, `population_cible`) ;
- **aucun schéma commun de critères** : `DFG`, `ASCVD_etablie`, `IMC`, `age`, `albuminurie`,
  `fragilite` sont redéclarés indépendamment dans chaque YAML ;
- **couplages inter-nœuds implicites** : `HbA1c_cible` vient de A mais est recalculée localement dans
  C et E (« cohérence à maintenir » en commentaire, jamais testée) ;
- **double encodage** d'une même règle : seuil-machine (`exclusions: ["DFG < 20"]`) vs seuil-affiché
  (`contre_indications: "Ne pas initier si DFG < 20…"`) — deux chaînes que rien ne synchronise.

Un contradicteur n'attaquera pas un nœud isolé (ils sont robustes) : il attaquera **les coutures**.
Il pose trois questions distinctes, qui appellent trois vérifications distinctes :

| Question du contradicteur | Vérifie | Couvert aujourd'hui ? |
|---|---|---|
| « Le même seuil / la même molécule apparaît-il identique partout ? » | Cohérence des **valeurs** | ❌ Non |
| « Vos **données EBM** sont-elles valides ET mutuellement cohérentes d'un nœud à l'autre ? » | Validité & robustesse des **données**, globalement | ❌ Non (vérifié par nœud, jamais recoupé ni ré-attaqué comme un tout) |
| « Un vrai patient qui traverse plusieurs nœuds obtient-il un parcours sûr et non contradictoire ? » | Cohérence **clinique de parcours** | ❌ Non |

**Point clé (validité des données) :** chaque dossier de preuve a été vérifié bi-agents *isolément*
(couches 1–4). Personne n'a jamais vérifié que la méta-analyse citée dans B et dans C porte le même
NNT, qu'un essai gradé `eleve` ici n'est pas `modere` là sans raison, ou qu'un chiffre d'effet est
cohérent d'un nœud au suivant. **Ce plan ajoute cette vérification globale des données par red-team.**

---

## 2. Principe transversal : red-team **volontairement critique**

Tous les agents de vérification (phases 2 à 5) reçoivent un mandat **adversarial** :

- objectif = **réfuter**, pas confirmer ; en cas de doute, statuer « problème » par défaut ;
- **triangulation obligatoire** : ne jamais conclure sur une seule source, *a fortiori* OpenEvidence ;
- distinguer **critère dur vs substitution**, **effet absolu / NNT**, horizon temporel ;
- traquer le *spin* réintroduit, la contre-indication de sécurité manquante ou non appliquée.

**Garde-fou sources FR (non négociable, cf. [`00-global.md`](00-global.md) § Règles de sourcing) :**
les agents ne demandent **jamais** à OpenEvidence / au web de couvrir **HAS, SFD, CMG, Prescrire,
Médicalement Geek, Minerva, ebmfrance** — il les hallucine. Ces sources se vérifient **uniquement**
contre les fichiers locaux de [`docs/decision/sources/`](sources/). Le web/OE ne sert que pour les
**essais primaires** et les **recommandations internationales indexées** (ADA/EASD, ESC/EAS, KDIGO…).

---

## 3. Le workflow — phases, agents, modèles

Une seule orchestration à 7 phases (0→6). Les phases 0–1 sont mécaniques et bon marché ; le cœur
adversarial (2–5) tourne sur Opus ; la synthèse (6) réconcilie. Chaque *finding* produit en 2–4 est
**vérifié adversarialement** en phase 5 avant d'entrer au rapport (on tue les faux positifs).

### Phase 0 — Inventaire mécanique (extraction)
- **Rôle :** extraire, sans jugement, tout ce qui est partagé entre nœuds, dans des structures
  comparables. Agents parallèles, un par catégorie sur les 7 YAML :
  - seuils numériques (`DFG`, `HbA1c`, `IMC`, `age`…) avec valeur + nœud + justification citée ;
  - molécules (orthographe, dose, palier DFG, CI mentionnées) par nœud ;
  - déclarations `criteres_entree` (nom, `type`, `valeurs`) par nœud ;
  - garde-fous (`exclusions` DSL **et** `contre_indications` prose) par nœud ;
  - couplages inter-nœuds (`derive`, références « nœud A », `cible_atteinte`, `terrain_fragile`).
- **Sortie :** inventaire structuré (JSON) — la matière première des phases 1 et 2.
- **Modèle :** **Haiku 4.5**, effort **low**. *Extraction fidèle de YAML structuré, zéro jugement clinique, fort parallélisme → le modèle le moins cher suffit et va vite.*

### Phase 1 — Audit de cohérence des **valeurs**
- **Rôle :** sur l'inventaire, détecter mécaniquement : seuils divergents (même paramètre, valeur **ou
  justification** différente — ex. DFG<30 justifié RCP ANSM dans B/C mais convention KDIGO/SFD dans D) ;
  critères homonymes de `type`/`valeurs` discordants ; **parité prose↔DSL** (le seuil affiché =
  le seuil exécuté ?) ; lexique molécules incohérent ; traces mortes (ex. DFG<15 résiduel dans
  `statine.yaml`/argumentaire alors qu'il est remplacé par le bool `dialyse`).
- **Sortie :** liste de divergences de valeurs, chacune localisée (fichier:ligne).
- **Modèle :** **Sonnet 5**, effort **medium**. *Comparaison structurée à faible incertitude ; la
  vérité est dans la confrontation des valeurs extraites, doublée ensuite par des tests de code.*

### Phase 2 — Red-team **DONNÉES inter-nœuds** (validité + cohérence EBM globale) ★ point ajouté
- **Rôle :** l'épreuve que personne n'a faite. Prendre les affirmations EBM (`effet_attendu`,
  `niveau_preuve`, `sources`/DOI, argumentaires) et, **à travers les nœuds** :
  - le **même essai/la même méta** est-il cité avec les **mêmes chiffres** (NNT, HR, horizon) partout ?
  - une molécule/classe est-elle **gradée pareil** (GRADE) d'un nœud à l'autre, ou divergence injustifiée ?
  - une affirmation d'un nœud **en contredit-elle** une autre (ex. bénéfice rénal iSGLT2 énoncé
    différemment en B et C) ?
  - re-challenger la **validité** de chaque donnée pivot partagée contre la **source primaire**
    (garde-fou FR ci-dessus), pas seulement sa cohérence.
- **Méthode :** **loop-until-dry** — on relance des vagues d'agents critiques jusqu'à 2 tours sans
  nouveau grief, pour attraper la traîne. Dédup des griefs entre vagues.
- **Sortie :** findings « données » (incohérence / donnée non re-vérifiable / contradiction), sévérité.
- **Modèle :** **Opus 4.8**, effort **max**. *Cœur clinique à plus fort enjeu : raisonnement EBM
  adversarial, subtil, sur critères durs vs substitution. C'est ici qu'on investit.*

### Phase 3 — Vignettes cliniques (génération + confrontation, multi-agent)
- **3a — Génération (j'élabore les vignettes) :** agents-cliniciens construisent un **banc de profils
  patients réalistes** couvrant (i) l'espace de décision de chaque nœud et surtout (ii) **les coutures**
  (patients censés enchaîner A→B→C→E, socle→intensification, échec oral→insuline, obésité→rémission…).
  Chaque vignette = jeu **complet** de critères + trajectoire clinique attendue + ce qu'elle éprouve.
- **3b — Confrontation (multi-agent) :** d'autres agents jouent le clinicien : pour chaque vignette,
  ils **choisissent la séquence de nœuds** qu'un praticien suivrait (ce qui teste le routage prose-only),
  évaluent chaque nœud via le moteur, puis **jugent la trajectoire complète** de façon critique —
  contradiction entre nœuds ? impasse ? chemin cliniquement dangereux ? garde-fou d'un nœud
  contournable en arrivant par un autre ?
- **Sortie :** banc de vignettes **versionné** (réutilisable en non-régression) + verdicts de trajectoire.
- **Modèle :** **Opus 4.8**, effort **high** (génération) / **max** (confrontation). *Jugement clinique
  sur le comportement du système, pas sur une valeur isolée.*

### Phase 4 — Red-team contradictoire (personas hostiles)
- **Rôle :** simuler l'attaque réelle. Trois personas, chacun mandaté pour produire **l'attaque la plus
  forte** possible : (a) généraliste sur-critique façon Prescrire (anti-sur-traitement), (b)
  diabétologue « maximaliste des recos » (pro-HAS/SFD à la lettre), (c) néphrologue/cardiologue ciblant
  les garde-fous rénaux et le signal IC des gliptines. Un agent-arbitre confronte chaque attaque au
  **registre des divergences assumées** : l'objection est-elle déjà tracée et justifiée, ou est-ce un
  vrai défaut ?
- **Sortie :** liste d'attaques + statut (déjà couvert / défaut réel / désaccord de degré).
- **Modèle :** **Opus 4.8**, effort **high**. *Raisonnement adversarial + connaissance fine des recos.*

### Phase 5 — Vérification adversariale des findings (anti-faux-positif)
- **Rôle :** chaque finding des phases 1–4 est soumis à un **panel de sceptiques indépendants**
  mandatés pour le **réfuter** (défaut = « réfuté » si incertain) ; survit s'il résiste à la majorité.
  Évite qu'un grief plausible-mais-faux entre au rapport.
- **Sortie :** findings **confirmés**, triés par sévérité, avec scénario d'échec concret.
- **Modèle :** **Opus 4.8**, effort **high**. *Les réfutateurs doivent être aussi forts que les
  découvreurs, sinon le filtre ne vaut rien.*

### Phase 6 — Synthèse, priorisation & squelette de défendabilité
- **Rôle :** consolider tous les findings confirmés, dédupliquer, prioriser (bloquant / à corriger /
  divergence à documenter), produire la **liste de remédiation** ; et amorcer les **registres de
  défendabilité** : limites/hors-périmètre, **divergences assumées** (ex. Prescrire écarte les gliptines
  vs HAS/SFD — le *pourquoi*), conflits d'intérêt, note de méthodo publique, cadence de révision.
- **Sortie :** rapport unique + squelettes de registres + spec des tests de non-régression à coder.
- **Modèle :** **Opus 4.8**, effort **max**. *Rôle « Opus réconcilie » de la méthode existante, au
  niveau module.*

---

## 4. Récapitulatif modèles / effort

| Phase | Rôle | Modèle | Effort | Pourquoi ce modèle |
|---|---|---|---|---|
| 0 | Inventaire (extraction) | Haiku 4.5 | low | Extraction mécanique de YAML, aucun jugement |
| 1 | Cohérence des valeurs | Sonnet 5 | medium | Comparaison structurée, faible incertitude |
| 2 | **Red-team données inter-nœuds** | **Opus 4.8** | **max** | Raisonnement EBM adversarial, plus fort enjeu |
| 3 | Vignettes (génération + confrontation) | Opus 4.8 | high / max | Jugement clinique sur le système |
| 4 | Red-team contradictoire (personas) | Opus 4.8 | high | Adversarial + connaissance des recos |
| 5 | Vérification adversariale des findings | Opus 4.8 | high | Réfutateurs de niveau égal aux découvreurs |
| 6 | Synthèse & défendabilité | Opus 4.8 | max | Réconciliation module-wide |

---

## 5. Livrables

1. **Carte de cohérence** — matrice paramètre partagé × nœud, divergences surlignées.
2. **Banc de vignettes versionné** — réutilisable en non-régression clinique.
3. **Registre des findings confirmés** — triés par sévérité, scénario d'échec + remédiation.
4. **Spec des tests de non-régression inter-nœuds** — à coder ensuite (seuils, lexique molécules,
   parité prose↔DSL, accord cibles A/C/E) pour figer la cohérence dans la CI (Ajv + Vitest existants).
5. **Squelettes des registres de défendabilité** — limites, divergences assumées, CI, méthodo, cadence.

---

## 6. Exécution

- **Un seul run** de workflow (phases 0→6) si l'on veut le rapport complet d'un coup ; **ou** plusieurs
  runs séquentiels (0-1 mécanique → 2 données → 3 vignettes → 4-5 red-team → 6 synthèse) pour **relire
  entre chaque phase**. Recommandé au premier passage : séquentiel, pour arbitrer avant d'investir Opus.
- **Entrées** : les 7 YAML + `.argumentaire.md`, les dossiers de preuve `noeuds/*.md`, le schéma, le
  moteur (`engine/`), et les sources locales `docs/decision/sources/`.
- Ce workflow **ne remplace pas la validation clinique finale du référent** : il la *prépare* (il lui
  livre une liste de divergences triées au lieu d'une relecture à froid), et il reste à finaliser la
  validation de **D et E** (encore en brouillon v0.1) — moment naturel pour absorber ses conclusions.

---

## 7. Ce que le plan ne prétend pas faire

- Il ne re-vérifie pas *ab initio* chaque donnée de chaque nœud (couches 1–4 déjà passées) : il
  vérifie la **cohérence et la validité au niveau système**, et re-challenge les seules données
  **partagées / aux coutures**.
- Il ne tranche pas les désaccords cliniques ouverts : il les **remonte** au référent, documentés.
