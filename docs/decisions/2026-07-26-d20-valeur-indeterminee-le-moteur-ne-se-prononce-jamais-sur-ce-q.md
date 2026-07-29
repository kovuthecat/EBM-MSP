# 2026-07-26 — D20 · Valeur indéterminée : le moteur ne se prononce jamais sur ce qu'il ignore

### Décision

Un critère non renseigné vaut **`indetermine`** — troisième état, distinct de `0`, de `false` et de la
première valeur d'énumération. Évaluation ternaire (`vrai OR indeterminé` = vrai ; `faux AND
indeterminé` = faux ; sinon indéterminé). Une option dont une `conditions`, `prerequis` ou
`exclusions` est indéterminée passe **en attente** : ni proposée, ni écartée. Une alerte, une dose
calculée ou un critère dérivé indéterminés ne s'affichent pas.

`nombre` et `enum` sont indéterminés tant qu'ils ne sont pas saisis. `bool` et `liste` gardent leur
défaut (« non », « aucun »), qui EST une réponse clinique — sauf déclaration explicite
`confirmation_requise` par le contenu, réservée aux drapeaux dont le « non » ne peut pas être présumé
sans risque.

### Contexte

Recette du 2026-07-25/26. Sur les 5 nœuds, 86 règles mentionnent un critère `nombre`/`enum` ; sur
valeur par défaut, 56 penchent vers le rassurant et 16 vers l'alarmant. Sur formulaire vierge,
`cible-glycemique` recommande la cible la plus stricte, `statine` désigne un tier sur trois champs
vides, et `prescription` **écarte la metformine** — socle du DT2 — sur un `DFG < 30` jamais saisi.
`touched` existait, mais vivait dans l'écran et ne franchissait pas la frontière du moteur.

### Alternatives envisagées

- **Statu quo + bandeau « reco provisoire »** : le palliatif existant, posé côté interface. Il n'a
  empêché aucun des cas constatés, et son compteur diverge de son marquage visuel (bandeau comptant
  tous les types, marqueur ne s'affichant que sur les `nombre`).
- **Afficher la reco en marquant la carte** « fondée sur une donnée non renseignée » : moins de
  travail d'interface, mais une reco fausse reste une reco affichée.
- **Suspendre les garde-fous sur donnée manquante** : écarté explicitement — seul choix du chantier
  pouvant produire pire que l'existant (geste contre-indiqué proposé sans réserve).

### Raison du choix

L'outil doit cesser d'affirmer ce qu'il ne sait pas, **et dans le sens rassurant et dans le sens
alarmant** — l'asymétrie constatée (le même vide lu « objectif atteint » ici et « insuffisance
rénale » là) est le cœur du défaut. Décision référent du 2026-07-26.

### Conséquences

Nouveau registre d'affichage `enAttente`, distinct de `ecartees` (sécurité, R4) et `nonRetenues`
(explication, R4) ; état d'écran « à renseigner » à concevoir. L'invariant de banc n° 2 (« jamais
`applicable` vide ») devient faux tel quel et se reformule : *jamais vide lorsque tous les critères
pertinents sont renseignés*. `touched` remonte de l'écran vers le modèle de critères, avec trois
statuts (`saisi`, `suggere`, `indetermine`) — une valeur `suggere` (heuristique d'interface non
sourcée) ne peut plus être citée comme un fait du patient. Coût de perturbation de `relevance.ts`
accru : R5 à isoler hors suite courante. Spécification complète :
`docs/decision/validation/chantier-2026-07-26/SPEC-valeur-indeterminee.md`.

### Impact IA

Une propriété testable remplace une discipline de relecture : les invariants I3-I7 du banc rendent
cette famille de défauts détectable, alors qu'elle était structurellement hors d'atteinte (le banc
engendre des profils à partir de *valeurs*, « inconnu » n'existait dans aucun espace de test).
