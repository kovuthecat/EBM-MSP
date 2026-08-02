# 2026-08-01 — D45 · Carte d'option compacte à pastilles, amende D34

### Décision

`OptionCard` passe d'une carte haute (mesurée en recette à 0,71-1,06 écran de large) à une carte tenant
sur une ligne : pastille d'action, intitulé, badge de niveau de preuve, puis trois `PastilleInfo`
(« Proposé parce que », « Posologie » — si contenu, « Contre-indications » — si l'option en porte) qui
ouvrent chacune un panneau au clic, un seul ouvert à la fois. `AlertList` (alertes de l'option) reste hors
de tout panneau, toujours visible (D21, non renégocié). Les panneaux sont toujours rendus dans le DOM et
portent `hidden` quand fermés (pas de montage conditionnel), pour que le garde-fou I12
(`banc/carte-affichage.test.tsx`) continue de vérifier où vit chaque texte.

**Amende D34** (2026-07-28, « Contre-indications : registre de sécurité en tête, puis repli dans le
dépli ») et **révoque l'acquis posé le 2026-08-01 au matin** : « la posologie reste toujours visible,
elle se lit à chaque prescription ». La posologie passe désormais elle aussi derrière une pastille
ouvrable au clic, au même titre que les contre-indications.

**Précision sur le badge de niveau de preuve** : contrairement à ce que la maquette et le lot livré par
P11/S5 (T-109) laissaient présager, le badge **n'est pas passé en points**. Un rendu en trois/quatre
points a été essayé (T-109, 2026-08-01) puis **révoqué par l'arbitrage référent du 2026-08-02** (P11/S10,
T-117) : « je ne veux pas garder les 3 points ». Le badge reste la pastille de texte (« Preuve élevée »,
etc.), les 4 niveaux restant distincts (`tres-faible` a désormais son propre token, ce qui soldait la
seule dette réelle de l'ancien rendu). C'est l'élargissement de la mise en page à 1600 px (D46, T-118),
et non le badge, qui rend la carte en une ligne tenable.

### Contexte

Arbitrage référent du 2026-08-01 sur maquette, question 3 : « carte en une ligne, tout au clic ». Un
premier passage du matin même avait sorti les contre-indications actives du dépli pour les rendre
toujours visibles au même titre que la posologie — corrigeant le défaut mesuré (une dose lue à travers un
avertissement rouge) mais au prix d'un socle de sécurité en permanence affiché, même hors contexte de
prescription. Le référent, en voyant ce premier rendu, a tranché en sens inverse : compacité maximale,
tout derrière un clic, y compris la posologie.

### Raison du choix

Le référent a arbitré en connaissance de cause, sur maquette : la compacité de la colonne l'emporte sur
la visibilité permanente de la posologie. Le ton `attention` (ambre) de la pastille posologie quand des
doses restent à calculer préserve l'esprit de l'ancien défaut « la carte dit ce qu'elle attend » sans
occuper le socle en continu.

### Conséquences

- `OptionCard.tsx`/`.css` refondus (P11/S6, T-111) ; garde-fou `banc/carte-affichage.test.tsx` réécrit
  pour exprimer le nouveau contrat (contre-indications/doses en panneau, alertes hors panneau).
- **La validation d'usage reste ouverte.** La décision a été prise sur maquette, pas en consultation
  réelle : `VALIDATION.md`, item T-111(a)/(b) — la posologie derrière un clic est-elle acceptable à
  l'usage, et la pastille ambre se lit-elle sans ambiguïté comme « une dose manque » ? Non tranché par la
  recette N1 de S8 (constat DOM, pas jugement).
- D34 reste valide pour le reste de son périmètre (les contre-indications restent un registre de
  sécurité distinct de l'argumentaire) : seule la question de leur visibilité permanente est révisée.
