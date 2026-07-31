# Journal de screening — `AAAA-Www`

> **Gabarit.** Copier dans `docs/veille/semaines/AAAA-Www/screening.md` et remplir **pendant** le tri
> (SOP §5, étape 2). Reconstitué après coup, ce journal ne prouve plus rien — il ne fait que
> justifier des choix déjà pris. C'est un **livrable publié**, au même titre que les entrées
> (SOP §10) : c'est lui qui distingue cette veille d'un fil de liens.

- **Semaine :** `AAAA-Www` · **publication :** lundi JJ/MM/AAAA
- **Fenêtre de collecte :** JJ/MM → JJ/MM (7 jours, cf. SOP §3)
- **Screené par :** <référent> · **date du tri :** JJ/MM/AAAA
- **Durée du tri :** ___ min *(à mesurer : c'est un des chiffres du bilan de cadence)*

---

## 1. Candidats screenés

Une ligne par candidat de `moisson.md`, dans l'ordre des identifiants — **aucun candidat de la
moisson ne peut manquer ici**, c'est la propriété qui rend le flux auditable.

**Légende des colonnes de seuil** (SOP §6bis, les trois conditions sont **cumulatives**) :

- **C1** — l'item déplace-t-il une décision fréquente en soins premiers ? *(sinon : sujet important ≠ item important ; une confirmation d'un corpus déjà appliqué = `n`)*
- **C2** — critère important pour le patient **et** ampleur absolue non triviale ? *(substitution seule = `n`)*
- **C3** — population et comparateur transposables à la patientèle MSP ?
- Valeurs : `o` / `n` / `?`. Un seul `n` ⟹ seuil non franchi. Un `?` se tranche par une lecture de
  l'abstract complet, **jamais** par un franchissement par défaut.

**Décision** : `retenu` · `exclu` · `reporte` — **Route** : `breve` · `analyse` · `—` (si non retenu).

| # | titre (court) | source · tier | thème présumé | C1 | C2 | C3 | seuil | décision | route | cd | motif / date de report |
|---|---|---|---|---|---|---|---|---|---|---|---|
| C01 | | · T | | | | | franchi / non | | | o/n/? | |
| C02 | | · T | | | | | | | | | |
| C03 | | · T | | | | | | | | | |

- **`cd`** = `concerne_decision` : l'item touche-t-il un nœud d'aide à la décision ? Si `o`, nommer
  le(s) nœud(s) en note sous le tableau — cette colonne **commande la priorité de la file d'attente**
  (SOP §6bis) et ouvrira une tâche dans `TASKS.md`.
- **Motif obligatoire** pour tout `exclu` (reprendre un motif du §6 : hors périmètre, design exclu,
  effectif, critère intermédiaire, doublon, déjà couvert…) et pour tout `reporte` (+ **la date**).
- Un item `retenu` **sans route** est une ligne incomplète : la route se décide ici, pas plus tard.

### Notes de tri

> Ce qui ne tient pas dans une cellule : hésitation sur un `?`, nœud impacté, raison d'un
> reclassement, source douteuse. Deux lignes maximum par candidat.

- **C0x** — …

---

## 2. File d'attente (reports)

### 2.1 Reports entrants — décidés les semaines précédentes

Ces items **repassent au screening cette semaine**, avec les nouveaux candidats. Sans cette section,
un report devient une exclusion silencieuse.

| # d'origine | semaine d'origine | titre (court) | nb de reports | décision cette semaine |
|---|---|---|---|---|
| | `AAAA-Www` | | 1 / 2 | retenu (route …) / reporte / breve |

> **Deux reports maximum** (SOP §6bis). Au 3ᵉ passage : analysé, ou reclassé en brève avec le motif
> écrit ci-dessus.

### 2.2 Reports sortants — décidés cette semaine

| # | titre (court) | motif du report | date | nb de reports |
|---|---|---|---|---|
| | | capacité de la semaine / accès à la source / désaccord bi-agents non résolu | JJ/MM | 1 / 2 |

---

## 3. Flux de la semaine (PRISMA allégé)

| Étape | n |
|---|---|
| Candidats repérés (moisson) | |
| — dont doublons / déjà vus, retirés | |
| Candidats screenés | |
| Exclus (critères §6) | |
| Seuil §6bis franchi | |
| **Retenus** | |
| — route `analyse` | |
| — route `breve` | |
| Reportés | |
| Publiés cette semaine | |
| — dont `niveau_impact: pratique` | |

> **Contrôle de cohérence** : `screenés = exclus + retenus + reportés`, et
> `retenus = analyses + breves`. Si l'égalité ne tombe pas, une ligne manque.

---

## 4. Lecture du tri (3 lignes maximum)

> À écrire **après** le tri, pas avant. Sert au bilan de cadence, pas au lecteur de l'édition.

- **Le seuil a-t-il rejeté ?** Part des screenés qui l'ont franchi : ___ %. *Si une large part
  franchit le seuil semaine après semaine, c'est le seuil qui est mal réglé, pas la semaine qui est
  exceptionnelle (SOP §6bis, calibration).*
- **Rendement des sources** : celle(s) qui a/ont fourni les retenus ; celle(s) balayée(s) pour rien.
- **Ce qui a coincé** : accès, temps, doute non tranché.

---

## 5. Déclaration de la semaine

- [ ] Toutes les sources Tier 1-2 de `SOURCES.md` ont été balayées (les sources sans nouveauté sont
      listées dans `moisson.md`).
- [ ] Chaque candidat de la moisson a une ligne ici.
- [ ] Chaque `exclu` a un motif, chaque `reporte` a une date.
- [ ] Chaque `retenu` a une route.
- [ ] Aucun item en route `analyse` n'a été publié sans grille complète **ni** vérification bi-agents
      (SOP §5, étape 5) — à défaut, il est reporté, pas publié à moitié.

> **Rien de pratique cette semaine ?** C'est une **publication valide** (SOP §5bis). Le nombre
> d'entrées `pratique` peut être `0` sans que la semaine soit ratée.
