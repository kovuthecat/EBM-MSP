# 2026-07-26 — D24 · Une position de lecture n'est pas une alerte : le champ `cadrage`

**Décision.** Un nœud peut déclarer `cadrage: string[]` — des **positions de lecture** vraies pour *tous*
ses patients, qui disent comment lire l'ensemble de ses options. Rendues en tête du nœud, **avant le
formulaire**, sans condition et dans un style délibérément neutre (`components/CadrageList.tsx`). Aucun
effet moteur : `evaluateNode` ignore le champ.

**Critère opposable pour choisir le champ** — la distinction n'est pas stylistique, elle décide du canal :

| Champ | Porte sur | A un `quand` | Peut être faux pour un patient |
| --- | --- | --- | --- |
| `alertes` (D15) | la **situation** d'un patient | oui | oui |
| `cadrage` (D24) | l'**état des preuves** du nœud | non | non |

Un énoncé vrai pour *certains* patients seulement est une alerte, jamais un cadrage. La réciproque est le
piège à surveiller : une alerte qu'on n'arrive pas à conditionner est presque toujours un cadrage qui
s'ignore.

**Pourquoi.** Deux nœuds portaient une position de nœud écrite en `alertes[].quand: "default"` —
`insuline` (« l'insuline n'a pas de bénéfice cardiovasculaire démontré, ORIGIN neutre ») et `statine`
(« la décision se grade sur le risque absolu, pas sur une cible LDL chiffrée »). D21 (interdit n°2) le
proscrit à raison : une alerte affichée pour tout le monde ne signale plus rien, se confond avec le décor,
et **dévalue par contagion les alertes réellement conditionnelles rendues juste à côté**. Mais la dette
était **insoluble tant que `alertes` restait le seul canal** : ces énoncés ne peuvent pas être rendus
conditionnels, puisqu'ils ne dépendent d'aucun critère. Le défaut n'était pas le texte, c'était le canal —
les deux textes ont été déplacés **inchangés**.

**Conséquences.** L'invariant I6 du banc (`engine/banc/invariants-contenu.test.ts`) s'applique désormais
**sans aucune exception** : tout `quand: "default"` sur une alerte de nœud fait échouer les tests. Le canal
de D21 compte donc quatre entrées, pas trois : `exclusions` (retirer), alerte d'option (le geste est sur la
table), alerte de nœud (la situation du patient), `cadrage` (l'état des preuves). Un écran de module (D22)
reste à faire : quand il existera, un cadrage partagé par les nœuds d'un module aura vocation à y monter
plutôt qu'à être répété nœud par nœud.
