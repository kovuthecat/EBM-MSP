# STATUS.md — ebm-msp

Photo à l'instant T. Mis à jour en fin de session. L'historique (comment on est arrivé ici) vit dans
`git log`, `DECISIONS.md` et les changelogs de contenu — pas ici.

> **Dernière mise à jour :** 2026-07-28

## Ce qui existe

**Module Décision, domaine DT2 — déployé et utilisé en consultation** (ebm-msp.vercel.app). Module
Veille : **non commencé** (aucun code, `ARCHITECTURE.md`/`DECISIONS.md` D8 en gardent la place — le
moteur ne connaît toujours aucun domaine ni module par son nom).

**6 nœuds de contenu**, tous `content/noeuds/diabete-type-2/*.yaml` :

| nœud | statut | dernière version |
| --- | --- | --- |
| `cible-glycemique` | `valide` | v2.5 |
| `statine` | `brouillon` | v1.13 |
| `prescription` | `brouillon` | v0.33 |
| `insuline` | `brouillon` | v0.22 |
| `rhd-alimentation` | `brouillon` | v0.7 |
| `rhd-activite-physique` | `brouillon` | v0.6 |

Les deux nœuds RHD sont groupés sous un **module** (`content/modules/diabete-type-2/rhd.yaml`, D22) :
une seule entrée dans la liste du domaine, cadrage partagé + primer d'orientation.

**Le banc de tests** (`src/features/decision/engine/banc/`) est la garantie de non-régression du
contenu : trois couches (vignettes cliniques, couverture mécanique, invariants génériques sur profils
synthétiques) + I20 (libellés rédigés) + I16-I19 (rôle d'option/repli) + S8 (tout nœud publié porte des
vignettes exécutables — désormais vrai pour les 6). **769 tests, typecheck et build verts.**

## Chantier actif

**Aucun en cours.** Le bloc de dette ouvert le 2026-07-27 (nuit) est **soldé** : les 9 items exécutables
de `ARBITRAGES-2026-07-27-nuit.md` §1-5 sont livrés (rôle d'option D25, `visible_si` sur liste D26,
contraintes de saisie D27, mémoire de session D28, pollution du « pourquoi pas d'autres options »,
relecture rédactionnelle + I20 D29, dette S8 des vignettes RHD).

**Reste explicitement ouvert**, tel que consigné par `ARBITRAGES-2026-07-27-nuit.md` §6 :

- **Passe de recherche A — glycémie capillaire pour l'ajustement de l'insuline** (sans MCG) : seuils de
  titration/plafonnement de la basale sur glycémie à jeun, seuils post-prandiaux pour le bolus (champ
  encore absent du nœud), sort des garde-fous `TBR`/`TBR_severe`/`CV_glycemique` sans capteur. Contenu
  clinique — je ne le rédige pas seul. Diagnostic détaillé : `chantier-2026-07-27/diagnostic-K2-mesures-mcg.md`.
- **Passe de recherche B — sécurité à l'effort** (nœud `rhd-activite-physique`), même statut.
- `docs/decision/sources/prescrire 12.pdf` toujours **vide** — à re-fournir par le référent.
- La **frontière `a_l_objectif` / `sous_objectif`** (nœud `prescription`) reste volontairement non
  pré-remplie par K6 (D28) : elle déclenche la déprescription, un seuil erroné serait dangereux dans les
  deux sens. Le référent n'a donné que le seuil du « nettement au-dessus ».
- Le **seuil rénal de l'AR GLP-1** (30 ou 20 mL/min) — question posée, pas tranchée.
- **Validation clinique référent finale** sur le déployé pour `prescription`, `insuline`,
  `rhd-alimentation`, `rhd-activite-physique` → passage à `statut: valide` (D5). Les 12 vignettes RHD
  écrites le 2026-07-27 verrouillent des arbitrages déjà rendus, elles ne remplacent pas cette relecture
  patient par patient (même statut que F-01…F-09 sur `statine`, en mieux).

## Dette technique connue

- `VALIDATION.md` a cessé de fonctionner comme checklist active (697 lignes, aucun bloc coché en 6
  jours d'itération quotidienne) — le référent valide en direct dans le navigateur et rapporte les
  défauts au fil de l'eau, plutôt que de cocher ce fichier. Sa règle de purge (« supprimer les blocs
  entièrement `[x]` ») ne s'est donc jamais déclenchée. Non retouché lors du nettoyage du 2026-07-28,
  faute de pouvoir distinguer « superflu » de « pas encore vérifié à l'œil » sans le référent.
- `TASKS.md` — plusieurs tâches P2 (T-013 à T-017, red-team/vignettes/rapport de validation systémique)
  restent `[ ]` alors que leur objet a été couvert, dans les faits, par les chantiers du 2026-07-26/27
  (red-team clinique par nœud, bancs de vignettes, rapports `verif-finale-*`). À réconcilier : soit
  cocher rétroactivement avec un renvoi, soit les retirer comme absorbées par un chemin différent de
  celui prévu au cadrage P2.
- Module Veille : zéro code. Reste une ligne de roadmap (D8), pas un chantier entamé.

## Comment vérifier l'état réel

```bash
npm test          # 769 tests attendus, 6 skip
npx tsc --noEmit
npm run build
```

`git log --oneline -20` et `DECISIONS.md` (D1→D29) sont la source de vérité sur *comment* on est
arrivé à cet état ; ce fichier ne dit que *où on en est*.
