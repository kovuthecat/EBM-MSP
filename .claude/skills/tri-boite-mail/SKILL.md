---
name: tri-boite-mail
description: Lecture, classification et rangement de la boîte `ebmmsp@gmail.com` — labels Gmail au niveau thread, suivi individuel au niveau article. À dérouler en sous-agent pour ne pas exposer le contenu brut des digests à la session principale. Référence `docs/veille/TRI_BOITE_MAIL.md` et `docs/veille/JOURNAL_BOITE_MAIL.md`.
---

# Tri de la boîte mail

**Exécute ce skill via l'outil Agent, en sous-agent** — jamais en lisant les threads directement
dans la session principale. Un digest fait facilement 10-20 articles ; les lire en ligne pollue le
contexte de la conversation qu'on continue ensuite à faire vivre. Le sous-agent ne retourne qu'un
résumé condensé (labels posés, entrées de journal écrites, compte par catégorie).

## Piège de syntaxe Gmail — à ne pas redécouvrir

`search_threads` avec `label:Label_3` (l'ID interne) **échoue silencieusement** et renvoie un
résultat vide. Utiliser le **nom de label lisible** (`label:veille/non-pertinent`,
`label:veille/piste-a-verifier-source-primaire`) et des **termes de sujet sans accents** dans les
filtres `subject:`. Vérifié sur ce projet — la première tentative avec l'ID a coûté un aller-retour
inutile.

## Étape 1 — Repérer les threads à traiter

`search_threads` sans label (nouveaux) ou avec un label à retravailler. Lire chaque thread en
entier (`get_thread`) avant de classer quoi que ce soit — un digest de presse (Tier 3,
« -pratique.com ») contient souvent plusieurs articles de nature très différente sous un même
thread.

## Étape 2 — Classer, article par article dans le thread

Pour chaque article du digest, distinguer :
- une **citation d'étude primaire réelle** (nom d'essai, PMID, chiffre précis attribuable) — signal
  à vérifier ;
- une **narration ou un compte-rendu de congrès** sans étude primaire citable — `non-pertinent`.

Appliquer le seuil C1 (déplace une décision fréquente) + C2 (effet absolu sur un critère patient
important) + C3 (population transposable MSP) — cf. `SOP_veille.md` §6bis — en **plausibilité**
seulement à ce stade, pas en certitude : le criblage repère, il ne tranche pas.

**Garde-fou central, jamais négociable** : la presse ne détermine jamais la route. Un titre
accrocheur avec un chiffre exact peut encore déformer le message (comparateur mal identifié, sens
d'un effet inversé, conclusion d'équivalence présentée comme une supériorité) — vu plusieurs fois
sur ce projet. Le rôle de ce tri est de **repérer**, pas de classer `breve`/`analyse` sur la seule
foi du relais.

## Étape 3 — Poser le label du thread

Un thread entier reçoit un label unique (`veille/breve`, `veille/analyse`,
`veille/non-pertinent`, `veille/piste-a-verifier-source-primaire`, ou le label hors-périmètre du
thème concerné) — cf. l'arbre de décision de `TRI_BOITE_MAIL.md`. Si le thread contient un mélange
(certains articles pertinents, d'autres non), le label reflète le **potentiel le plus élevé** trouvé
dans le thread ; le détail article par article va dans le journal (étape 4), pas dans le label.

## Étape 4 — Suivi individuel dans le journal

Pour tout thread `piste-a-verifier-source-primaire` contenant plusieurs articles à potentiel,
consigner **chaque article individuellement** dans `docs/veille/JOURNAL_BOITE_MAIL.md` — c'est ce
niveau de granularité que les labels Gmail (au niveau thread) ne peuvent pas porter, et sans lequel
rouvrir un digest déjà lu revient à le relire en entier.

- Identifiant `Ann` (jamais réattribué), distinct des `Cnn` de `moisson.md` (cycle de production
  réel) — ce journal couvre le repérage pré-production.
- Renseigner : article, thread Gmail (ID), thème(s), élément d'identification, date d'ajout.
- Un article change de section (à récupérer → brève à rédiger / candidat analyse / écarté) quand
  son statut change réellement — jamais dupliqué entre sections.
- Un thread lu et classé `non-pertinent` de façon définitive va dans la section « Écarté
  définitivement », **par thread**, avec motif et date — pas rouvert sans motif nouveau.

## Étape 5 — Sortie du sous-agent

Retourner à l'orchestrateur, en 15-20 lignes maximum : nombre de threads traités, labels posés
(compte par catégorie), nombre d'articles ajoutés au journal avec leurs identifiants `Ann`, et toute
anomalie (thread mal formé, digest hors périmètre inattendu). Pas le contenu brut des mails.
