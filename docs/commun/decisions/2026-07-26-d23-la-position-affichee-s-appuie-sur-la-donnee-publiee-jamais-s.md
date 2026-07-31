# 2026-07-26 — D23 · La position affichée s'appuie sur la donnée publiée, jamais sur la publication

### Décision

Un argument rendu au praticien s'appuie **exclusivement sur les données publiées** (essais,
méta-analyses) et leurs résultats. Le nom d'une revue secondaire — Prescrire, Médicalement Geek,
Minerva, ebmfrance — ne constitue **jamais** l'argument. Ces publications restent citables en
**référence bibliographique**, à côté de la donnée qui, elle, porte l'argument.

### Contexte

Relevé par le référent (2026-07-25) : « Prescrire et Médicalement Geek n'ont aucune valeur probante
par eux-mêmes — ce sont des publications qui interprètent des données ». Inventaire :
**56 occurrences** dans les 5 nœuds, dont **30 arguments d'autorité, 28 affichés au praticien**
(ex. `prescription.yaml:674` « Prescrire l'écarte. » dans les inconvénients d'une option).

### Raison du choix

Un outil d'aide à la décision fondé sur l'EBM ne peut pas substituer une autorité éditoriale à une
donnée. La distinction est déjà celle que le projet applique partout ailleurs (niveau de preuve,
critère dur vs substitution).

### Conséquences

Le correctif **ne peut pas être seulement rédactionnel**. `schema/noeud.schema.json` rend
obligatoires deux blocs nommés d'après des publications (`sources.prescrire`,
`sources.medicalement_geek`), et `components/ArgumentPanel.tsx` estampille « Prescrire — » /
« Médicalement Geek — » en préfixe visible quel que soit le texte : reformuler la prose laisserait
l'attribution à l'écran. Le modèle de données doit donc être réorganisé **par nature de source**, pas
par titre de publication. Inventaire et reformulations proposées :
`docs/decision/validation/chantier-2026-07-26/sourcage-position-critique.md`. Cinq occurrences sont
marquées « DONNÉE À FOURNIR » — l'argument n'y reposait que sur l'autorité de la revue.
