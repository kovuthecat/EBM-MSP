# 2026-07-28 — D35 · Champ optionnel `Option.action` : vocabulaire fixe à 5 verbes, réservé aux nœuds qui le portent déjà

### Décision

Nouveau champ **optionnel** sur `option` (schéma + `content/node.types.ts` `ActionOption`, ajouté par
P6/S0) : `action: ajouter | remplacer | arreter | reduire | maintenir`. Effet **strictement de
présentation** : `evaluateNode` l'ignore ; côté écran (P6/SB3), il pilote uniquement une bordure gauche
colorée sur `OptionCard` (`--c-action-ajouter`/`--c-action-remplacer`/`--c-action-arreter`/
`--c-action-reduire` dans `tokens.css` ; `maintenir` réutilise `--c-accent-decision`, aucun token dédié).

**Réservé aux nœuds dont le contenu emploie déjà ce vocabulaire dans l'intitulé de ses options** —
aujourd'hui `prescription` et `insuline` seulement. Ce n'est **jamais** un champ à remplir par défaut sur
tout nœud futur, et il n'est **jamais** posé de force sur une option dont le geste ne se résume pas sans
reste à un seul des 5 verbes : dans ce cas, l'option reste sans `action` (bordure inchangée), plutôt que de
recevoir une classification approximative.

### Contexte

Vérification faite avant le plan P6 (cf. `plans/P6/index.md`, « Ce que ce plan a vérifié ») : sur les 6
nœuds DT2, seuls `prescription` (27 options) et `insuline` (12 options) ont un vocabulaire d'intitulés
dominé par ces 5 verbes. `statine` (7 options) est un mélange (Interrompre/Débuter collent, « Discuter la
statine » et « Statine (prévention primaire…) » non) ; `cible-glycemique` (4 options, des valeurs cibles)
et `rhd-alimentation`/`rhd-activite-physique` (29 pistes comportementales à elles deux) n'ont pas ce
vocabulaire du tout. **4 des 6 nœuds ne s'y prêtent pas** — le badge verbe n'est donc câblé que sur
`prescription`/`insuline` ; les 4 autres gardent leurs badges existants (Recommandée / niveau de preuve /
`role`, D25), sans verbe forcé.

Même à l'intérieur des deux nœuds retenus, la qualification s'est faite **option par option**, jamais par
déduction automatique du premier mot de l'intitulé (P6/SA1, T-038 ; P6/SA2, T-039) : 22 des 27 options de
`prescription` et 6 des 12 options d'`insuline` ont reçu un verbe ; les autres (5 sur `prescription`, 6 sur
`insuline`) sont restées volontairement sans `action`, faute d'un verbe unique fidèle au geste décrit
(intitulé mêlant deux mécanismes, socle couvrant à la fois « instaurer » et « poursuivre », repli sans
aucun geste médicamenteux, etc.).

**Trou de vocabulaire constaté, non comblé par ce lot.** SA2 (T-039) signale qu'aucun des 5 verbes ne
couvre une **augmentation** de dose d'un traitement déjà en place — l'option `insuline` « Titrer la basale
(augmenter la dose) » en est restée sans `action` : `reduire` en est l'antonyme, pas un synonyme, et aucun
des 4 autres verbes ne convient davantage. Limite connue et assumée pour ce lot, pas un blocage : à
trancher par le référent si un 6ᵉ verbe (« augmenter ») doit être ajouté au vocabulaire fixe ci-dessus — ce
qui impliquerait de rouvrir le schéma (l'`enum` est fermée) et de reparcourir `prescription`/`insuline`
pour les options concernées.

### Raison du choix

`action` décrit ce qu'une option **fait déjà** (son intitulé, son effet clinique réel tel que lu par
SA1/SA2) — ce n'est pas une nouvelle règle de décision : aucune `conditions`/`exclusions`/`prerequis`/
`priorite`/valeur clinique n'est touchée par sa présence ou son absence (changelogs `prescription.yaml`/
`insuline.yaml`, 2026-07-28). Le rendre optionnel et le réserver aux nœuds qui portent déjà ce vocabulaire,
plutôt que de l'imposer partout, évite de fabriquer une classification qui n'existerait que pour peupler un
badge — le même principe que R5 (`docs/decision/GRAMMAIRE-NOEUD.md`) appliqué à un champ de présentation
plutôt qu'à un critère de saisie : un champ qu'on ne peut pas remplir fidèlement ne doit pas être rempli.

### Conséquences

- Champ optionnel, contrairement à `role` (D25, requis) : n'a pas exigé de qualifier les options des 6
  nœuds, seulement `prescription`/`insuline`, option par option.
- `OptionCard.tsx` : absence d'`action` → aucune classe de bordure ajoutée, comportement visuel inchangé
  (pas de régression sur les 4 autres nœuds ni sur les options non qualifiées de `prescription`/`insuline`).
- L'`enum` du schéma est fermée à 5 valeurs : ajouter un 6ᵉ verbe (« augmenter », cf. trou signalé
  ci-dessus) est un changement de schéma à part entière, pas une extension de contenu seule.
