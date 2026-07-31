# 2026-07-31 — D41 · Convention de semaine : publication le **lundi**, `date_semaine` = semaine ISO du lundi, fenêtre = 7 jours précédents

### Décision

| | Règle |
|---|---|
| **Jour de publication** | **Lundi** |
| **`date_semaine`** | La **semaine ISO du lundi de publication**, format `AAAA-Www` (ex. `2026-W32`). C'est l'identifiant de l'édition et le nom du dossier d'archive `docs/veille/semaines/AAAA-Www/`. |
| **Fenêtre de collecte** | Les **7 jours précédant** la publication : lundi → dimanche de la semaine ISO précédente. Une édition ne contient jamais un item paru le jour même. |
| **Première édition** | **`2026-W32`** — lundi 03/08/2026, couvrant 27/07 → 02/08. |

Les deux éditions de cadrage `2026-W30` et `2026-W31` sont produites **rétrospectivement**, hors
cycle : même convention de fenêtre, mais collecte sur archives datées et non sur alertes poussées.
Leur journal de semaine le mentionne, et les temps qu'elles mesurent ne valent pas pour un cycle
normal.

### Contexte

La SOP v1.0 disait « cycle hebdomadaire fixe **(jour à définir)** ». Un identifiant de semaine non
défini est un identifiant qui dérive : `2026-W32` peut désigner la semaine de collecte ou la semaine
de publication, et rien n'empêche que le sens change au bout de trois mois — au moment précis où
l'archive commence à avoir de la valeur. Le décalage se découvre alors sur des dizaines d'entrées, et
il n'est plus rattrapable sans re-dater à la main.

Le choix du **lundi** n'a pas de justification forte : c'est celui du référent. Il a en revanche deux
conséquences utiles qui le rendent cohérent avec le reste :

- il place la **relecture différée J+3** (D39) le lundi matin, sur une rédaction close le vendredi ;
- il livre l'édition en début de semaine de travail, quand le temps de lecture d'un praticien est
  plus disponible qu'un vendredi soir.

### Alternatives envisagées

- **`date_semaine` = semaine de collecte** — écartée : l'entrée porterait un numéro de semaine
  antérieur à sa date de publication, ce qui est contre-intuitif dans une liste triée par semaine et
  déroutant pour le lecteur qui reçoit « la semaine 31 » un 3 août.
- **Laisser le jour libre, dater à la publication effective** — écartée : sans jour fixe, il n'y a
  pas de cadence, seulement une intention. Le retard cesse d'être visible, donc mesurable.

### Raison du choix

Le choix est arbitraire ; c'est **le fait de l'écrire** qui a de la valeur, pas son contenu. Une
convention arbitraire et déclarée est stable ; une convention arbitraire et tacite dérive.

### Conséquences

- Les identifiants d'entrée sont préfixés par la semaine : `AAAA-Www-<slug>`. Ils sont **stables une
  fois publiés**.
- La rédaction est close le **vendredi** pour tenir la relecture différée du lundi (D39). Un retard
  ne se rattrape pas en supprimant la relecture : l'item passe à la semaine suivante (règle de file
  d'attente, SOP §6bis).
- L'archive de la veille démarre à `2026-W30` (éditions de cadrage), la première édition en cycle
  normal est `2026-W32`.
- **Réserve à porter au bilan de cadence** : le temps mesuré sur W30 et W31, collectées sur archives,
  sera biaisé. Il devra être re-mesuré sur `2026-W32`, première édition live.
