# 2026-07-31 — D42 · Plans du module Veille préfixés `PV<n>` ; séquence `T-0xx` des tâches inchangée

### Décision

Les **plans** du module Veille portent le préfixe **`PV`** (`plans/PV1/`, `PV2/`…) ; ceux du module
Décision gardent `P` (`plans/P1/` → `plans/P10/`).

Les **identifiants de tâches** restent dans la **séquence globale unique** `T-0xx` de `TASKS.md`,
quel que soit le module. PV1 ouvre donc sur `T-089`, à la suite du dernier `T-0xx` du module
Décision — il n'y a pas de `T-V001`.

Le dossier `plans/` **n'est pas réorganisé** : les plans `P<n>` ne sont pas déplacés dans un
sous-dossier `decision/`.

### Contexte

Le dépôt porte deux modules (D2) et ouvre son premier plan côté Veille alors que dix plans existent
côté Décision. Deux questions de nommage se posaient d'un coup : celle des plans, et celle des
tâches. Elles se ressemblent, et elles n'appellent pas la même réponse.

### Alternatives envisagées

- **Forker la numérotation des tâches par module** (`T-V001`, `T-D090`) — écartée. `TASKS.md` est un
  fichier unique, relu à chaque cadrage, et les tâches y sont référencées depuis les plans, les
  messages de commit et les fichiers de décision. Deux séquences dans un espace de noms unique
  créeraient des **collisions de lecture** : « T-089 » ne désignerait plus une tâche mais deux, et
  aucun outil ne le signalerait. Le préfixe de plan suffit à savoir de quel module vient une tâche.
- **Déplacer les plans existants dans `plans/decision/`** — écartée : dix dossiers de plan à déplacer,
  dont les liens internes relatifs (`../../docs/…`, `[S3](S3.md)`) casseraient, pour un gain de
  lisibilité nul par rapport au préfixe.
- **Ne rien préfixer et continuer en `P11`** — écartée : les deux modules avancent en parallèle et
  n'ont ni la même cadence ni le même état d'avancement. Un numéro de plan continu laisserait croire
  à une progression unique du projet.

### Raison du choix

Le préfixe de plan sépare les deux modules **là où la séparation a un sens** (une session de travail
appartient à un module, et un plan a un ordonnancement propre) ; la séquence de tâches reste globale
**là où l'unicité a un sens** (un identifiant cité de partout doit désigner une seule chose).

### Conséquences

- Un plan de veille se crée sous `plans/PV<n>/` ; le prochain `T-0xx` se lit dans `TASKS.md`, jamais
  dans le plan précédent du même module.
- Les messages de commit continuent de citer `T-0xx` sans préfixe de module, avec le plan entre
  parenthèses quand c'est utile (`(PV1)`).
- Convention à appliquer telle quelle si un troisième module apparaît : nouveau préfixe de plan,
  **même** séquence de tâches.
