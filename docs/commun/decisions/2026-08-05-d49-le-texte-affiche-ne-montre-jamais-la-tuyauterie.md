# 2026-08-05 — D49 · Le texte affiché ne montre jamais la tuyauterie, et le badge de preuve dit ce qu'il gradue

### Décision

**Deux règles d'écriture opposables, tous domaines, verrouillées par un invariant.**

1. **Aucun texte rendu au praticien ne montre la tuyauterie du projet.** Sept familles s'ajoutent à I25
   (`engine/banc/jargon-projet.test.ts`), en plus des marqueurs de process (2026-07-30) et d'autorité
   (2026-08-04) : un identifiant de code entre accents graves, un chemin du dépôt ou un nom de fichier
   `.md`/`.yaml`/`.ts`/`.json`, un statut éditorial (« brouillon », « en attente de relecture »), un
   marqueur de rédaction (`[À VÉRIFIER]`, « DONNÉE À FOURNIR »), un renvoi interne (« dossier de preuve »,
   « cf. changelog »), le vocabulaire du moteur (« sentinelle », `evaluateNode`, « DSL », « golden
   master », « banc de test », « profils du banc ») et un identifiant de décision parenthésé (`(D20)`,
   `(R1)`). **Portée** : les champs affichés des nœuds et des modules, **et** les argumentaires
   exhaustifs, qui sont rendus à 100 % sans aucun tri de section.

2. **Le badge de niveau de preuve gradue la certitude de la donnée, jamais la force de la
   recommandation.** Cette convention, jusqu'ici seulement en commentaire de fichier, est désormais
   **écrite dans le champ `argumentaire` de chaque nœud concerné et au niveau exhaustif**. Corollaire posé
   au même moment : un badge et un `delai_benefice` qualifient **le geste que la carte titre**, jamais un
   traitement alternatif mentionné dans son corps.

### Contexte

La relecture des quatre niveaux de lecture des six nœuds DT2 (2026-08-05) a trouvé la même famille de
défaut partout : le contenu parlait de l'outil, du dépôt et de son propre chantier au lieu de parler du
patient. Deux constats ont motivé le passage en règle opposable plutôt qu'un nettoyage de plus :

- **C'était la quatrième passe de nettoyage manuel du même corpus**, et la troisième fois qu'un lot de
  marqueurs était ajouté après coup. Le nettoyage ponctuel ne tient pas, parce que l'auteur d'un nœud a le
  champ YAML sous les yeux au moment où il rédige le texte que le praticien lira.
- **Le badge disait le contraire de ce que la carte voulait dire** : quatre cartes de `prescription`
  affichent « Preuve faible » sur des contre-indications formelles — une contre-indication de RCP
  qu'aucun essai n'établira jamais reste étiquetée « preuve faible » sans que la conduite soit discutable.
  Sur `statine`, une carte intitulée « Interrompre la statine » portait « Preuve modérée » et un délai de
  bénéfice de 3-4 ans qui qualifiaient en réalité le traitement alternatif cité plus bas.

### Conséquences

- **Aucune dette, aucune exemption** : les sept marqueurs ont été mesurés à zéro sur le corpus corrigé
  (6 nœuds, module `rhd`, 6 argumentaires exhaustifs) avant d'entrer dans l'invariant. Un marqueur qui part
  de zéro n'a rien à amnistier — à la différence du lot du 2026-08-04, arrivé sur un corpus existant.
- **Un nouveau nœud ou un nouveau domaine hérite des deux règles sans réglage.** L'invariant ne connaît
  aucun nom de nœud ni de critère.
- **Ce qui relève de la méthode reste tracé, hors de l'écran** : les commentaires YAML (jamais chargés) et
  `meta.changelog` (jamais rendu) gardent la mémoire de chantier. Seuls les champs de valeur sont visés.
- **Un test qui asserte sur la typographie d'un texte affiché est un test fragile** : quatre assertions
  vérifiaient une casse ou la forme d'un sigle que cette passe avait pour objet de corriger. Elles ont été
  rendues insensibles à la typographie, leur garde-fou de fond inchangé. À écrire ainsi d'emblée.

**Détail complet de la passe, et les 13 arbitrages qu'elle laisse ouverts** :
`docs/decision/validation/passe-redaction-2026-08-05.md`.
