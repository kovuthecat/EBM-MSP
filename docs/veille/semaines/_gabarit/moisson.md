# Moisson — `AAAA-Www`

> **Gabarit.** Copier dans `docs/veille/semaines/AAAA-Www/moisson.md` et remplir à l'étape 1
> (SOP §5). La moisson ne contient que des **candidats bruts normalisés** : rien n'y est jugé,
> rien n'y est retenu. Le tri se fait dans `screening.md`, et chaque ligne d'ici doit y avoir sa
> ligne là-bas.
>
> **Toute source ici est un repérage, jamais une source d'analyse** (SOP §9) — y compris les
> sources Tier 1 « déjà appréciées ». La grille se remplira toujours depuis la publication
> scientifique originale, jamais depuis le résumé qu'en fait la source qui l'a fait remonter.

- **Semaine :** `AAAA-Www` · **publication :** lundi JJ/MM/AAAA
- **Fenêtre de collecte :** JJ/MM → JJ/MM (7 jours précédant la publication, cf. SOP §3)
- **Collecté par :** <référent> · **date de la moisson :** JJ/MM/AAAA
- **Durée de la collecte :** ___ min *(à mesurer — chiffre du bilan de cadence)*

---

## 1. Sources balayées

**Règle de balayage (SOP §4)** : **Tier 1-2 en routine**, intégralement, chaque semaine. **Tier 3-4
seulement pour vérifier ou approfondir un signal déjà repéré** en Tier 1-2 — jamais en balayage
systématique. Liste de référence : `docs/veille/SOURCES.md`.

| Source | Tier | Accès | Balayée | Nouveautés | Note |
|---|---|---|---|---|---|
| | 1 / 2 | libre / abstract / paywall | oui / non | n | |

- **Consigner les sources balayées sans nouveauté** (`Nouveautés = 0`) : sans cette trace, on ne peut
  pas distinguer une source vide d'une source oubliée, et le balayage cesse d'être auditable.
- **Vérifier aussi les onglets Spam et Promotions de la boîte mail dédiée**, pas seulement la boîte de
  réception : Gmail classe agressivement les mails automatisés (Blogtrottr, newsletters) comme
  promotionnels. La boîte étant dédiée exclusivement à cette collecte, tout ce qui s'y trouve est
  presque certainement une source légitime mal classée, pas du vrai spam — à récupérer, pas à ignorer.
- **Sources Tier 3-4 ouvertes cette semaine** — les lister ici avec le signal Tier 1-2 qui a motivé
  l'ouverture. Une source Tier 3-4 ouverte sans motif écrit est un dérapage de périmètre.

---

## 2. Candidats

Un identifiant `Cnn` par candidat, **attribué ici et jamais réattribué** : c'est la clé qui relie
moisson, screening et entrée publiée.

| # | Titre | Source | Tier | Date de parution | Lien / DOI / PMID | Thème présumé | Accès | Déjà vu |
|---|---|---|---|---|---|---|---|---|
| C01 | | | | JJ/MM/AAAA | | | libre / abstract / paywall | non |
| C02 | | | | | | | | |
| C03 | | | | | | | | |

- **Titre** : celui de la publication, **sans reformulation** — la reformulation est déjà un jugement.
- **Thème présumé** : un thème de la taxonomie (`BRIEF_VEILLE.md` §4), au singulier à ce stade ; il
  sera confirmé ou corrigé au classement. Hors des **9 thèmes de production** (SOP §3bis) → la ligne
  existe quand même, et sera exclue au screening avec le motif « hors périmètre de production ».
- **Accès** : ce qui est réellement accessible (`libre` / `abstract` / `paywall`). Pas de
  contournement de paywall (SOP §8) : un candidat `paywall` se screene sur son abstract, et si
  l'abstract ne suffit pas à trancher le seuil, il est `exclu` avec ce motif — pas deviné.
- **Déjà vu** : `non`, ou l'identifiant d'origine (`AAAA-Www / Cnn`) si l'item a déjà été moissonné.
  Un item déjà vu n'est pas re-screené, sauf s'il revient sous une forme nouvelle (publication
  complète d'un preprint, reco qui s'en saisit, rétractation).

### Doublons retirés

| # retiré | Doublon de | Motif |
|---|---|---|
| | C0x — ou `AAAA-Www / C0x` | même DOI / même étude, deux sources |

---

## 3. Compte

| | n |
|---|---|
| Candidats repérés (avant déduplication) | |
| Doublons / déjà vus retirés | |
| **Candidats transmis au screening** | |

> Ce dernier nombre doit être **exactement** le nombre de lignes du §1 de `screening.md`.
