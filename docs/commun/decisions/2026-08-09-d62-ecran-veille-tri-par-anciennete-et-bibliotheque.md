# 2026-08-09 — D62 · Écran Veille : tri par ancienneté remplace le filtre par semaine, flux/bibliothèque remplace les cases gardé/masqué

### Décision

Dans `VeilleListScreen.tsx` :

1. **Filtre « Semaine » supprimé.** Il forçait un affichage silo (une seule semaine visible par
   défaut, `semaines[0]`) qui masquait l'historique par défaut.
2. **Nouveau tri « Date »**, devenu le tri par défaut (avant : « Impact d'abord ») : trie sur
   `meta.date_publication`, sens réglable via un bouton dédié, défaut **plus récent d'abord**.
3. **Le flux général exclut désormais toujours les entrées `garde` et `masque`** — plus de cases à
   cocher (« Mes entrées gardées », « Afficher les masquées ») pour les faire réapparaître dans le
   flux : une gardée quitte définitivement le flux général au profit de la bibliothèque, une masquée
   quitte le flux tout court.
4. **Nouvel onglet « Ma bibliothèque »** (visible seulement connecté, comme les boutons garder/masquer
   déjà réservés aux comptes — D51) : liste les entrées gardées ; un repli « Masquées » permet de les
   reprendre (seul point d'accès restant à une entrée masquée, sinon elle serait perdue sans retour).
5. Chaque carte affiche désormais sa date de publication (`JJ/MM/AAAA`), repère devenu nécessaire une
   fois le regroupement par semaine retiré de l'interface.

### Contexte

Demande directe du référent : le filtre par semaine imposait un parcours semaine-par-semaine artificiel
pour une liste qui n'a, à ce stade (une seule semaine produite, W33), aucune raison d'être compartimentée
ainsi ; et le modèle gardé/masqué par case à cocher mélangeait, dans un même flux, des articles à statut
personnel différent (à lire, mis de côté, écarté).

### Alternatives envisagées

- **Garder le filtre Semaine en option, à côté du tri par date** — écartée : le référent a demandé la
  **suppression**, pas l'ajout d'un choix supplémentaire ; le tri par date couvre le même besoin
  (retrouver une entrée par récence) sans imposer un silo.
- **Section « Ma bibliothèque » regroupant gardées ET masquées au même niveau** — écartée : une
  masquée n'est pas une entrée qu'on veut retrouver facilement (c'est l'inverse), d'où le repli
  `<details>` séparé plutôt qu'une liste au même rang que les gardées.
- **Toucher `loadEntrees.ts` (retirer l'export `semaines`)** — écartée : encore utilisé ailleurs dans
  le projet à un autre usage (aucune dépendance directe côté Veille après ce changement, mais retirer
  un export public sans nécessité n'est pas dans le périmètre de cette demande).

### Conséquences

- Vérifié : `npm run typecheck` et `npm run build` passent sans erreur ; comportement du flux (filtres,
  tri par date actif par défaut, bouton d'inversion de sens, dates affichées) confirmé au navigateur —
  14 entrées de W33 toutes visibles sans sélection de semaine. Les onglets « Flux »/« Ma bibliothèque »
  et le comportement garder/masquer n'ont **pas** pu être vérifiés au navigateur (nécessite un compte
  connecté, hors de portée de cette vérification) ; à confirmer par le référent à la prochaine
  connexion.
- Avec une seule semaine de contenu publié à ce jour, `meta.date_publication` est identique sur les 14
  entrées : le tri par date ne les différencie pas encore visiblement (repli sur le titre). L'effet
  du tri deviendra visible dès la deuxième semaine de production.
