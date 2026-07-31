# <Titre de l'entrée — en clair, pas le titre de l'article s'il est illisible>

> **Gabarit d'entrée de veille.** Copier dans `docs/veille/semaines/AAAA-Www/entrees/<slug>.md`.
> Structure reprise **champ par champ** de `BRIEF_VEILLE.md` §5, en **markdown et pas en YAML** : le
> schéma n'est pas gelé, et c'est précisément ce que les deux premières éditions doivent révéler.
> Écrire en YAML maintenant reviendrait à figer le modèle avant le contact du réel. La conversion en
> YAML + JSON Schema est le travail de S5, et elle **est** le test du schéma.
>
> **Champs marqués `?`** : champs dont on doute qu'ils survivent à deux éditions réelles. Ne pas les
> supprimer — les remplir, et noter en §6 ce qu'ils ont coûté ou apporté. Ces `?` sont la matière
> première du bilan.
>
> **Droit d'auteur (SOP §8)** : résumé + lien, **jamais** de reproduction du texte intégral. Une
> citation courte entre guillemets avec sa référence est permise ; un abstract recopié ne l'est pas.

---

## 1. Identification — toujours remplie (brève **et** analyse)

| Champ | Valeur | Note |
|---|---|---|
| `id` | `AAAA-Www-<slug>` | ex. `2026-W30-metformine-dfg` — stable, ne change plus une fois publié |
| `date_semaine` | `AAAA-Www` | semaine ISO du lundi de publication (SOP §3) |
| `titre` | | en clair, compréhensible sans avoir lu l'article |
| `source.nom` | | revue / site / agence |
| `source.lien` | | URL |
| `source.doi` | | DOI ou PMID — vide si l'item n'en a pas (reco, communiqué d'agence) |
| `type_publication` | `ECR` \| `méta-analyse` \| `revue systématique` \| `cohorte` \| `reco` \| `éditorial` \| `autre` | |
| `themes[]` | | taxonomie `BRIEF_VEILLE.md` §4 |
| `professions_concernees[]` `?` | `MG` \| `IPA` \| `sage-femme` \| `orthophoniste` \| `IDEL` | **`?`** — production limitée à 9 thèmes MG (SOP §3bis) : ce champ risque de valoir toujours `MG` (+ `IPA`). À vérifier sur deux éditions avant d'en faire un filtre. |
| `temps_lecture_min` `?` | | **`?`** — estimation invérifiable, et ~1 min pour toute brève. Utile au lecteur, ou champ décoratif ? |

## 2. Route et niveau d'impact — **deux champs distincts**

| Champ | Valeur | Quand est-il arrêté ? |
|---|---|---|
| `route` | `breve` \| `analyse` | **au screening** (SOP §5, étape 2), sur le *potentiel* de l'item, avant de savoir |
| `niveau_impact` | `pratique` \| `informatif` | **après l'analyse** (SOP §5, étape 4) — c'est un **verdict**, pas une prévision |

> **Ils ne coïncident pas, et c'est voulu** (SOP §5bis) :
>
> - une **brève est toujours `informatif`** — sans appréciation critique propre, elle ne peut pas
>   prétendre qu'un item change la pratique ;
> - une **analyse peut conclure `informatif`**, et c'est fréquent : « on a regardé de près, et non,
>   ça ne change rien » est souvent le résultat le plus utile au lecteur. **Ce n'est pas un échec.**
> - donc **`analyse ⊇ pratique`** : tout item `pratique` a suivi la route analyse, l'inverse est faux.

## 3. Contenu — toujours rempli

### `population` `?`

Qui a été étudié : âge, comorbidités, prévention primaire/secondaire, cadre de soins.

> **`?`** — pas toujours applicable (reco, éditorial, décision d'agence) ; écrire alors
> `non applicable`. Recouvre partiellement `resultat_resume`. À trancher en S5 : champ propre, ou
> première phrase du résumé ?

### `resultat_resume`

Ce qu'a trouvé l'item, en clair, **sans copie intégrale**. Pour une **brève** : signale, situe, lie —
ce qui a paru, sur quel sujet, ce que ça complète ou contredit dans le corpus, et le lien. **Aucun
jugement de solidité** n'est porté ici en route brève ; c'est la limite de la route, et le lecteur
doit pouvoir la reconnaître à la lecture.

## 4. Appréciation critique — **route `analyse` uniquement**

> En route `breve`, cette section entière porte la mention **`non apprécié (route brève)`** et rien
> d'autre. Ce n'est pas un trou dans la fiche : c'est le contrat de la brève.

### `appreciation_critique`

Reprendre la grille (`GRILLE_APPRECIATION.md`), rubriques 3 à 7 :

- **Design & risque de biais** — randomisation, aveugle, perdus de vue, ITT, arrêt précoce, critère principal pré-enregistré.
- **Critère de jugement : dur ou substitution ?** — la rubrique la plus discriminante. Si composite : quel composant porte le résultat ?
- **Effet absolu / NNT-NNH** — avec l'horizon temporel. Le risque relatif seul ne suffit jamais.
- **Validité externe** — population et comparateur ≈ patientèle MSP ?
- **Cohérence** avec la totalité des preuves antérieures ; item isolé → prudence.
- **Conflits d'intérêt, financement, *spin*.**

### `niveau_preuve`

`eleve` \| `modere` \| `faible` \| `tres_faible` (GRADE simplifié) — ou **`non_apprecie`** en route brève.

> **`?`** — que vaut « GRADE simplifié » appliqué à une **recommandation** ou à une décision
> d'agence, qui ne sont pas des études ? Deux échelles se cachent peut-être derrière ce champ.

### `pertinence_pratique` `?`

`forte` \| `moderee` \| `faible` — ou **`non_apprecie`** en route brève.

> **`?`** — trois niveaux sans critères écrits, et largement redondants avec
> `niveau_impact` × `niveau_preuve`. **Candidat sérieux à la suppression** au gel du schéma (S5) : à
> confirmer sur deux éditions réelles, pas au jugé.

### Ce que l'entrée **ne** dit **pas**

Incertitudes résiduelles, questions laissées ouvertes, ce qu'il faudrait pour trancher. Une entrée
qui ne nomme aucune incertitude est presque toujours une entrée qui n'a pas cherché.

## 5. Impact sur les algorithmes — toujours rempli

| Champ | Valeur |
|---|---|
| `impact_algorithme.concerne_decision` | `oui` \| `non` |
| `impact_algorithme.noeuds_impactes[]` | ids de nœuds (`prescription`, `statine`, `insuline`…) |
| `impact_algorithme.proposition_maj` | `aucune` \| `candidate` \| `validee` \| `rejetee` |

> **Aucune modification de nœud n'est rédigée depuis une entrée de veille.** Un item
> `concerne_decision` est **enregistré** (`proposition_maj: candidate`) et ouvre une tâche dans
> `TASKS.md` ; le diff et son circuit de validation sont un travail séparé (SOP §5, étape 7 — et
> tant que le comité éditorial n'existe pas, la proposition reste `candidate`). Sans ce garde-fou,
> une seule étude fait exploser une semaine de production.

## 6. Méta — toujours remplie

| Champ | Valeur |
|---|---|
| `meta.date_publication` | JJ/MM/AAAA — date de parution de la **source**, pas de l'entrée |
| `meta.auteur` `?` | **`?`** — un référent unique aujourd'hui (SOP §2) : champ constant tant qu'il n'y en a qu'un |
| `meta.statut` | `brouillon` \| `valide` — `valide` **seulement après** la relecture différée J+3 (SOP §5, étape 5) |
| Vérification bi-agents | `oui (JJ/MM, rapport : <lien>)` \| `sans objet (route brève)` |
| Relecture différée J+3 | `faite le JJ/MM` — corrections apportées : … |

### Notes pour le gel du schéma (S5)

> Une ligne par friction rencontrée en remplissant cette fiche. C'est ce qui rendra le schéma juste
> au lieu de plausible.

- Champ `?` qui a coûté du temps pour rien : …
- Champ manquant qu'il a fallu improviser : …
- Valeur d'énumération qui n'existait pas et qu'il a fallu inventer (ex. `non_apprecie`) : …

---

## Contrôle — une brève se remplit-elle sans trou ?

Une entrée en route `breve` doit pouvoir être publiée **sans qu'aucun champ obligatoire reste vide**,
sinon le gabarit impose à la brève un coût d'analyse — ce que la SOP interdit (§5bis). Vérifier :

- [ ] §1 Identification : renseignable depuis la notice de la source seule. ✔
- [ ] §2 `route: breve` ⟹ `niveau_impact: informatif`, par règle. ✔
- [ ] §3 `population` : `non applicable` accepté ; `resultat_resume` : signale/situe/lie, sans jugement. ✔
- [ ] §4 : **`non apprécié (route brève)`** en bloc ; `niveau_preuve` et `pertinence_pratique` =
      `non_apprecie`. ✔ — **cette valeur sentinelle n'existe pas dans `BRIEF_VEILLE.md` §5 : elle est
      à ajouter au schéma en S5**, sans quoi une brève sera un YAML invalide ou un mensonge.
- [ ] §5 : `concerne_decision: non` + `proposition_maj: aucune` dans le cas courant. ✔
- [ ] §6 : `Vérification bi-agents: sans objet (route brève)`. ✔
