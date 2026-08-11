# Plan P15 — Le panneau posologie : sortir les sources de la ligne de lecture, et adapter la conduite au patient   (rédigé par Opus)

## Objectif d'ensemble

Le panneau POSOLOGIE est le seul bloc de la carte qui **se recopie mot à mot sur une ordonnance**.
Trois défauts s'y cumulaient. Le premier (redondance `apercu` / `posologie_detail`) et l'absence de
hiérarchie visuelle sont **corrigés et livrés** (commit `64d1329`, hors plan). Restent les deux qui
demandent un changement de contrat :

1. **Les sources sont dans la phrase.** 39 citations inlinées sur 4 nœuds — jusqu'à **27 % des
   caractères** de la ligne que le praticien recopie. Le sourçage doit rester traçable élément par
   élément (correctif D3, mésattribution du 2026-07-29) mais sortir du texte de conduite.
2. **La posologie ne s'adapte pas au patient.** Tout est conditionnable sur une option — `conditions`,
   `exclusions`, `priorite`, `action_si`, `contre_indications[].condition`, `alertes[].quand` — **sauf
   la posologie**. Cas réel : le moteur retient « Titrer la basale » **en lisant la courbe nocturne
   MCG**, puis affiche la règle de repli des patients **sans capteur** (« glycémie à jeun 3 matins de
   suite »). Le nœud contredit sa propre doctrine, écrite trois fois dans ses commentaires.

**Principe directeur : la forme du champ ne change qu'une fois.** `posologie_detail` passe de
`string[]` à une liste d'**objets** — forme ouverte qui accepte un champ de plus sans casser une ligne
de YAML, exactement le précédent de `contre_indications[].condition`. Le socle (S1) pose
`{ texte, sources? }` ; le `quand` s'ajoute en S8 comme propriété optionnelle. **Écart assumé au
rapport d'instruction**, qui recommandait de déclarer `quand` dès le socle : le déclarer impose
aussitôt sa classification `decision`, sa récolte par `fragmentsDuNoeud` (G2), son entrée dans
`signatureVue` et l'impact golden master — c'est-à-dire de faire tout R1 dans le lot de forme. Ce que
le rapport veut vraiment prémunir, c'est une forme **fermée** (tuple, convention de chaîne) : un objet
optionnel-extensible l'évite pour quelques lignes.

## Sources du diagnostic

- `docs/decision/validation/posologie-sourcage-2026-08-11.md` — mappage citation par citation,
  volume, contrats traversés, risques de régression (agent d'investigation, 2026-08-11).
- `docs/decision/validation/chantier-2026-08-11/OE-titration-mcg-2026-08-11.md` + son brut — passe
  OpenEvidence : **aucun algorithme de titration piloté par la MCG n'existe**. Le contenu du bras MCG
  est donc de *dire l'absence*, pas d'inventer un protocole (R7).

## Arbitrage de doctrine — pris le 2026-08-11, il conditionne tout le plan

**`sources[]` pointe vers DEUX registres.** `sources.reco_officielle.references[]` reçoit un champ
`id` (elle n'en a pas aujourd'hui), et une note de posologie peut citer indifféremment un essai
(`references_primaires`) ou un texte de recommandation / un RCP. Motif : une posologie vient
légitimement d'un RCP ou d'une table de reco, pas d'un essai ; et la distinction preuve / reco
officielle est **déjà la doctrine du projet** (D16 sépare « Recommandée » de « Recommandation
officielle » pour exactement ce motif). Couverture attendue ~90 % des 39 citations contre 38 % si
`sources[]` ne pointait que vers les essais.

Cet arbitrage règle au passage une **incohérence inter-nœuds qu'aucun invariant ne voit** : `insuline`
a fait entrer quatre textes HAS/SFD dans ses `references_primaires`, `prescription` et `statine` ont
tranché l'inverse. À traiter comme une règle de domaine (S1), pas nœud par nœud.

## Sessions

| Session | Tâches | Titre | Modèle | Effort | Env. | Dépend de | Zone modifiée | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [S1](S1.md) | T-194 | Socle de forme : `itemPosologie`, `id` sur `citationReco`, classification, jargon | Sonnet | high | — | — | `schema/decision/noeud.schema.json`, `content/node.types.ts`, `engine/expressionsNoeud.ts`, `engine/banc/jargon-projet.test.ts` | [ ] |
| [S2](S2.md) | T-195, T-196 | Rendu de la note de source ; nettoyage du code mort d'`apercu` | Sonnet | medium | Desktop | S1 | `components/OptionCard.tsx`, `.css`, `.test.tsx` | [ ] |
| [S3](S3.md) | T-197 | Étendre I8b au canal `sources[]` de posologie | Sonnet | medium | — | S1 | `engine/banc/invariants-contenu.test.ts` | [ ] |
| [S4](S4.md) | T-198 | Citations non vérifiables : instruire les 8 orphelines, les 2 douteuses, le CYP3A4 | Opus | high | — | — | `docs/decision/validation/` | [ ] |
| [S5](S5.md) | T-199 | Migration du sourçage — `insuline` | Sonnet | high | — | S1, S2, S3 | `content/…/insuline.yaml` | [ ] |
| [S6](S6.md) | T-200 | Migration du sourçage — `prescription` | Sonnet | high | — | S1, S2, S3, S4 | `content/…/prescription.yaml` | [ ] |
| [S7](S7.md) | T-201 | Migration du sourçage — `statine` | Sonnet | high | — | S1, S2, S3, S4 | `content/…/statine.yaml` | [ ] |
| [S8](S8.md) | T-202 | Câblage moteur du `quand` : classification, G2, `signatureVue`, golden master | Sonnet | xhigh | Desktop | S1, S2 | `schema/`, `engine/expressionsNoeud.ts`, `lib/vueDecision.ts`, `components/OptionCard.tsx`, `screens/DecisionNodeScreen.tsx`, `engine/banc/__snapshots__/` | [ ] |
| [S9](S9.md) | T-203 | Bras MCG d'`insuline` : red-team des sources OE, puis posologie conditionnelle | Opus | high | Desktop | S5, S8 | `content/…/insuline.yaml`, `docs/decision/validation/` | [ ] |
| [S10](S10.md) | T-204 | Invariant rédactionnel : plus aucune incise de citation en posologie | Sonnet | medium | — | S5, S6, S7 | `engine/banc/` | [ ] |

## Ordonnancement

- **Vague 1 — parallélisable** : S1 · S4 (zones disjointes : `schema/`+`src/` contre `docs/`).
- **Vague 2 — parallélisable, après S1** : S2 · S3 (zones disjointes : `components/` ·
  `engine/banc/invariants-contenu.test.ts`).
- **Vague 2b — après S2** : S8, seule. **Correction du 2026-08-11** : S8 touche aussi
  `components/OptionCard.tsx` (rendu des items filtrés) et `screens/DecisionNodeScreen.tsx` (câblage
  d'un nouveau champ `OptionVue`, même pattern que `optionVue.contreIndications` →
  `contreIndications={...}` déjà en place l. 1414) — zone désormais **partagée avec S2**, donc plus
  parallélisable avec elle. S8 se cale sur les classes CSS que S2 vient de poser plutôt que de les
  redécouvrir. S3 reste indépendante des deux et peut chevaucher S8 dans le temps si l'exécution le
  permet, mais ce n'est plus une contrainte du plan.
- **Gate humaine** entre S4 et la vague 3 : Thibault tranche le sort des 8 citations orphelines
  (versées en bibliographie ou retirées de l'écran) avant que S6/S7 ne migrent. **S5 n'attend pas cette
  gate** (elle ne dépend pas de S4).
- **Vague 3 — parallélisable** : S5 · S6 · S7 (trois fichiers de contenu distincts, S6/S7 après la
  gate). Chacune porte son bump de version, son changelog et sa relecture D5.
- **Vague 4** : S9 (après S5 et S8).
- **Vague 5** : S10 — l'invariant « plus aucune incise » **en dernier**, seul moment où il peut passer
  au vert.
- **Vague 6 — consolidation** : commits tâche par tâche, statuts, `STATUS.md`, `TASKS.md`, push.

## Points de vigilance transverses

- **G1 rougit** (`engine/banc/grammaire.test.ts`) dès qu'une propriété du schéma n'est pas classée dans
  `CHAMPS_DU_SCHEMA`. C'est le garde-fou qui fonctionne — ne jamais le contourner.
- **`jargon-projet.test.ts` rougit à la compilation** (l. 125-126 traite `posologie_detail` comme
  `string[]`). Il vient d'être étendu à ce champ le 2026-08-07 pour fermer un trou de jargon : **le
  texte des notes de source doit lui aussi être contrôlé**, sinon la migration rouvre ce trou.
- **Une parenthèse n'est pas toujours une citation.** Trois cas mesurés où l'extraction détruirait de
  l'information clinique (la glose « dans les deux sens » de HAS R.87, le protocole réel de FullSTEP,
  « BRIGHT, CONCLUDE » en sujet de phrase). **Migration item par item, jamais par expression
  régulière** — le banc ne verrait aucune de ces pertes.
- **Un id inconnu est ignoré par la carte, par politique** (`OptionCard.tsx`) : c'est le travail d'un
  invariant de contenu de le signaler, pas d'un composant au milieu d'une consultation. D'où S3, sans
  laquelle une source pointant vers un id inexistant **disparaîtrait sans rien casser**.
- **D5** : toute modification de nœud = bump de version + changelog + validation humaine.
