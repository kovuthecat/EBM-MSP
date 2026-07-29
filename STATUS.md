# STATUS.md — ebm-msp

Photo à l'instant T. Mis à jour en fin de session. L'historique (comment on est arrivé ici) vit dans
`git log`, `DECISIONS.md` et les changelogs de contenu — pas ici.

> **Dernière mise à jour :** 2026-07-29 (clôture P6)

## Ce qui existe

**Module Décision, domaine DT2 — déployé et utilisé en consultation** (ebm-msp.vercel.app). Module
Veille : **non commencé** (aucun code, `ARCHITECTURE.md`/`DECISIONS.md` D8 en gardent la place — le
moteur ne connaît toujours aucun domaine ni module par son nom).

**6 nœuds de contenu**, tous `content/noeuds/diabete-type-2/*.yaml` :

| nœud | statut | dernière version |
| --- | --- | --- |
| `cible-glycemique` | `valide` | v2.6 |
| `statine` | `brouillon` | v1.15 |
| `prescription` | `brouillon` | v0.35 |
| `insuline` | `brouillon` | v0.26 |
| `rhd-alimentation` | `brouillon` | v0.8 |
| `rhd-activite-physique` | `brouillon` | v0.7 |

Bumps du 2026-07-28 (plan P4, D5) : mécanisme moteur/écran corrigé sur les six nœuds (D30 — présomption
inversée), plus des correctifs propres à `statine` (D32, libellés) et `prescription` (garde R8, T-031).
Aucun changement de **statut** `valide`/`brouillon` par P4 lui-même — P4 corrige des défauts de moteur et
d'écran, pas le contenu clinique ; le passage à `valide` reste conditionné à la relecture référent de
`STATUS.md` §Reste explicitement ouvert.

Les deux nœuds RHD sont groupés sous un **module** (`content/modules/diabete-type-2/rhd.yaml`, D22) :
une seule entrée dans la liste du domaine, cadrage partagé + primer d'orientation.

**Le banc de tests** (`src/features/decision/engine/banc/`) est la garantie de non-régression du
contenu : trois couches (vignettes cliniques, couverture mécanique, invariants génériques sur profils
synthétiques) + I20 (libellés rédigés) + I16-I19 (rôle d'option/repli) + I21 (formulaire vierge → zéro
carte, D30) + I22/I23 (sécurité toujours atteignable, jamais d'écran muet, D32) + I12 (contre-indications
toujours présentes et en tête du dépli, amendé P6/SB3/SB6). **826 tests, 11 skip, typecheck et build
verts.**

## Chantier actif

**Aucun en cours.** Plan **P6** soldé le 2026-07-29 (`plans/P6/`, commits `90e2849`…`7f6ff12`) :
généralisation du shell « accordéon + colonne de résultats sticky » (maquette Claude Design, dessinée à
l'origine pour le seul nœud `prescription`) aux 6 nœuds du domaine, + badge couleur par verbe d'action
(`Option.action`, D35) sur `prescription`/`insuline` uniquement (les 4 autres nœuds n'ont pas ce
vocabulaire dans leur contenu). `insuline` a aussi reçu son premier découpage en `groupe` (6 sections,
trouvé manquant par la vérification inter-nœuds — c'était le seul nœud sans aucun gain de l'accordéon).

La recette navigateur locale (`docs/decision/validation/recette-navigateur-2026-07-29-P6.md`) a trouvé un
défaut grave en cours de plan : compacter les contre-indications dans le `<details>` existant (résolution
initiale de la tension avec T-025) faisait perdre exactement ce que T-025 avait gagné — le test des 20
secondes ne retenait plus rien sur « ce que je ne dois pas faire ». Corrigé (D34, amendement) : icône ⚠,
couleur d'alerte dédiée (`--c-ci-warning`) et décompte sur le résumé fermé — revérifié CONFORME. Un défaut
mineur (CTA flottant mobile recouvrant le bouton « Suivant ») est CONFORME en usage normal, avec une
réserve résiduelle documentée dans `TASKS.md`. **Recette faite en LOCAL, pas encore sur le déployé** — à
la différence de P4, dont le contrôle avait porté sur `ebm-msp.vercel.app`.

Plan **P4** soldé le 2026-07-28 (`plans/P4/`, commits `6ddf97b`…`036f4aa`) : les
trois mécanismes où l'écran affirmait ce que le moteur n'avait pas conclu sont corrigés (D30, D31, D32)
+ D33 (geste de fin de consultation) + remontée des contre-indications (T-025) + doctrine R7/R10. **Les
six correctifs sont vérifiés CONFORME à l'écran sur le déployé**, pas seulement dans le code — cf.
`docs/decision/validation/recette-navigateur-2026-07-28-controle-P4.md`. Une passe complémentaire
« praticien naïf » (hors périmètre P4) a suivi dans la foulée et reclassé les priorités — synthèse dans
`docs/decision/validation/BILAN-P4-2026-07-28.md`.

Plan **P5** soldé le même jour (`plans/P5/`, commits `bc59e2a`, `7657f4a`, `806fdb9`) : les trois défauts
« exécutables sans arbitrage clinique » trouvés par la clôture de P4 sont corrigés — un champ segmenté
peut revenir à « non répondu » (réutilise `onEffacer`, déjà générique), `insuline` masque ses 4 champs de
capteur sans `mcg_disponible` (S2 a aussi corrigé une régression de second ordre non anticipée par le
cadrage, motif R8 sur trois options), et « Nouveau patient » donne un retour visuel après purge. **Poussé
sans passe de contrôle navigateur** (décision Thibault, chantier plus contenu que P4) — à vérifier sur le
déployé si besoin, cf. `VALIDATION.md`.

Le bloc de dette ouvert le 2026-07-27 (nuit) reste **soldé** : les 9 items exécutables de
`ARBITRAGES-2026-07-27-nuit.md` §1-5 sont livrés (rôle d'option D25, `visible_si` sur liste D26,
contraintes de saisie D27, mémoire de session D28, pollution du « pourquoi pas d'autres options »,
relecture rédactionnelle + I20 D29, dette S8 des vignettes RHD).

**Trouvé par la clôture de P4/P5, pas encore cadré** :

- Onglet **« Veille » rend une page blanche** (texte `top: 0`, caché sous la barre de nav fixe) — défaut
  d'affichage isolé, trouvé par la recette praticien naïf. Pas repris dans P5 (hors des trois items
  approuvés), petit, candidat pour un prochain lot mécanique.

**Reclassé bloquant** (était « recherche, non bloquant ») :

- **Passe de recherche A — nœud `insuline` sans capteur** : la recette praticien naïf montre qu'un
  patient non naïf mais sans capteur est aujourd'hui une impasse (le praticien invente des chiffres, le
  moteur les traite comme des mesures). Le référent a donné le 2026-07-28 une voie concrète : `TBR`
  existe sans capteur (lecteur capillaire), `TBR_severe` n'existe **pas** (un lecteur ne distingue pas les
  deux seuils) — et une piste de répartition horaire des hypoglycémies en 4 créneaux (nuit/matinée/
  après-midi/soir), analogue capillaire de ce que `profil_glycemique` lit déjà par AGP. **Les deux volets
  mécaniques sont livrés par P5/S2** (masquer les 4 champs sans capteur, `TBR_severe` en découle) ; trois
  volets cliniques encore à trancher (pivot de décision sans capteur, seuils des 4 créneaux, correspondance
  avec `profil_glycemique`). Diagnostic : `chantier-2026-07-27/diagnostic-K2-mesures-mcg.md` +
  `BILAN-P4-2026-07-28.md` §3bis.

**Reste explicitement ouvert**, tel que consigné par `ARBITRAGES-2026-07-27-nuit.md` §6 :

- **Passe de recherche B — sécurité à l'effort** (nœud `rhd-activite-physique`), inchangée.
- `docs/decision/sources/prescrire 12.pdf` toujours **vide** — à re-fournir par le référent.
- La **frontière `a_l_objectif` / `sous_objectif`** (nœud `prescription`) reste volontairement non
  pré-remplie par K6 (D28) : elle déclenche la déprescription, un seuil erroné serait dangereux dans les
  deux sens. Le référent n'a donné que le seuil du « nettement au-dessus ».
- Le **seuil rénal de l'AR GLP-1** (30 ou 20 mL/min) — question posée, pas tranchée.
- **Dette `prescription`/patient naïf** (P4/S9, T-031) : les citations négatives de `traitements_en_cours`
  (garde-fous de non-duplication sur 8 options d'ajout — insuline d'initiation, iSGLT2, AR GLP-1…) restent
  bloquées, confirmé à l'écran y compris sur un profil catabolique qui justifierait cliniquement une
  insuline d'initiation. Portée clinique à trancher avec le référent — cf. `BILAN-P4-2026-07-28.md` §3.
- **Asymétrie iSGLT2 / AR GLP-1 chez le sujet dénutri** (`prescription`, intention Déprescrire) — même
  terrain (IMC<22 et dénutrition) exclut l'AR GLP-1 mais pas l'iSGLT2. Trouvé par la recette praticien
  naïf, à trancher référent.
- **Validité de l'HbA1c non questionnée** (anémie, cirrhose, hémoglobinopathie) — l'outil raisonne sur une
  HbA1c sans jamais signaler qu'elle peut ne pas être interprétable. À trancher référent : périmètre assumé
  ou signalement à ajouter ?
- Carte **« Optimiser l'agent mal toléré »** affichée sans aucun traitement en cours coché — doute sur si
  `intolerance_traitement` doit être conditionné à `traitements_en_cours` non vide. À trancher référent.
- **Validation clinique référent finale** sur le déployé pour `prescription`, `insuline`,
  `rhd-alimentation`, `rhd-activite-physique` → passage à `statut: valide` (D5). Les 12 vignettes RHD
  écrites le 2026-07-27 verrouillent des arbitrages déjà rendus, elles ne remplacent pas cette relecture
  patient par patient (même statut que F-01…F-09 sur `statine`, en mieux).

## Dette technique connue

- `TASKS.md` — plusieurs tâches P2 (T-013 à T-017, red-team/vignettes/rapport de validation systémique)
  restent `[ ]` alors que leur objet a été couvert, dans les faits, par les chantiers du 2026-07-26/27
  (red-team clinique par nœud, bancs de vignettes, rapports `verif-finale-*`). À réconcilier : soit
  cocher rétroactivement avec un renvoi, soit les retirer comme absorbées par un chemin différent de
  celui prévu au cadrage P2.
- Module Veille : zéro code. Reste une ligne de roadmap (D8), pas un chantier entamé.

## Comment vérifier l'état réel

```bash
npm test          # 826 tests attendus, 11 skip
npx tsc --noEmit
npm run build
```

`git log --oneline -20` et `DECISIONS.md` (D1→D35) sont la source de vérité sur *comment* on est
arrivé à cet état ; ce fichier ne dit que *où on en est*.
