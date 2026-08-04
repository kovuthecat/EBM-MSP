# Revue de conception — nœuds décisionnels DT2 (Fable, 2026-08-04)

> Mission : confronter le rapport de recette [`recette-praticien-naif-2026-08-04.md`](recette-praticien-naif-2026-08-04.md)
> au comportement réel de l'interface, analyser la structure des nœuds « Traiter » (`prescription`) et
> « Insuline » (`insuline`), et en tirer des recommandations de conception + des principes réutilisables
> pour les futurs modules. L'audit est un point de départ, pas une liste exhaustive.
>
> Contenu clinique : **déjà validé** — cette revue ne porte pas sur le fond médical.
> Statut : **rapport incrémental** — complété au fil de l'exploration. Voir « Point de reprise » en fin de document.

---

## 1. Résumé exécutif évolutif

1. **Le défaut le plus grave de l'audit (D1+D2, N25) a une cause unique et un correctif court.**
   Vérifié en direct : la carte « Ajouter · Insuline d'initiation » **existe, est bien conçue** (Mesure de
   sécurité, motif « HbA1c ≥ 10 et glucotoxicité et cétonémie », mise en garde DT1 incluse — elle répond
   même à la remarque DT1 de N25) et se rend parfaitement dès que `Traitements en cours` est connu. Elle
   ne s'affichait pas parce que l'intention *Initier* masque la section TRAITEMENT alors que le moteur
   continue d'exiger ce critère. **Correctif : l'intention *Initier* doit valoir déclaration
   `Traitements en cours = aucun`** (valeur dérivée, affichée comme telle, modifiable). Une inférence,
   deux défauts graves fermés.
2. **Découverte non signalée par l'audit : le changement d'intention détruit silencieusement des données.**
   Optimiser→Initier→Intensifier : les sections TRAITEMENT et TOLÉRANCE reviennent **vides** (metformine,
   dose, intolérance digestive perdues, sans un mot). L'audit croyait l'aller-retour « récupérable » ;
   il ne l'est pas. L'intention doit être une **lentille** (masque/affiche), jamais une gomme.
3. **D3 confirmé + une occurrence non recensée** (« Optimiser l'agent mal toléré écarté : … », même
   disjonction brute). Le contraste est éclairant : le rendu « branche vraie, en français » **existe déjà**
   — les motifs de carte l'utilisent (« Dose de metformine excessive pour ce DFG (30-44) ») — seule la
   ligne d'écartement passe par un chemin de rendu qui affiche l'expression complète. Correctif : un seul
   moteur de rendu de conditions pour les deux usages.
4. **Cause racine de D13 identifiée : « Rien à signaler » est un instantané, pas une déclaration.**
   Il répond « Non » aux seuls drapeaux décisifs *à cet instant* ; un drapeau devenu décisif ensuite
   (Dénutrition, quand poids/taille arrivent) redevient « à confirmer » dans une section que le praticien
   croit soldée. Le geste doit être **durable** (« rien à signaler » = Non à tous les drapeaux de la
   section, y compris futurs) ou dire ce qu'il n'a pas couvert.
5. **Ce qui marche remarquablement bien et doit devenir le standard des futurs modules** : l'accordéon à
   résumés d'une ligne ; les mentions dynamiques « · sans effet sur la reco actuelle » / « · détermine la
   suite » sur chaque champ ; le bouton « Indisponible » ; les valeurs dérivées (IMC, espérance de vie,
   doses) ; la correction en place (2 gestes, recalcul immédiat et cohérent) ; le cadrage qui déclare ce
   que le nœud n'a pas regardé ; les cartes de sécurité rendues même quand la reco est « provisoire ».
6. **Cause profonde de D12 et D17, vérifiée sur le parcours le plus fréquent** (cible → Traiter) : la
   mémoire de session partage des **critères** (entrées), jamais des **conclusions** (sorties de nœud).
   La « Cible ≤ 7 % » que l'outil vient de calculer n'existe pas comme valeur de session : rien ne peut
   pré-remplir « Par rapport à l'objectif ». (Nuance de seconde passe : les réponses « Rien à
   signaler » circulent bien en session — vérifié entre les deux nœuds RHD ; la Fragilité qui n'arrive
   pas de `cible` vers `prescription` relève probablement d'un double encodage du critère, famille I4.)
   Proposition structurante : chaque nœud peut **exporter sa conclusion comme critère de session**
   (`exports:` dans le contenu), et un critère calculable à partir de valeurs de session se pré-remplit
   « · calculé, à vérifier ». C'est la généralisation propre du mécanisme P0-d de juillet.

## 2. Recommandations prioritaires

> Détail de chaque recommandation dans les sections 4 (T1-T6), 5 (I1-I5) et 7-9 (P1-P5).
> Coût : F = faible, M = moyen, É = élevé.

### Critiques

| Réf | Recommandation | Coût | Ferme |
| --- | --- | --- | --- |
| **T1** | *Initier* ⇒ `Traitements en cours = aucun` (valeur dérivée, affichée, modifiable) | F | D1 + D2 (N25) |
| **T2/I1** | Séparer valeur et visibilité : aucune bascule d'intention ou de situation n'efface une saisie ; invariant A→B→A = identité | F | perte de données silencieuse (nouveau) |
| **T3** | Un seul moteur de rendu de conditions (branche vraie + libellés), partagé cartes/écartements ; invariants transversaux « pas de “ou” brut », « pas de “: non” » | F-M | D3, D18, D20 (en partie) |

### Importantes

| Réf | Recommandation | Coût | Ferme |
| --- | --- | --- | --- |
| **P1** | `exports:` — un nœud publie sa conclusion comme valeur de session ; les critères calculables se pré-remplissent « · calculé, à vérifier » | M | D12, D17 (racine) |
| **T4** | L'état « en attente » restitué par option (le composant existe) ; options de sécurité en attente nommées en clair | F | D1 (résiduel), opacité N25 |
| **T5** | « Rien à signaler » durable (Non à toute la section, drapeaux futurs compris) + résumé exhaustif + propagation en session | F | D13 + Fragilité non transmise |
| **T6** | Alerte ↔ option : lien déclaratif `option_liee`, état de l'option affiché sous l'alerte | M | N25 (alerte vs carte), D6 (famille) |
| **I2** | Synchroniser « Situation d'insulinothérapie » ↔ « Traitements en cours » (dérivation ou alerte d'incohérence) | M | contradiction tolérée sur le même écran |
| **I3** | Partager poids/taille en session ; revoir la liste `partage` (tout critère objectif stable) | F | ressaisie du poids qui pilote les doses |

### Souhaitables

| Réf | Recommandation | Coût |
| --- | --- | --- |
| **I4a** | Dédupliquer les littéraux dans les conjonctions rendues (D19) | F |
| **I5** | Règle éditoriale : les références ne parlent jamais du nœud (« Le nœud n'avait encodé… ») + invariant de recette | F |
| **P4** | Auto-avance de l'accordéon après un choix segmenté unique (l'intention, la situation) — supprime 1 clic par section de ce type | F |
| **P5** | Le champ d'un critère décisif réclamé par le cartouche doit être atteignable en un clic (lien cartouche → section) | F-M |

### Secondaires

| Réf | Recommandation | Coût |
| --- | --- | --- |
| **I4b** | Mutualiser les références dupliquées entre cartes d'un même écran (à prototyper) | M |
| — | Coquille « 1 autre restent à renseigner » (accord) | F |
| — | Harmoniser le garde-fou de reprise (choix explicite « Reprendre / Repartir de zéro » sur `prescription`, application directe sur `insuline`) | F |

## 3. Méthode et périmètre

- **Documents utilisés** : `recette-praticien-naif-2026-08-04.md` (lu en entier, 1230 lignes),
  `CLAUDE.md` (invariants du projet), `launch.json`. Le code source n'a **pas** été lu (mission
  produit/UX, pas revue de code) ; les YAML de contenu non plus, hors citations de l'audit.
- **Environnement** : serveur de dev Vite (`ebm-msp-dev`, port 5174), navigateur intégré, fenêtre
  1600 × 1000 (deux colonnes), arbre de travail du 2026-08-04 (celui de l'audit, D48 incluse).
- **Nœuds explorés en direct** : `prescription` (Traiter) — 4 parcours ; `insuline` — 4 situations ;
  `cible-glycemique` — 1 parcours + enchaînement vers Traiter. `statine` et les deux nœuds RHD n'ont
  **pas** été rejoués (couverts par l'audit, défauts jugés bien circonscrits — cf. §6).
- **Méthode d'interaction** : clics programmatiques `element.click()` isolés (un par bouton segmenté),
  saisies numériques par setter natif + événement React, état relu après chaque re-rendu — mêmes
  précautions que l'audit (son piège n° 3). Les gestes comptés sont ceux qu'un praticien ferait.
- **Tâches déléguées** : aucune. Le coût de cadrage d'un sous-agent aurait dépassé l'économie sur
  chaque tâche envisagée (les explorations utiles exigeaient un jugement de conception à chaque pas).
- **Limites** : **aucune capture d'écran n'a fonctionné** (panneau navigateur non affiché, session
  autonome) — tous les constats sont des mesures DOM ; **aucun jugement de saillance visuelle,
  couleur ou hiérarchie graphique** dans ce rapport (les hauteurs de cartes repliées, 78 px, sont
  mesurées, pas vues). Le mobile n'a pas été testé. Le mode « 2 positions de lecture » (bascule reco
  officielle / position critique) n'a pas été actionné.

## 4. Analyse détaillée du nœud « Traiter » (`prescription`)

### 4.1 Parcours joués (faits observés)

- **Parcours A (chemin principal)** — Optimiser · Metformine · dose 2000 · intolérance digestive ·
  HbA1c 7,7 / Au-dessus · DFG 41 · Normoalbuminurie · 90 kg / 1,78 m · Rien à signaler ·
  Âge 66. ≈ 20 gestes praticien. Résultat : 2 options (« Réduire · Metformine » Mesure de sécurité ;
  « Ajouter · iSGLT2 » Recommandée `Preuve élevée`), alerte dose/DFG, lignes d'écartement.
- **Parcours B (correction en place)** — DFG 41 → 55 sur formulaire rempli : 2 gestes (rouvrir la
  section, éditer), recalcul immédiat : le motif de la carte perd la branche « Dose excessive pour ce
  DFG (30-44) », l'alerte 30-44 disparaît, aucune incohérence résiduelle. **Conforme, fluide.**
- **Parcours C (changement d'intention sur formulaire rempli)** — Optimiser → Initier : section
  TRAITEMENT supprimée **et valeurs effacées** ; TOLÉRANCE vidée aussi ; l'écran réclame
  « À renseigner pour trancher : Traitements en cours, Dose de metformine » — deux critères que le
  formulaire ne présente plus. **Impasse D2 reproduite.** Retour à Intensifier : sections de retour,
  vides (« 1 à confirmer », « Aucun champ renseigné »). **Perte de données silencieuse.**
- **Parcours D (N25 : glucotoxicité)** — Initier · HbA1c 11,4 / Nettement au-dessus · glucotoxicité Oui ·
  cétonémie Oui : alerte cétonémie en tête (prescrit l'insuline), **zéro carte**, panneau « Pourquoi pas
  d'autres options ? » lu en entier (21 entrées) : « Insuline d'initiation » n'y figure pas — elle est
  dans les limbes « en attente », sans être nommée. Puis, en re-déclarant les traitements (Intensifier ·
  Metformine 2000) : **la carte « Ajouter · Insuline d'initiation » apparaît** — Mesure de sécurité,
  `Preuve très faible`, motif « HbA1c ≥ 10 et Symptômes de glucotoxicité et Cétonémie »,
  contre-indication « Cétonémie ≥ 3 mmol/L → urgence, hors périmètre », et argumentaire « Suspecter un
  DT1 devant une cétose / un amaigrissement rapide ».

### 4.2 Diagnostic structurel — les cinq mécanismes du nœud

Le nœud repose sur cinq mécanismes qu'il faut nommer pour raisonner dessus :

1. **Visibilité des champs** — pilotée par l'intention et par les valeurs (Initier masque TRAITEMENT ;
   metformine cochée fait apparaître la dose).
2. **Décisivité des critères** — calculée par le moteur sur l'ensemble des 25 options : un critère est
   réclamé s'il départage des options encore indéterminées ; les mentions « · détermine la suite »,
   « · sans effet sur la reco actuelle », « · à confirmer » en découlent.
3. **Classement des options** — appliquée / écartée / en attente, avec zones (sécurité, socle, choix de
   l'agent, allègement, repli) et badges.
4. **Rendu des conditions** — deux chemins distincts : motifs de carte (réduits à la branche vraie,
   libellés français nommés) et lignes d'écartement (expression brute complète).
5. **Alertes de nœud** — texte conditionnel, informatif, non relié aux options.

**Les quatre défauts majeurs du nœud sont tous des désaccords entre deux de ces mécanismes :**

| Défaut | Conflit |
| --- | --- |
| D2 (critère bloquant introuvable) | visibilité (1) dit « masqué », décisivité (2) dit « requis » |
| D1 (insuline évaporée) | classement (3) « en attente » n'est pas restitué comme les deux autres états |
| D3 (expression brute) | rendu (4) : le chemin « écartement » n'a pas reçu le correctif du chemin « motif » |
| N25 (alerte vs carte) | alertes (5) et options (3) parlent du même geste sans se connaître |

### 4.3 Recommandations

#### T1 — L'intention *Initier* doit déclarer `Traitements en cours = aucun`

- **Périmètre** : nœud `prescription`, moteur de critères.
- **Constat** : *Initier* masque la section TRAITEMENT mais laisse le critère « inconnu » ; toute option
  qui en dépend (dont Insuline d'initiation) reste « en attente » sans issue possible.
- **Source** : parcours C et D ci-dessus ; audit D1/D2/N25.
- **Impact en consultation** : réponse fausse chez le patient le plus urgent du banc ; outil bloqué.
- **Proposition** : quand l'intention vaut *Initier*, le moteur reçoit `traitements = ∅` comme **valeur
  dérivée** (même statut que l'IMC calculé : affichée dans le résumé de section comme « déduit de
  l'intention », modifiable en changeant d'intention). Aucun nouveau composant.
- **Bénéfice attendu** : ferme D1 et D2 d'un coup ; la carte insuline (déjà bien conçue) se rend.
- **Coût** : faible. **Priorité** : **critique**. **Portée** : mécanisme global (tout nœud dont un champ
  de visibilité conditionnelle porte un critère décisif). **Validation** : clinique rapide (l'équivalence
  « Initier ⇒ naïf de tout traitement » doit être assumée ; c'est déjà la sémantique du formulaire).
- **Confiance** : forte (testé en direct dans les deux sens).

#### T2 — Le changement d'intention ne doit jamais effacer une valeur saisie

- **Constat** : Optimiser→Initier→Intensifier détruit TRAITEMENT et TOLÉRANCE sans avertissement.
- **Source** : parcours C (constat nouveau, absent de l'audit).
- **Impact** : un praticien qui corrige son intention en cours de saisie (cas réel : il découvre en
  consultation que le patient a arrêté seul son traitement) perd des données sans le savoir ; risque de
  conclure sur un dossier incomplet en croyant l'avoir rempli.
- **Proposition** : les valeurs des sections masquées sont **conservées en mémoire et restaurées** si la
  section réapparaît ; c'est la visibilité qui change, pas l'état. (Les valeurs masquées ne doivent
  évidemment pas alimenter le moteur tant qu'elles sont masquées — sauf T1 où c'est l'inférence qui prime.)
- **Coût** : faible (séparer « valeur » et « visible » dans l'état). **Priorité** : **critique**.
  **Portée** : globale (pattern pour tout formulaire conditionnel). **Validation** : aucune.
  **Confiance** : forte.

#### T3 — Un seul moteur de rendu de conditions (fermer D3 définitivement)

- **Constat** : le rendu « branche vraie, libellés nommés » existe (motifs de carte) ; les lignes
  d'écartement affichent la disjonction brute. Occurrence supplémentaire trouvée : « Optimiser l'agent
  mal toléré écarté : … » (encore plus longue que celle de l'audit).
- **Source** : parcours A ; audit D3.
- **Proposition** : faire passer la ligne d'écartement par le même chemin que « Proposé parce que »
  (réduction à la/les branches vraies + libellés `label` du contenu). Ajouter l'invariant de test
  transversal suggéré par l'audit : *aucun texte rendu ne contient « ou » suivi d'une conjonction de
  plus de N littéraux ; aucun texte rendu ne contient « : non »*. Ces invariants tournent sur **tous**
  les nœuds (c'est la famille « correctif non propagé » de l'audit, D18 compris).
- **Coût** : faible à moyen. **Priorité** : **critique** (langage machine en écran clinique, se lit comme
  un ordre d'arrêt — D20). **Portée** : globale. **Validation** : technique. **Confiance** : forte.

#### T4 — Restituer l'état « en attente » par option, pas seulement par critère

- **Constat** : une option en attente disparaît de toute liste visible (ni carte, ni écartée, ni
  « pourquoi pas »). Le cartouche agrège les critères manquants (« Commencez par : … ») mais ne dit
  jamais *quelles options* sont suspendues. Chez N25, la seule option vitale était précisément dans ces
  limbes.
- **Source** : parcours D ; l'écran vide du nœud montre pourtant que la liste « option par option (25) »
  existe déjà à l'état initial — elle disparaît en cours de saisie (remplacée par le panneau « Pourquoi
  pas d'autres options ? » qui ne couvre que les écartées).
- **Proposition** : le détail « option — à renseigner : X, Y » (déjà implémenté pour l'état vide) doit
  rester accessible à tout moment ; et une option **de sécurité** en attente doit être nommée en clair
  dans le cartouche (« Insuline d'initiation — en attente de : Traitements en cours »). La hiérarchie du
  « Commencez par » gagnerait à prioriser les critères qui débloquent des options de sécurité avant ceux
  qui « débloquent le plus d'options ».
- **Coût** : faible (le composant existe). **Priorité** : **importante**. **Portée** : globale.
  **Validation** : UX. **Confiance** : forte.

#### T5 — « Rien à signaler » doit être durable ou dire sa limite

- **Constat** : le geste répond « Non » aux seuls drapeaux décisifs à l'instant T ; « Dénutrition »
  redevient « à confirmer » quand poids/taille arrivent ; le résumé ne liste que les drapeaux
  explicitement répondus (cause racine de D13).
- **Source** : parcours A (observé en direct : section « soldée » ré-affichant « 1 à confirmer »).
- **Impact** : le seul contrôle du praticien sur ce qu'il a déclaré (le résumé replié) est incomplet ;
  un geste global devient invérifiable ; retour inattendu dans une section « finie ».
- **Proposition** : « Rien à signaler » enregistre **Non pour tous les drapeaux de la section**, y
  compris ceux qui deviendraient décisifs ensuite ; le résumé liste alors la section entière (« 5
  drapeaux : Non »), compact et exhaustif.
- **Coût** : faible. **Priorité** : **importante**. **Portée** : globale (le composant drapeaux est
  générique). **Validation** : clinique légère (un « Non » global est-il toujours un constat, jamais un
  défaut de recueil ? — c'est déjà la sémantique affichée du bouton). **Confiance** : forte.

#### T6 — Relier alertes et options quand elles parlent du même geste

- **Constat** : l'alerte cétonémie prescrit « insuline d'initiation » pendant que la zone options
  l'ignore (en attente) ou, dans l'audit, affiche metformine seule. Deux sous-systèmes sans lien.
- **Source** : parcours D ; audit N25 (« l'alerte prescrit l'insuline, la carte prescrit la metformine »).
- **Proposition minimale** (sans refonte) : quand une alerte de nœud nomme un geste qui correspond à une
  option du corpus, le contenu YAML porte la référence (`alerte.option_liee: insuline-initiation`) et le
  rendu ajoute sous l'alerte l'état de cette option : « → option “Insuline d'initiation” : en attente de
  Traitements en cours » / « → voir la carte ci-dessous ». C'est data-driven, pas un nouveau moteur.
- **Coût** : moyen. **Priorité** : **importante**. **Portée** : globale. **Validation** : UX + contenu.
  **Confiance** : moyenne (la valeur est sûre ; la forme exacte à prototyper).

### 4.4 Ce que le nœud fait bien (à standardiser, ne pas « corriger »)

- **L'accordéon à résumés d'une ligne** : saisie prévisible, zéro défilement, contrôle de ce qui a été
  déclaré. C'est le bon modèle pour un nœud à 22 champs — pas un wizard multi-écrans, pas une page plate.
- **Les mentions dynamiques par champ** (« · détermine la suite », « · sans effet sur la reco
  actuelle », « · à confirmer », « · calculé », « · repris de votre saisie ») : c'est une **innovation
  réelle** — le formulaire dit en continu ce qui compte. Généraliser telle quelle.
- **« Indisponible »** sur chaque critère : le droit de ne pas savoir, avec conséquence honnête à
  l'écran (« Recommandation rendue sans le critère X »).
- **Le cartouche d'ouverture** (« Position déclarée AU-DESSUS avec intention OPTIMISER : l'outil ne
  propose donc aucune intensification… ») : il explique la *politique* du nœud avant les cartes,
  désamorçant les fausses attentes. Excellent pattern.
- **Cartes de sécurité rendues même en « reco provisoire »** : la sécurité n'attend pas la complétude.
- **Doses proposées en `select` de valeurs réelles** (500…3000) plutôt qu'en champ libre.

## 5. Analyse détaillée du nœud « Insuline » (`insuline`)

### 5.1 Parcours joués (faits observés)

- **Arrivée depuis « Traiter » avec session pleine** : âge, HbA1c, DFG, traitements et glucotoxicité
  repris (« · repris de votre saisie »), garde-fou « Des valeurs de cette consultation pré-remplissent
  cet écran » présent. **Le poids n'est pas repris** (ressaisie exigée) alors qu'il pilote les doses
  calculées — trou dans le vocabulaire `partage`.
- **Naïf d'insuline** (variante N25) : le nœud se rétracte de 8 à 5 sections (C5 confirmé). Réponse :
  2 cartes (« Envisager un GLP-1 avant ou avec l'insuline » ; « Initier une insuline basale », doses
  0,1/0,2 U/kg calculées sur le poids saisi : 9/18 U). Conforme à l'audit.
- **Basale seule sans MCG** (N10) : la bascule Naïf → Basale est **additive et non destructrice** (tout
  persiste, 3 sections s'ajoutent). MCG répondu « Non » via « Rien à signaler » → TBR, CV et la section
  nocturne disparaissent (C9 confirmé) ; alerte « Sans MCG : titrer sur la glycémie à jeun » ; carte
  « Envisager d'instaurer une MCG » avec l'argument du différé (C10 confirmé).
- **Basale seule avec MCG** (N11 variante) : TBR 9 · CV 41 · nocturne « Baisse continue ». 4 cartes,
  zone « Sécurité — à corriger d'abord » en tête (« Corriger l'hypoglycémie ou la variabilité »,
  Mesure de sécurité, « Basale réduite (−10 %) ≈ 34 U/j » calculé sur la dose 38). **D19 confirmé** :
  motif « …et MCG disponible et TBR > 4 **et MCG disponible et** CV > 36 » — le littéral commun aux deux
  branches n'est pas dédupliqué.
- **Bascule destructrice** (analogue du parcours C de Traiter) : Basale → Naïf → Basale perd MCG, TBR,
  CV, glycémie à jeun **et la dose de basale** — mais « Profil nocturne : Baisse continue » **survit**.
  Persistance incohérente d'une section à l'autre ; et l'état résultant est contradictoire (un profil
  AGP déclaré sans capteur déclaré), toléré sans un mot.

### 5.2 Diagnostic structurel

- **La forme du nœud est la bonne.** L'ouverture sur une seule question (« Situation
  d'insulinothérapie »), la rétraction au format du patient (4-5 sections chez le naïf, 7 en
  basal-bolus), la disparition des champs capteur sans capteur : c'est le meilleur exemple du produit
  d'un formulaire qui épouse la situation au lieu de l'inventorier. **À ériger en pattern** (« le
  premier critère d'un nœud est celui qui dimensionne le formulaire »).
- **Initiation / adaptation / suivi ne sont pas séparés, et c'est un bon choix** : la situation
  (naïf / basale / basal-plus / basal-bolus) est le vrai discriminant ; les trois temps en découlent.
  Découper en trois nœuds aurait recréé le problème du renvoi inter-nœuds (N25).
- **Deux critères pour un même fait, tolérés en contradiction** : `Situation = Basale seule` coexiste
  avec `Traitements en cours` où « Insuline basale » n'est pas cochée. Aucune synchronisation, aucune
  alerte. Même famille que « Antécédent CV » vs « Maladie CV athéromateuse » (audit, N4) — mais ici les
  deux champs sont **sur le même écran**.
- **Le rendu des négations est double sur le même écran** : carte 1 « Pas de MCG en place » (libellé
  négatif déclaré), carte 2 « MCG disponible : non » (D18). La preuve que le correctif C14 est une
  affaire de chemin de rendu, pas de contenu.
- **Les blocs « D'après » sont dupliqués verbatim entre cartes** : Munshi 2011 (≈ 500 caractères) et
  SFD 2025 Avis 18+23 apparaissent intégralement sur deux cartes du même écran (restitution N10 :
  6 593 caractères pour 2 options ; N11 : 10 934 pour 4). Les cartes étant repliées par défaut
  (mesuré : 78 px/carte), le coût est au dépli — mais un praticien qui déplie deux cartes lit deux fois
  le même paragraphe d'essai.
- **Des notes autoréférentielles affleurent dans les références** : « Le nœud n'avait encodé que la
  montée », « porte VERBATIM le “3 matins de suite” de l'algorithme de titration affiché par ce nœud ».
  C'est le registre du changelog, pas celui de l'écran clinique (famille C17 de l'audit, sous une forme
  résiduelle).
- **Ce qui est excellent et à standardiser** : les cibles MCG en cadrage (Battelino, « repères, PAS un
  critère dur ») ; le texte de désambiguïsation entre cartes voisines (« Une baisse continue nocturne
  déclenche “Réduire la basale”, pas cette option ») ; les doses toutes dérivées de la dose actuelle et
  du poids ; « Doses non calculées : … — à renseigner : X » (l'outil nomme le chiffre manquant).

### 5.3 Recommandations

#### I1 — Persistance uniforme : aucune bascule de situation ne doit effacer une saisie

- **Constat** : la bascule de situation efface Surveillance et dose de basale mais conserve le profil
  nocturne ; l'état restauré peut être contradictoire (AGP sans capteur).
- **Source** : parcours « bascule destructrice » ci-dessus. **Impact** : en consultation, la situation
  se corrige souvent (le patient précise son schéma en cours d'entretien) ; chaque correction coûte une
  ressaisie partielle et silencieuse, ou pire, laisse un état mixte.
- **Proposition** : même correctif que T2 (état conservé, visibilité seule pilotée) + un invariant de
  test : *pour tout couple (valeurs saisies, bascule A→B→A), l'état final = l'état initial*.
- **Coût** : faible. **Priorité** : **critique** (même chantier que T2 — à faire ensemble).
  **Portée** : globale. **Validation** : aucune. **Confiance** : forte.

#### I2 — Synchroniser « Situation d'insulinothérapie » et « Traitements en cours »

- **Constat** : deux champs du même écran peuvent se contredire (Basale seule / insuline non cochée) ;
  et le praticien qui arrive de « Traiter » avec « Insuline basale » cochée devrait voir la situation
  pré-suggérée.
- **Proposition** : dérivation bidirectionnelle déclarée dans le contenu : `Situation ∈ {Basale seule,
  Basal-plus, Basal-bolus}` ⇒ suggère « Insuline basale (± rapide) » dans Traitements (« · déduit de la
  situation », modifiable) ; inversement, insuline cochée sur `Traitement` ⇒ pré-suggère la situation.
  À défaut, une simple alerte d'incohérence (le moteur sait déjà évaluer des conditions croisées).
- **Coût** : moyen. **Priorité** : **importante**. **Portée** : mécanisme générique de **critères
  dérivés** (le même que T1 et que l'espérance de vie). **Validation** : clinique légère.
  **Confiance** : forte sur le constat, moyenne sur la forme.

#### I3 — Partager le poids (et la taille) dans la mémoire de session

- **Constat** : poids ressaisi sur `insuline` alors qu'il vient d'être saisi sur `prescription`, et
  qu'il pilote les doses calculées — le calcul qui fait la valeur du nœud.
- **Proposition** : ajouter `poids`, `taille` au vocabulaire `partage` du contenu. (Vérifier au passage
  la liste complète : tout critère objectif et stable en cours de consultation devrait être partagé ;
  les jugements — « par rapport à l'objectif » — non.)
- **Coût** : faible (déclaratif). **Priorité** : **importante**. **Portée** : contenu DT2.
  **Validation** : aucune. **Confiance** : forte.

#### I4 — Dédupliquer les littéraux dans les motifs et mutualiser les références

- **Constat** : D19 (« MCG disponible » deux fois dans un motif) ; blocs « D'après » répétés verbatim
  entre cartes du même écran.
- **Proposition** : (a) au rendu d'une conjonction, dédupliquer les littéraux identiques ; (b) les
  références partagées par plusieurs cartes d'un écran sont rendues une fois (bloc « Sources de cet
  écran » ou référence abrégée « Munshi 2011 — cf. carte précédente »). (b) est plus discutable : à
  prototyper avant de trancher.
- **Coût** : (a) faible, (b) moyen. **Priorité** : (a) souhaitable, (b) secondaire.
  **Portée** : globale. **Validation** : (b) UX. **Confiance** : forte sur (a), faible sur (b).

#### I5 — Purger le registre changelog des textes de référence

- **Constat** : « Le nœud n'avait encodé que la montée », « affiché par ce nœud » — des méta-textes de
  fabrication dans l'écran praticien.
- **Proposition** : règle éditoriale (GRAMMAIRE-NOEUD) : une référence dit ce que dit la source, jamais
  ce que fait ou faisait le nœud ; l'auto-critique de l'outil a sa place en alerte ou en cadrage (où
  elle excelle, cf. N23), pas dans un titre d'essai. + invariant de recette : chercher « ce nœud »,
  « encodé », « verbatim » dans les rendus.
- **Coût** : faible (contenu). **Priorité** : souhaitable. **Portée** : contenu, tous nœuds.
  **Validation** : contenu. **Confiance** : forte.

## 6. Analyse des autres nœuds

*(Section réécrite le 2026-08-04, seconde passe : les cinq nœuds ont maintenant tous été explorés en
direct.)*

### `cible-glycemique` (exploré en direct)

Rejoué en 4 gestes (âge, ancienneté, « Rien à signaler ») → « Cible ≤ 7 % » avec un motif exemplaire
(« ni fragilité, ni comorbidité grave, ni antécédent cardiovasculaire, ni espérance de vie limitée :
situation intermédiaire… »). **Deux enseignements de conception :**

- **Un nœud à 6 champs n'a pas d'accordéon, et c'est le bon choix.** La forme du formulaire doit suivre
  la taille du nœud : plat ≤ ~8 champs, accordéon au-delà. À écrire comme convention, pas à laisser au
  cas par cas.
- C'est le nœud le plus rentable du produit (5 gestes, 35 s dans l'audit) **parce que** son périmètre
  est une vraie unité de raisonnement (une question, une réponse, un motif). Le critère de découpage
  des futurs modules est là : *un nœud = une question que le praticien se pose en une phrase*.

Les défauts qui le touchent (D9 : hypoglycémies sévères absentes du vocabulaire du nœud ; D17)
sont des défauts de session/vocabulaire partagé, traités en P1/P2, pas des défauts de ce nœud.

### `statine` (exploré en direct, scénario N20 : bandes de CK)

- **C2 confirmé** : les bandes s'excluent proprement (2,3 N → carte haute intensité seule ; 6,2 N →
  bascule sur « Interrompre » ; 60 N → l'alerte rénale cède la place à la rhabdomyolyse). Le couple
  « CK mesurées + Borne haute du labo → multiple calculé » reste le meilleur pattern de saisie du
  produit (recopier deux nombres, l'outil calcule).
- **D6 confirmé au verbatim** : à 60 N, le titre dit encore « Interrompre la statine 4 à 6 semaines et
  réévaluer » et l'encart interne doit se démentir lui-même (« *Ce n'est plus la séquence
  d'interruption-réintroduction décrite ci-dessus* »). C'est le cas d'école du principe **P3 (le titre
  porte la conclusion)** : quand une bande de valeur change la conduite, c'est le **titre** qui doit
  changer, pas un encart sous un titre devenu faux. Le contenu doit pouvoir faire varier le titre par
  bande.
- **D4 confirmé** : « D'après : , sous-groupe diabète (18 686 diabétiques)… » — les noms d'essais
  amputés s'affichent bien en l'état. Correctif de données pur (`statine.yaml`), hors séquence.
- L'alerte « intolérance rapportée ≠ avérée » (90 % des symptômes non attribuables, réintroductions en
  aveugle) est un modèle du genre : elle arme le praticien pour la conversation difficile, au moment où
  il la vit.
- Structure : 3 sections/10 champs avec accordéon — à la frontière de la convention « plat ≤ 8 » ;
  acceptable, la section « Tolérance » formant un vrai bloc de raisonnement.

### `rhd-activite-physique` (exploré en direct, scénario N23)

- **D7 confirmé, et la cause est plus profonde que le rendu** : la ligne « écarté : Signe imposant un
  avis avant la pratique structurée (limitation, ischémie d'effort, rétinopathie, pied) » énumère les
  quatre composants possibles d'un **critère dérivé agrégatif** sans dire lesquels sont vrais (ici :
  rétinopathie et pied). Le correctif T3 (rendu = branches vraies) ne suffit donc pas ici : c'est
  l'agrégat lui-même qui efface l'information. **Règle à en tirer : un dérivé agrégatif se rend par ses
  composants vrais, jamais par son libellé générique** — ou bien le contenu décompose l'agrégat en
  drapeaux distincts dans l'expression d'écartement.
- **D11 confirmé** : alerte neuropathie remarquable (elle déclare même que l'outil retire plus que la
  source), **aucun mot pour la rétinopathie proliférante** pourtant déclarée. Asymétrie de contenu :
  deux drapeaux du même groupe de sécurité, un seul a son alerte.
- Le formulaire s'adapte bien (« Durée d'une séance » disparaît après « Jamais » — C20 confirmé).

### `rhd-alimentation` (exploré en direct, scénario N24 partiel)

- **C4 confirmé** : cocher « Signes d'appel d'un TCA » fait apparaître les deux cartes d'orientation,
  **visibles, non repliées**, avec le motif propre (« Proposé parce que : Signes d'appel d'un trouble
  du comportement alimentaire ») et l'honnêteté de périmètre (« Non chiffrable — orientation, pas un
  geste alimentaire en soi »).
- La bascule silencieuse de deux cartes vers « Autres pistes possibles » observée par l'audit **ne se
  reproduit pas sur mon profil** (boissons sucrées « Quotidien » seul renseigné : les 4 cartes restent
  visibles). Le comportement dépend d'autres critères — l'observation de l'audit reste à traiter, mais
  comme cas conditionnel, pas comme constante.

### L'écran de module RHD (primer d'orientation)

Vu en direct, il applique exactement la checklist §2.5 de `CONSTRUIRE-UN-MODULE.md` : question
d'orientation, phrase explicite « *Cette question oriente, elle ne verrouille rien : les deux axes
restent ouverts…* », **zéro saisie**, et — très bonne idée non prescrite par la checklist — trois
**indices situationnels** sous chaque axe (« Le patient décrit spontanément ce qu'il mange… ») qui
permettent la reconnaissance immédiate de la situation. À reprendre comme pattern : un primer
d'orientation propose des *situations reconnaissables*, pas des catégories abstraites.

### Complément sur la mémoire de session (seconde passe)

La circulation de « Fragilité » **fonctionne entre les deux nœuds RHD** (répondue « Non » par RAS sur
`activite-physique`, elle arrive « · repris de votre saisie » sur `alimentation`), alors qu'elle
n'arrivait pas de `cible-glycemique` vers `prescription`. La cause probable n'est donc **pas** que les
réponses RAS échappent à la session, mais que le critère Fragilité du nœud cible est un **encodage
distinct** du critère partagé (famille I4 — un concept, deux encodages). À vérifier dans le contenu au
moment du lot P2 ; le constat D17 (espérance de vie jamais calculée sur valeurs héritées) reste vrai
tel quel.

## 7. Principes transversaux de conception des nœuds

Sept principes, tous tirés d'un constat observé ; chacun est applicable tel quel aux futurs modules.

**P1 — Les conclusions sont des données de session.** Un nœud consomme des critères et **publie** sa
conclusion (`exports: {hba1c_cible: 7}`). Tout critère d'un autre nœud calculable à partir de la session
se pré-remplit « · calculé, à vérifier » (jamais silencieusement — le pattern existe déjà pour
l'espérance de vie). Ferme la racine de D12/D17 et la famille « le fait existe mais pas là où la
décision se prend » (§4bis de l'audit, occurrence 2). *Coût M · validation technique+UX.*

**P2 — Un fait clinique de sécurité a un vocabulaire unique et global.** « Hypoglycémies sévères
récurrentes » (D9), « antécédent d'acidocétose sous iSGLT2 » (D5), « Antécédent CV » vs « Maladie CV
athéromateuse » (N4) : trois cas où le fait est défini par nœud au lieu de l'être par domaine. Le
contenu devrait déclarer les critères de sécurité **au niveau du domaine** (un fichier
`criteres-communs.yaml` que chaque nœud référence au lieu de redéfinir), et un test d'invariant vérifie
qu'un critère de sécurité déclarable quelque part est évalué (ou explicitement déclaré hors périmètre)
par tout nœud qui prescrit une classe concernée. *Coût M-É · validation clinique · c'est le chantier de
fond ; l'audit en a fait sa « famille candidate » n° 1 et `STATUS.md` le connaît (invariant I4).*

**P3 — Le titre d'une carte porte la conclusion, tout le reste est subordonné.** Le test des
20 secondes de l'audit le montre : ce qui n'est pas dans le titre + badge n'est pas retenu (N16, N21,
N25, D6). Conséquences : un état qui change la conduite change le **titre** ; jamais une carte dont
l'encart dément le titre ; jamais deux intitulés identiques sur le même écran avec des verbes
contraires (D20 — la ligne d'écartement doit porter un rendu distinct de la carte, p. ex. « non
proposé : Metformine — dose déjà réduite » plutôt que le nom de classe nu). *Coût F-M, en partie
contenu.*

**P4 — La forme du formulaire suit la taille et la dynamique du nœud.** ≤ ~8 champs : formulaire plat
(cible, statine). Au-delà : accordéon à résumés d'une ligne (Traiter, Insuline). Premier champ : celui
qui **dimensionne** le formulaire (intention, situation) ; auto-avancer après un choix segmenté unique.
Chaque champ porte ses mentions dynamiques (« · détermine la suite », « · sans effet sur la reco
actuelle », « · à confirmer », « · calculé », « · repris de votre saisie », « Indisponible ») — ce
système de six états de champ est **la meilleure invention du produit** ; le standardiser en composant
unique. *Coût F (déjà largement fait — il s'agit de l'ériger en règle).*

**P5 — Tout ce que l'écran réclame doit être atteignable en un clic.** Le cartouche « À renseigner
pour trancher : X » doit lier X à sa section (l'ouvrir, focaliser le champ). Corollaire structurel
(T1/T2) : un critère décisif ne peut pas être dans une section masquée — soit il est dérivable
(Initier ⇒ aucun traitement), soit sa section reste accessible. *Coût F-M.*

**P6 — Les gestes globaux sont durables et exhaustifs.** « Rien à signaler » vaut « Non à tous les
drapeaux de la section, présents et futurs », s'écrit en session, et le résumé replié l'affiche
en entier. Un geste global qui ne couvre qu'un instantané invisible est pire qu'une saisie champ par
champ, parce qu'il fabrique une fausse certitude. *Coût F.*

**P7 — L'état d'une option est toujours l'un de quatre, tous restituables :** proposée / écartée
(motif = branches vraies) / **en attente (critères manquants nommés)** / hors périmètre (déclaré au
cadrage). Le produit rend très bien 1, 2 et 4 ; l'état 3 n'est restitué qu'à l'écran vide — c'est le
trou par lequel N25 est passé. *Coût F (composant existant).*

## 8. Recommandations UX et UI globales

- **L'accordéon est le bon modèle, le garder.** Aucun défilement nécessaire à 1000 px sur aucun des
  parcours joués ; l'effort est prévisible. Ne pas céder à la tentation d'un wizard multi-écrans (la
  correction en place — 2 gestes, recalcul immédiat — est précisément ce qu'un wizard casserait).
- **Auto-avance sélective** : après un choix segmenté unique (intention, situation), ouvrir la section
  suivante automatiquement ; garder le bouton « Suivant » pour les sections à champs multiples
  (il y sert de « j'ai fini », les checkboxes n'ayant pas de signal de complétude).
- **Le compteur « Session : N valeurs » doit devenir un objet de première classe** (l'audit le dit :
  « le seul témoin fiable de l'état de la session ») : cliquable, listant les valeurs portées, avec
  leur origine (saisie / calculée / RAS), et le bouton « Nouveau patient » à côté. C'est aussi la
  réponse UX à T2 : ce que la session porte doit être visible pour être digne de confiance.
- **Restitution : la hiérarchie carte est bonne** (titre + verbe + badge, pastilles Posologie /
  Proposé parce que / Contre-indications, panneaux repliés à 78 px). Deux corrections : les blocs
  « D'après » dupliqués (I4b) et — mesuré par l'audit sur `statine` — la masse bibliographique qui,
  quand elle est dépliée par défaut, écrase l'actionnable (44 % de la carte N14). Règle : **la preuve
  se déplie, l'action se lit** — uniformiser le repli par défaut des « D'après » sur tous les nœuds.
- **Différencier visuellement la ligne d'écartement de la carte homonyme** (D20) : préfixe verbal
  (« Non proposé : ») + motif, jamais le nom de classe seul en tête de ligne.
- **Micro-textes** : coquille « 1 autre restent » ; harmoniser le garde-fou de reprise entre nœuds
  (choix explicite sur `prescription`, application directe sur `insuline`) — le choix explicite est le
  bon (il rend le praticien maître de la reprise), le généraliser.

## 9. Architecture fonctionnelle pour les futurs modules

L'architecture actuelle (moteur générique piloté par contenu YAML, nœud = critères + options +
alertes + cadrage) est **la bonne** ; rien ne plaide pour une refonte. Les évolutions ci-dessous sont
des extensions du schéma de contenu, pas des changements de moteur :

1. **`exports` de nœud** (P1) : `exports: [{critere: hba1c_cible, valeur: <conclusion>}]`. Le moteur
   les verse en session comme des valeurs calculées.
2. **Critères dérivés déclaratifs** (T1, I2, espérance de vie déjà existante) :
   `derive: {si: "intention = initier", alors: "traitements = []", statut: "déduit"}`. Un seul
   mécanisme pour les trois cas connus ; affichage systématique « · déduit de X, à vérifier ».
3. **Critères communs de domaine** (P2) : `content/<domaine>/criteres-communs.yaml`, référencés par
   `$ref` depuis les nœuds. Le schéma JSON interdit de redéfinir localement un critère commun (c'est
   l'invariant I4 de `STATUS.md`, rendu impossible par construction plutôt que vérifié après coup).
4. **Un seul moteur de rendu de conditions** (T3) avec deux modes (motif de carte / ligne
   d'écartement) et les invariants de recette transversaux : pas de « : non », pas de disjonction
   brute, pas de littéral dupliqué, pas de « ce nœud » dans une référence. Ces invariants tournent sur
   **tous les nœuds de tous les domaines** — c'est la réponse mécanique à la famille « correctif non
   propagé au nœud voisin ».
5. **Liens alerte→option** (T6) : `option_liee` optionnel sur une alerte.
6. **Séparation état/visibilité dans le formulaire** (T2/I1) : propriété du composant formulaire
   générique, aucun impact contenu.

**Ce qui doit rester spécifique au DT2** : le vocabulaire clinique des critères, les zones de
regroupement des cartes (« Le choix de l'agent », « À faire d'emblée »), les textes. **Ce qui ne doit
pas être construit** (sur-ingénierie au stade actuel) : un moteur de scoring multicritère, un
comparateur de stratégies côte à côte, un mode « parcours rapide » distinct — l'accordéon +
pré-remplissage de session rendent déjà le cas fréquent rapide (5 gestes sur `cible`) ; la comparaison
est déjà servie par les zones + « Pourquoi pas d'autres options ? ». Réévaluer seulement si un usage
réel en consultation en démontre le besoin.

## 10. Feuille de route priorisée

Pour un développeur solo, dans l'ordre — chaque lot est livrable et testable seul :

1. **Lot sécurité N25** (T1 + T4) : dérivation `Initier ⇒ traitements = ∅` + restitution des options
   en attente. Ferme les deux défauts graves. *~1 session.*
2. **Lot intégrité du formulaire** (T2/I1 + invariant A→B→A) : séparation état/visibilité. *~1 session,
   surtout des tests.*
3. **Lot rendu des conditions** (T3 + I4a + D18) : moteur unique, invariants transversaux en recette.
   *~1-2 sessions.*
4. **Lot session** (P1 `exports` + T5 RAS durable + I3 partage poids/taille) : rétablit le
   pré-remplissage phare de juillet sur une base saine. *~2 sessions.*
5. **Lot vocabulaire de sécurité** (P2 + D5/D9 : critères communs de domaine) : le chantier de fond,
   avec validation clinique du contenu déplacé. *~2-3 sessions + relecture référent.*
6. **Lot finitions** (T6, I2, I5, P4, P5, micro-textes) : au fil de l'eau.

D4 (titres d'essais amputés, `statine.yaml`) est un correctif de données pur, hors séquence : à faire
dès que possible, indépendamment.

## 11. Points non explorés

- Le **mobile** (375 px) et le seuil deux-colonnes (1200 px) — comme l'audit.
- Toute la **dimension visuelle** (saillance, couleurs, poids typographiques) : aucune capture
  possible pendant les deux passes (limite d'outillage, cf. §3).
- Le mode **« 2 positions de lecture »** (bascule reco officielle / position critique) : non actionné ;
  son interaction avec les badges et les zones reste à évaluer.
- Le **basal-plus / basal-bolus** complet (7 sections) et les contraintes violées sur `insuline`
  (TBR incohérents — P0-c) : non fabriqués.
- Sur `rhd-alimentation` : le profil exact qui fait basculer deux cartes vers « Autres pistes
  possibles » au coche du drapeau TCA (observé par l'audit, non reproduit sur mon profil).
- La **charge réelle en consultation** (15 min, patient présent) : rien ici ne remplace un essai en
  conditions réelles ; les comptages de gestes viennent de l'audit et de mes parcours.
- Le comportement de `derive`/`exports` proposés face au **retour arrière** (modifier une valeur
  exportée après coup) : à spécifier au moment de P1 (proposition : l'export suit la conclusion
  recalculée, les valeurs dérivées non confirmées suivent, les confirmées se marquent « obsolète ? »).

## 12. Point de reprise

**Mission menée à terme, seconde passe incluse — le rapport est complet.** État final :

- **Exploré en direct (passe 1)** : `prescription` (4 parcours dont N25 dans les deux sens),
  `insuline` (naïf / basale ± MCG / bascules), `cible-glycemique` + enchaînement cible→Traiter
  (D12/D17). **(passe 2)** : `statine` (bandes de CK — C2, D6, D4 confirmés), `rhd-activite-physique`
  (N23 — D7 requalifié « dérivé agrégatif », D11 confirmé), `rhd-alimentation` (TCA — C4 confirmé,
  bascule silencieuse non reproduite), écran de module RHD, circulation session inter-nœuds RHD.
- **Suites données (passe 2)** : `GRAMMAIRE-NOEUD.md` et `CONSTRUIRE-UN-MODULE.md` amendés avec les
  enseignements généralisables de cette revue (cf. l'en-tête de statut de chaque fichier).
- **Toutes les sections du rapport sont rédigées** (résumé exécutif, recommandations T1-T6 / I1-I5 /
  P1-P7, analyse des deux nœuds majeurs, principes transversaux, architecture, feuille de route en
  6 lots).
- **Constats nouveaux par rapport à l'audit** : perte de données au changement d'intention/situation
  (T2/I1, avec persistance incohérente sur `insuline`) ; « Insuline d'initiation » existe et se rend
  dès que `Traitements en cours` est connu (reformule D1 en conséquence de D2) ; deuxième occurrence
  d'expression brute (« Optimiser l'agent mal toléré écarté ») ; les deux rendus de négation sur le
  même écran (`insuline`) ; blocs « D'après » dupliqués entre cartes ; poids non partagé en session ;
  session aveugle aux conclusions de nœud et aux réponses « Rien à signaler » (racine D12/D13/D17) ;
  notes autoréférentielles dans les références ; coquille « 1 autre restent ».
- **Si un agent reprend** : les points non explorés sont listés en §11 ; le plus rentable ensuite est
  (a) actionner le mode « 2 positions de lecture » sur `prescription` et vérifier son interaction avec
  les zones/badges, (b) une passe visuelle avec captures (panneau affiché) pour valider les jugements
  de saillance que ce rapport n'a pas pu porter, (c) transformer les lots 1-3 de la feuille de route
  en plan P13 (`/nouveau-plan`).
- **Serveur** : `ebm-msp-dev` arrêté en fin de mission.
