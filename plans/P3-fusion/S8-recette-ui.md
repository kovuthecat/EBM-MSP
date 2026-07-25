# S8‑ui · Reprise de la recette référent sur le nœud « Traiter » (prescription)

**Écrit le 2026‑07‑25** pour une session suivante (la précédente a atteint son quota). Document
**autoportant** : il ne suppose rien d'autre que la lecture de `CLAUDE.md`.

**Modèle/effort** : arbitrages = Opus ; exécution du code = déléguer à un agent Sonnet (le référent a
explicitement demandé de limiter le coût — regrouper les tâches en **une seule passe d'agent** plutôt
que plusieurs lancements).

---

## 0. État du dépôt — À LIRE EN PREMIER

**RIEN N'EST COMMITÉ.** Le working tree contient un lot important et cohérent, tout vert :
`npx tsc --noEmit`, `npm test -- --run` (**231 tests**), `npm run build`.

Le référent n'a pas encore décidé du découpage en commits — lui proposer un découpage thématique
avant de committer (voir §5).

Fichiers non suivis à ne pas perdre : `src/features/decision/lib/formLayout.ts` (+ `.test.ts`),
`src/features/decision/engine/groupesExAequo.test.ts`.

---

## 1. Ce qui a été livré (contexte, ne pas refaire)

Tout ce qui suit est **fait, testé, vérifié à l'écran par la session précédente**.

### 1.1 Écran de liste des nœuds
- 5 nœuds renommés (titres courts) ; ordre d'affichage explicite via `NODE_ORDER`
  (`src/features/decision/lib/labels.ts`) — l'ordre était auparavant l'ordre alphabétique des fichiers.
- Suppression du sur‑titre dupliqué et du sous‑texte illisible (`DecisionDomainsScreen.tsx`).

### 1.2 Formulaire de critères — ordre du raisonnement clinique
- Deux champs **optionnels** ajoutés au schéma sur `criteres_entree` : `groupe` (section d'affichage,
  ordre = 1re apparition) et `visible_si` (condition DSL de visibilité).
- `prescription.yaml` : 5 sections — Intention thérapeutique → Traitement actuel et contrôle → Ce qui
  oriente le choix → Signaux d'alerte et tolérance → Terrain et préférences.
- `visible_si` : `traitements_en_cours`, `intolerance_traitement` et `hypoglycemie_recente` masqués
  quand `intention == initier` (patient naïf) ; `nature_intolerance` masqué sans intolérance.
- **Sûreté** : un champ qui devient masqué est remis à sa valeur par défaut et redevient « non
  renseigné » (`reinitialiserChampsMasques`, `lib/formLayout.ts`) — sinon une valeur invisible
  continuerait de piloter la reco.
- Les 4 autres nœuds n'ont pas de `groupe`/`visible_si` → **repli sur le rendu à plat**, inchangé.

### 1.3 Correctif du gate bloquant
L'écran exigeait auparavant que TOUS les nombres référencés soient saisis avant d'afficher quoi que ce
soit, alors que le moteur de pertinence estompait ces mêmes champs comme « sans effet ». Un champ
pouvait donc être **à la fois estompé et bloquant** (`age`, via le dérivé `terrain_fragile`), sans issue.
Le gate dur est supprimé : la reco est calculée en permanence et badgée « provisoire ». Réclamé et
estompé dérivent désormais de la **même** source (`criteresPertinents`) → contradiction impossible par
construction. Voir `decisifsAConfirmer` (`lib/formLayout.ts`).

### 1.4 Ergonomie de saisie
- Marqueur « à confirmer » réservé aux critères de type `nombre` (pour un `bool`, `false` = « non » est
  une réponse valide ; pour un `nombre`, `0` n'est jamais une mesure).
- Bouton **« Rien à signaler »** par section (confirme d'un clic les drapeaux décisifs non renseignés).
- Rappel en pied de section listant ce qui reste à renseigner.
- Estompage sans saut d'opacité, jamais sur un champ déjà renseigné, recalcul différé
  (`useDeferredValue`).

### 1.5 Panneau de résultats — familles et égalités
- `Noeud.familles: [{libelle, exclusive}]` (optionnel) : **l'ordre du tableau est l'ordre des sections**,
  `exclusive` distingue « on en choisit un » de « gestes cumulables ». `Option.famille` y fait référence.
- Ordre validé par le référent (« urgence d'abord ») : `À faire d'emblée — sécurité` → `Socle du
  traitement` → `Agent à ajouter` (seule **exclusive**) → `Traitement à corriger ou remplacer` →
  `Traitement à alléger` → `Aucun geste — surveiller`.
- Options de même rang **dans une même famille** rendues **côte à côte** sous « À égalité — même niveau
  de priorité ». Deux familles différentes ne sont jamais groupées.
- La mention « en choisir un » / « gestes cumulables » est **dérivée de `exclusive`**, plus recopiée
  dans le libellé (source unique).
- Badge : décision référent = **« Recommandée » désigne LE PLAN**, pas un vainqueur unique. Famille
  cumulable → toutes les options affichées sont badgées ; famille exclusive → seulement le groupe de
  tête. Le socle garde « Recommandation officielle (France) ».

---

## 2. LE PIÈGE RÉCURRENT — à garder en tête à chaque modification

**Quatre bugs successifs ont eu la même cause** : *deux sous‑systèmes en désaccord sur « ce qui est
affiché »*.

1. gate dur des nombres ↔ estompage par pertinence ;
2. signature de pertinence ordonnée ↔ égalités réellement affichées ;
3. signature globale ↔ regroupement par famille à l'écran ;
4. badge calculé sur les égalités globales ↔ sections par famille.

**Règle à appliquer** : `engine/relevance.ts`, `DecisionNodeScreen.tsx` et `lib/optionBadges.ts`
doivent consommer **les mêmes fonctions pures** (`groupesParFamille`, `computeBadges`). Dès qu'on
change ce qui est rendu, il faut se demander si la **signature de pertinence** doit changer aussi —
sinon un critère décisif sera estompé à tort (ou l'inverse).

Autre variante du même piège, déjà rencontrée deux fois : **une donnée calculée par le moteur mais
jamais rendue**. C'était le cas des `alertes` (corrigé, composant `AlertList`) ; c'est **encore le cas
de `excluded`** → voir tâche A ci‑dessous.

---

## 3. Travail à faire — UNE SEULE PASSE D'AGENT

Contexte déclencheur : recette du référent sur ce profil réel —
*intention **optimiser**, metformine + **gliptine**, HbA1c 8, **ASCVD établie**, DFG 70, albuminurie
normale, **IMC 20**, 70 ans, **fragile**, espérance de vie **limitée***.

Sortie produite : metformine (socle) + **« Introduire un iSGLT2 » badgé Recommandée**, et rien d'autre.
Le référent n'est pas d'accord. Diagnostic posé et **validé avec lui** :

### Tâche A — Afficher les options écartées *(VALIDÉ par le référent)*

`EvaluateNodeResult.excluded` est calculé par le moteur (`engine/evaluateNode.ts`) et documenté D13
comme « jamais en silence »… mais **aucun composant ne l'affiche** (vérifié : `excluded` n'apparaît
nulle part dans `src/features/decision/screens/` ni `components/`).

Conséquence sur le profil ci‑dessus : le garde‑fou `IMC < 22` a écarté **l'AR GLP‑1** *et*
**« Remplacer la gliptine par un AR GLP‑1 »** (qui remplissait pourtant toutes ses autres conditions),
sans un mot à l'écran.

→ Rendre les options écartées avec leur motif (ex. « *AR GLP‑1 et switch de la gliptine écartés :
IMC < 22* »), de façon **générique** (bénéficie à tous les nœuds), dans l'esprit d'`AlertList`.
Discret mais présent : c'est une garantie de transparence du moteur, pas un détail cosmétique.

### Tâche B — Alertes rattachées à une option *(mécanisme proposé, à confirmer)*

Règle posée par le référent : **« l'alerte n'a pas d'intérêt en l'absence de traitement existant ou de
recommandation de ce traitement. »**

Cas observé : l'alerte « *Sujet fragile chez qui un incrétine (AR GLP‑1 / tirzépatide) est en cours ou
envisagé…* » s'affiche alors que l'AR GLP‑1 est justement **exclu** pour ce patient. Son `quand`
(`fragilite == true AND ASCVD_etablie == true OR …`) ne peut pas savoir ce que le moteur a retenu, car
les alertes sont évaluées sur les seuls critères.

→ Proposition (à faire valider) : permettre à une **option de porter ses propres alertes**, affichées
uniquement quand cette option est applicable. Générique, et évite de recopier les exclusions dans le
`quand` (recopie qui dériverait au premier changement d'exclusion). L'alerte fragilité se scinde alors :
- branche « **déjà sous incrétine** » → reste une alerte de nœud, exprimable en DSL aujourd'hui
  (`traitements_en_cours contient aGLP1 OR traitements_en_cours contient tirzepatide`) ;
- branche « **on va en introduire un** » → rattachée aux options AR GLP‑1 / tirzépatide.

⚠ Si cette tâche est faite : la **signature de pertinence** doit refléter les alertes d'option (cf. §2).

### Tâche C — Généraliser le switch de la gliptine *(CONTENU CLINIQUE — NE PAS RÉDIGER SANS LE RÉFÉRENT)*

**Le défaut de fond.** Comparer les deux options de switch de `prescription.yaml` :

| | remplaçant | exclusions portées |
|---|---|---|
| `Remplacer le sulfamide (…)` (~l.430) | **générique** — le texte dit « choisir le remplaçant selon la comorbidité (iSGLT2 si IC/rein ; AR GLP‑1 si athérome/obésité) », avec une clause de repli | `DFG < 30` seulement |
| `Remplacer la gliptine par un AR GLP‑1 (…)` (~l.393) | **une seule classe** | `IMC < 22`, `denutrition`, `symptomes_glucotoxicite`, `cetonemie` (celles du GLP‑1) |

Donc dès que l'AR GLP‑1 est inutilisable (maigreur, dénutrition, refus d'injection), **tout le switch
de la gliptine disparaît** — aucun repli vers l'iSGLT2. L'outil retombe alors sur « **ajouter** un
iSGLT2 » en **conservant** la gliptine → metformine + gliptine + iSGLT2, alors que la conduite attendue
est metformine + iSGLT2, gliptine arrêtée.

Formulation du référent : *« mon intention est l'optimisation avec une HbA1c à la cible. La bonne
conduite serait donc le switch de la gliptine (qui ne présente pas de bénéfice sur critère dur) par un
traitement qui en présente (même si pas de maladie avérée, ça reste protecteur). Ici l'iSGLT2 est le
seul accessible au vu des autres critères. »*

→ Généraliser l'option sur le **modèle de l'option sulfamide** (elle est déjà écrite comme il faut) :
un switch vers « un agent à bénéfice d'organe », le choix du remplaçant expliqué dans le texte, et des
exclusions **structurelles** seulement (pas celles d'une classe particulière).

**Deux points que le référent doit trancher AVANT encodage :**
1. **L'intitulé exact** de l'option généralisée.
2. **L'élargissement de la condition de déclenchement.** Elle exige aujourd'hui
   `ASCVD_etablie == true OR IMC >= 30 OR cible_atteinte == false` : chez un patient à l'objectif, sans
   athérome ni obésité, le switch ne se déclenche donc **pas du tout**. Or le référent a dit « même si
   pas de maladie avérée, ça reste protecteur ». **La même remarque vaut pour l'option sulfamide**, qui
   porte la même liste.

Le reste du texte (avantages / inconvénients / effet attendu / niveau de preuve) peut être **dérivé de
l'option sulfamide existante et soumis au référent**, mais **aucune formulation clinique ne doit être
inventée sans sa relecture** (CLAUDE.md invariant 6).

---

## 4. Règles de travail (rappels durs)

- **Invariant 5** : aucun nœud, critère, option ou famille connu **par son nom** dans le code. Tout est
  piloté par le contenu ou par le **type** du critère.
- **Ne jamais modifier une règle de décision** (`conditions`, `exclusions`, `priorite`, `rang`) ni un
  texte clinique sans validation explicite du référent.
- **Validation visuelle = humaine** : l'agent ne pilote pas de navigateur ; il valide par
  `npx tsc --noEmit`, `npm test -- --run`, `npm run build`, et consigne la recette dans `VALIDATION.md`
  sous forme de cases `- [ ]`. (La session Opus, elle, peut vérifier dans le navigateur intégré.)
- `tsc -b` (dans `npm run build`) **refuse les imports inutilisés** — passe toujours le build, pas
  seulement `--noEmit`.
- Commentaires et libellés **en français**, style dense et explicatif des fichiers existants : expliquer
  le **pourquoi**, pas le quoi.
- Serveur de dev : configuration `ebm-msp-dev` dans `.claude/launch.json` (port 5174).

---

## 5. Après‑coup : le commit

Le lot en working tree est volumineux. Découpage thématique proposé au référent (non validé) :
1. liste des nœuds (titres + ordre + nettoyage des cartes) ;
2. formulaire (`groupe`/`visible_si`, sections, ergonomie de saisie, correctif du gate) ;
3. panneau de résultats (familles, égalités, badge « plan ») ;
4. les tâches A/B/C de ce document.

---

## 6. Questions ouvertes (aucune n'est bloquante pour A)

- **Rangs de priorité** : l'échelle 0‑7 de `prescription.yaml` est saturée et mélangeait des natures
  d'actes. Le découpage en familles a résolu le symptôme d'affichage, mais **les rangs n'ont pas été
  réexaminés à l'intérieur de chaque famille** — ils avaient été calibrés dans un espace partagé. Une
  relecture clinique à froid est souhaitable (le référent en est informé). Ré‑espacer l'échelle (×10)
  avait été évoqué puis écarté comme inutile en l'état.
- **Badge** : la politique « le plan complet » signifie que dans une famille cumulable **toutes** les
  options affichées sont badgées. Assumé par le référent ; à revoir si l'écran paraît saturé.
- **Les 4 autres nœuds** (`cible-glycemique`, `insuline`, `rhd`, `statine`) n'ont ni `groupe`,
  ni `visible_si`, ni `familles` → rendu à plat historique. Les migrer est un arbitrage de contenu, à
  faire nœud par nœud avec le référent.
- `prescrire 12.pdf` (P12) toujours vide, à re‑fournir (dette héritée, sans rapport avec l'UI).
