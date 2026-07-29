# 2026-07-26 — D22 · Module de nœuds : préambule partagé et primer de levier

### Décision

Un **module** regroupe plusieurs nœuds d'un même domaine et peut porter : un en-tête de cadrage, un
socle de critères de terrain communs, et un **primer** orientant vers le ou les nœuds pertinents.
Champ optionnel, générique, piloté par le contenu — aucun nom de module connu du socle (invariant
CLAUDE.md 5). Premier usage : module **RHD** = nœud *alimentation* + nœud *activité physique*.

### Contexte

La refonte RHD porte le recueil à ~15 items de socle. La charge de saisie est le risque n° 1 déjà
constaté sur le nœud `insuline`. Par ailleurs `fragilite`, `esperance_vie`, `age` et
`traitements_en_cours` seraient redéclarés dans chaque nœud — exactement la duplication que
l'invariant I4 doit interdire.

### Alternatives envisagées

- **Module purement cosmétique** (regroupement dans la liste) : zéro évolution d'architecture, mais
  le praticien répond deux fois aux mêmes questions de terrain et le même concept est encodé deux fois.
- **Un nœud unique à deux volets** : impraticable en consultation (15 items d'un bloc).

### Raison du choix

Le module devient une **portée de partage** plutôt qu'un intitulé : 7-8 items par écran au lieu de
15, terrain posé une fois. Le motif du primer existe déjà dans le projet (`intention` sur
`prescription`). Décision référent du 2026-07-26.

### Conséquences

**Garde-fou R1** : le préambule est un flux d'écran commun, **jamais** un chaînage obligatoire — chaque
nœud doit rester évaluable seul, avec ses critères posés directement. Aucun impact sur `evaluateNode`
ni sur la signature de pertinence. Conception :
`docs/decision/validation/chantier-2026-07-26/CONCEPTION-module-rhd.md`.

### Réalisation (2026-07-27)

L'écran existe : `schema/module.schema.json` + `content/modules/<domaine>/*.yaml` +
`content/loadModules.ts` + `screens/DecisionModuleScreen.tsx`. Un module compte pour **une entrée** dans
la liste d'un domaine et ses nœuds ne s'ouvrent que depuis lui — sinon on entrerait dans un nœud sans
avoir vu le cadrage, et le mécanisme perdrait son objet.

**Livré** : le cadrage partagé (même champ que `Noeud.cadrage`, D24 — c'est le même objet, seule la
portée change) et le primer d'orientation. **Non livré, et c'est une décision** : le *socle de critères
de terrain partagé* qu'évoquait la décision initiale. Il suppose un état de saisie transmis d'un écran à
l'autre, c'est-à-dire exactement le chaînage que le garde-fou R1 interdit. Le tenir demanderait un
arbitrage explicite sur ce garde-fou ; en attendant, `fragilite`/`age` restent déclarés par nœud.

Le garde-fou est tenu **par un test** (« l'écran de module ne contient aucun champ de saisie ») et non
par la seule vigilance : le premier critère « qu'on saisirait bien une fois pour les deux » suffirait à
faire basculer le module en prérequis. Un second test vérifie que **chaque nœud du module est
atteignable depuis le primer** — l'écran les retirant de la liste du domaine, un nœud oublié dans les
orientations deviendrait inaccessible, en silence.

Au passage, ce lot a révélé que `module` était écrit dans le schéma et dans les deux nœuds RHD depuis la
décision, **mais absent du type TS `Noeud` et lu par aucun code** : un champ de contenu orphelin que rien
ne signalait, ni le schéma ni la suite de tests.
