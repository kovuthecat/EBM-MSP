# Plan P8 — Suites de la recette « praticien naïf » du 2026-07-30   (rédigé par Opus)

## Objectif d'ensemble

Lever la **condition bloquante** énoncée par les deux recettes (isolation entre patients), supprimer les
**étiquettes d'écran qui affirment le faux**, et encoder les **deux remarques du référent du 2026-07-30**
(glinide parmi les agents sans bénéfice dur ; critères AGP renommés et regroupés). Aucun chantier de
contenu clinique de fond : les autres améliorations de la revue du rapport sont listées ci-dessous et
attendent P9.

Source : `docs/decision/validation/recette-praticien-naif-2026-07-30.md` (15 vignettes, 304 actions) +
remarques référent du 2026-07-30 (glinide, critères AGP).

## Ce que ce plan a vérifié avant de se lancer

- **La « contamination inter-patients » n'est pas un bug de démontage.** C'est la conséquence directe d'un
  arbitrage documenté — une valeur reprise de session compte comme saisie
  (`DecisionNodeScreen.tsx` ≈ l.111-117) — appliqué à un nœud dont **les quatre critères décisifs** sont
  `partage: true` (`cible-glycemique.yaml` : `age`, `anciennete_diabete_annees`, `esperance_vie`,
  `fragilite`, marqués le 2026-07-29). La mémoire suffit donc à reconstituer une reco complète. Ce qui
  manque n'est pas le nettoyage : c'est **la frontière entre deux consultations**. P8 ne défait pas D28.
- **Trois défauts distincts, une seule racine.** « Sans effet sur la reco » sur un champ qui décide (N2,
  N13b), les deux étiquettes contradictoires sur le même champ (N11) et le silence sur les conjonctions
  viennent tous de la limite **assumée et documentée** de `engine/relevance.ts` (perturbation d'**un
  seul** critère à la fois, docstring « LIMITE CONNUE, ASSUMÉE ») — plus, pour N11, de `calculsEnAttente`
  absent de `signatureVue` (`lib/vueDecision.ts`, `serialiseOption` sérialise `calculs`, pas les calculs
  en attente).
- **Le cartouche « En attente » a déjà sa donnée.** `vue.enAttente[].manquants` est calculé (registre
  exact d'`evaluateNode`, cité comme source de vérité par la docstring de `relevance.ts`) ; le JSX de
  `DecisionNodeScreen.tsx` ne rend que le titre. Le défaut vu 4 fois (N1, N2, N7, N13b) est un oubli
  d'affichage, pas un manque d'information.
- **La « Suggestion auto » d'espérance de vie est inerte par construction.** `handleCriteriaChange` écrit
  bien `next.esperance_vie = suggestEsperanceVie(next)`, mais n'ajoute pas le nom à `touched` ; or
  `CriteriaForm` calcule `selectionne = touched.has(nom) && …`, et `touched` fait aussi office de
  `renseignes` (D20). La valeur suggérée est donc **invisible à l'écran et ignorée du moteur** : cohérent
  avec les 3 essais du rapport (59 ans, 67 ans, 88 ans fragile + comorbide) où elle n'a jamais rien
  proposé.
- **Trois demandes d'ergonomie du rapport sont du contenu, pas du code** : `aide` (champ de schéma
  existant, utilisé **5 fois en tout**, jamais sur `prescription`/`statine`/`cible-glycemique`),
  `visible_si` (existe, non appliqué à `duree_seance`), `groupe` (rend déjà des sections **repliables**
  depuis P6/SB2 — c'est le « menu déroulant » demandé pour les critères AGP).
- **glinide est déjà traité comme un agent sans bénéfice dur dans les TEXTES** du nœud `prescription`
  (« Désintensifier : alléger / arrêter le sulfamide, le glinide… », `metformine_deprescriptible`,
  « ne s'applique PAS tant qu'un agent SANS bénéfice dur (sulfamide, gliptine, glinide, INSULINE
  incluse) est en place »). Seule la **voie d'accès** `remplacement_agent_sans_benefice` l'ignore :
  `derive: "intention != initier AND … contient sulfamide OR intention != initier AND … contient
  gliptine"`. La remarque du référent comble un trou net, elle ne rouvre aucun arbitrage.
- **Les critères AGP** : `profil_glycemique` est une **`liste` à 4 valeurs** (`hypo_nocturne`,
  `phenomene_aube`, `excursions_postprandiales`, `stable`), lue par 2 dérivés
  (`profil_nocturne_permet_titration`, `profil_nocturne_a_cible`) et ~8 conditions d'options + 1 alerte.
  `hypo_interprandiale` en a été **sorti le 2026-07-27 (arbitrage référent, motif R5)** : il accuse le
  bolus, donc ne se recueille que dans un schéma qui en comporte, ce qu'un `visible_si` de champ entier
  ne permettait pas dans la liste. **Le regroupement demandé ne doit donc pas re-fusionner ces deux-là**
  dans un même critère — il se fait par `groupe` (présentation), pas par fusion de champs.

## Ce que ce plan NE fait pas

- **Ne livre pas le cadrage de validité de l'HbA1c** : il reste **P7/SA2** (T-052/T-053), non livré. C'est
  le défaut dont la conséquence patient est la plus directe (N12) ; il se termine dans P7, pas ici.
- Ne rouvre **aucune** doctrine tranchée : « pas de molécule/dose hors du nœud `insuline` » (P7),
  asymétrie iSGLT2/AR GLP-1 chez le dénutri (« sans action », 2026-07-29), `position_vs_cible` retiré
  (T-048 obsolète).
- N'entame pas les chantiers de lisibilité de fond, qui demandent chacun une rédaction clinique et donc
  leur propre plan : motif rédigé par option (« Proposé parce que » en expression booléenne, défaut de
  lisibilité n° 1 du rapport) · purge du jargon (`nœud E`, `Palette glycémique ouverte`, gardes
  `DFG > 0`, notes de travail dans les argumentaires, critique de source dans `statine`) · refonte de
  « Pourquoi pas d'autres options ? » · cartes redondantes d'allègement · titres de dépli · blocs trop
  longs · famille « Agent à ajouter » vs justification « remplacement » · `aide` sur les champs de
  jugement · saisie poids/taille au lieu de l'IMC · les 15 items de contenu clinique (dose et molécule
  des iSGLT2/AR GLP-1, chiffres de perte de poids, volume d'AP, séquence des gestes, quantité de baisse
  en désescalade, seuils de capteur commentés, kaliémie/cirrhose/chutes/refus…).
  **Tous sont consignés dans la revue du 2026-07-30 ; à cadrer en P9 après arbitrage.**

## Arbitrages — réponses du référent du 2026-07-30

**B3 — RÉPONDU, et il va plus loin qu'un renommage.** *« Je confirme la volonté de changer hypo nocturne
par baisse continue **qui déclenche diminuer la basale plutôt que corriger l'hypoglycémie**. »*
→ Ce n'est pas seulement un libellé : c'est un **changement de routage**. Conséquence encodée en **S9**
(nouvelle session), S6 restant le seul renommage. Détail de l'état actuel, vérifié dans le contenu :
`hypo_nocturne` joue aujourd'hui **trois** rôles distincts —
(1) **déclencheur** de « Corriger l'hypoglycémie ou la variabilité (réduire la dose, passer en 2ᵉ
génération, relâcher la cible) », à côté de `TBR > 4` et `CV > 36` — *c'est celui que le référent veut
déplacer* ;
(2) **exclusion** (garde-fou) de quatre options d'escalade : « Titrer la basale (augmenter la dose) »,
« Ne pas sur-titrer la basale », « Ajouter un GLP-1 / association fixe », « Ajouter un bolus » ;
(3) **déclencheur**, en « basale seule », de « intensifier autrement » (GLP-1 puis bolus) — arbitrage
E-04b du 2026-07-27.
Et **aucune option du nœud ne s'intitule « réduire la basale »** : le geste n'existe aujourd'hui que dans
le *texte* de « Optimiser la répartition du basal-bolus » (« hypo nocturne → réduire la basale »), sans
quantité — ce que la recette du 2026-07-30 relève comme l'asymétrie la plus frappante du nœud (« le tool
calcule une dose quand il faut monter, pas quand il faut descendre »). **Trois sous-questions restent
ouvertes, listées §B3a-B3c ci-dessous.**

**B4 — RÉPONDU : `enum`.** Le profil nocturne devient un champ à valeurs exclusives (une courbe a une
forme). Gain : 3 cases cochables → 1 champ, et « stable » + « baisse continue » cochés ensemble — qui ne
décrit aucune courbe — devient impossible par construction.

**B5 — RÉPONDU, et la réponse tranche plus que la visibilité.** *« Hypo interprandiale et hyper
interprandiale doivent être regroupées ensemble en liste enum dans les profils avec bolus (elles pilotent
l'adaptation du bolus). »*
→ Un **seul** critère `enum` « **Profil glycémique entre les repas** », visible **uniquement** dans les
schémas comportant un bolus (donc ni naïf, ni basale seule), portant les deux signaux qui accusent le
bolus. C'est **plus** que le regroupement visuel que je recommandais : `excursions_postprandiales` cesse
d'être un critère à part et **disparaît de « basale seule »**.

⚠ **Une conséquence, tranchée par B5b ci-dessous.** En « basale seule » avec capteur,
`excursions_postprandiales` ne servait pas à ajuster un bolus : il servait à établir que **la nuit est à la
cible, donc que la basale n'est pas en cause**. Via le dérivé `profil_nocturne_a_cible`, c'est lui qui
**déclenche** « Ne pas sur-titrer la basale — intensifier autrement », « Ajouter un GLP-1 / une association
fixe » et « Ajouter un bolus au repas principal » depuis « basale seule » — route ouverte exprès le
2026-07-27 (arbitrage E-04b, vignette A27-4). Bolus-only, ce signal quitte « basale seule » et **la route
se ferme** : le patient sous basale + capteur dont l'écart est post-prandial repartirait sans geste nommé.

**A1 — RÉPONDU : oui**, une carte « **Remplacer le glinide** » dédiée, symétrique de la gliptine et du
sulfamide.

**A2 — RÉPONDU : oui**, le remplacement du glinide est conditionné à la **disponibilité effective d'un
remplaçant** (DFG ≥ 20 pour l'iSGLT2, AR GLP-1 sans dénutrition), et cette réserve est écrite dans les
`inconvenients` — pas seulement en commentaire YAML. La niche rénale du répaglinide reste intacte.

**B5b — RÉPONDU, et plus simplement que ma proposition.** *« On peut remplacer stable par courbe nocturne
plate. Courbe nocturne plate + HbA1c au-dessus de l'objectif donne : ne pas sur-titrer la basale,
intensifier autrement. »*
→ Le **niveau** ne devient pas une valeur du profil : il vient de l'HbA1c, que le nœud connaît déjà
(`cible_atteinte`). Trois valeurs suffisent donc, et le modèle nocturne devient **une forme de courbe = un
geste sur la basale** :

| Forme nocturne | Ce que ça dit de la basale | Geste |
| --- | --- | --- |
| **Hausse continue** (ex-« phénomène de l'aube ») | couverture insuffisante | **titrer à la hausse** |
| **Courbe plate** (ex-« stable ») + HbA1c au-dessus de l'objectif | la basale n'est pas en cause | **ne pas sur-titrer — intensifier autrement** (GLP-1 puis bolus) |
| **Baisse continue** | excès de basale | **réduire la basale** (S9) |

⚠ **Conséquence de cadrage : S7 n'est plus « à sortie constante ».** La valeur plate déclenche aujourd'hui
la titration **à la hausse** (`profil_nocturne_permet_titration = stable OR phenomene_aube`) ; elle
déclenchera désormais « **ne pas sur-titrer** ». C'est un **changement de conduite**, assumé et demandé.
Les deux dérivés nocturnes sont donc redéfinis dans S7 — ils ne peuvent pas l'être ailleurs, puisque leur
source disparaît dans le même commit — et la vérification de S7 passe de « aucun profil ne change » à
« **seuls les profils attendus changent, listés un par un** ».

**B3a — retenu par défaut (recommandation non contredite) : nouvelle carte.** « Réduire la basale » est une
option à part entière ; « Corriger l'hypoglycémie ou la variabilité » garde ses déclencheurs de **seuil**
(`TBR > 4`, `CV > 36`, glycémie à jeun basse). Bénéfice de bord : la recette relève que « Corriger
l'hypoglycémie… » est **indisponible en basal-bolus** (« la carte qui parle de corriger l'hypoglycémie est
fermée précisément dans le schéma qui en fait le plus ») ; une carte « Réduire la basale » ouverte dans
**tous** les schémas comportant une basale règle ce constat au passage. *Si tu voulais l'autre option
(re-titrer l'existante), dis-le avant de lancer S9.*

**B3b — RÉPONDU : chiffré, par symétrie.** *« −2 UI ou −10 % en symétrie de la hausse. On a vu que de toute
façon il n'y avait aucune donnée EBM sur les protocoles d'intensification ou de décroissance. »*
→ Encodé tel quel. **Une exigence de forme s'y attache** (CLAUDE.md invariant 6, et c'est ce qui rend la
décision tenable) : la provenance doit être **dite à l'écran**. Les chiffres de la montée sont sourcés
(+2 U · ebmfrance ; +10 % au-delà de 40 U/j · SFD 2025 Avis 18 ; réévaluer tous les 3 jours · HAS 2024
R.87, accord d'experts) ; ceux de la descente sont **une symétrie**, pas une donnée publiée, et la carte
doit l'écrire — jamais les attribuer à une source qui ne les porte pas. C'est le registre que la recette
salue ailleurs dans ce même nœud (« le recul manque, pas l'autorisation »).

**B3c — RÉPONDU : oui, la baisse continue garde ses garde-fous.** Les 4 `exclusions` contre la titration à
la hausse restent, et le déclencheur « intensifier autrement » de E-04b reste. Trois faits, trois canaux
(D21 / R4 / R8) : « ne pas monter », « descendre », « intensifier ailleurs ». Cohérent : un patient en
excès de basale peut légitimement voir « réduire la basale » **et** « ajouter un bolus / un GLP-1 » — c'est
exactement le cas de sur-basalisation que E-04b visait.

**Tous les arbitrages du plan sont tranchés.** Les neuf sessions sont lançables dans l'ordre des vagues.

## Sessions

| Session | Tâches | Titre | Modèle | Effort | Env. | Dépend de | Zone modifiée | Statut |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [S1](S1.md) | T-055, T-056 | Isolation patient : confirmation in-app + état de session visible | Sonnet | medium | — | — | `src/features/shared/layout/Header.tsx`, `Header.css`, `src/App.tsx`, `src/features/decision/lib/sessionCriteres.ts` | [x] |
| [S2](S2.md) | T-057, T-060, T-061 | Frontière de re-entrée, cartouche « En attente », suggestion d'espérance de vie | Sonnet | high | — | S1 | `src/features/decision/screens/DecisionNodeScreen.tsx`, `DecisionNodeScreen.css` | [x] |
| [S3](S3.md) | T-058, T-059 | Véracité des étiquettes de pertinence | Sonnet | medium | — | — | `src/features/decision/components/CriteriaForm.tsx`, `src/features/decision/lib/vueDecision.ts` | [x] |
| [S4](S4.md) | T-062 | `visible_si` sur « Durée d'une séance » | Haiku | low | — | — | `content/noeuds/diabete-type-2/rhd-activite-physique.yaml` | [x] |
| [S5](S5.md) | T-063 | Glinide rejoint les agents sans bénéfice sur critère dur | Sonnet | high | — | — (A1/A2 répondus) | `content/noeuds/diabete-type-2/prescription.yaml`, `prescription.argumentaire.md`, `src/features/decision/lib/labels.ts` | [x] |
| [S6](S6.md) | T-064 | Libellés AGP : baisse / hausse continue de la glycémie nocturne | Haiku | low | — | — (B3 répondu) | `src/features/decision/lib/labels.ts` | [x] |
| [S7](S7.md) | T-065 | Critères AGP : deux `enum`, et le profil nocturne devient le pivot de la basale | Sonnet | high | — | S6 | `content/noeuds/diabete-type-2/insuline.yaml`, `insuline.argumentaire.md`, `src/features/decision/lib/labels.ts`, `src/features/decision/engine/banc/fixtures/`, `__snapshots__/` | [x] |
| [S9](S9.md) | T-067 | La baisse continue nocturne déclenche « réduire la basale », chiffrée | Sonnet | high | — | S7 | `content/noeuds/diabete-type-2/insuline.yaml`, `insuline.argumentaire.md`, `src/features/decision/lib/labels.ts` | [ ] **non livrée** — voir recette P8, T-067 reste dans `TASKS.md` |
| [S8](S8.md) | T-066 | Recette navigateur N1 des changements P8 | Claude + navigateur | medium | Desktop | tout ce qui précède | `docs/decision/validation/` | [x] |

## Ordonnancement

- **Vague 1 — parallélisable** : **S1** (header/App) · **S3** (formulaire + modèle de vue) · **S4**
  (contenu RHD) · **S6** (libellés). Quatre zones disjointes, aucune dépendance.
  ⚠ **S6 et S5/S7 touchent tous `labels.ts`** : S6 est en vague 1, S5 et S7 en vague 2 — jamais en
  parallèle sur ce fichier.
- **Vague 2** : **S2** (après S1 — consomme l'accesseur de session posé par T-056) · **S5** · **S7** (après
  S6). Zones disjointes entre elles : écran · `prescription.yaml` · `insuline.yaml`.
- **Vague 2 bis** : **S9**, après S7 (même fichier `insuline.yaml`, jamais en parallèle). Séparée de S7
  **exprès** : les deux changent une conduite, mais des conduites **différentes** — S7 redéfinit le pivot
  nocturne (ce que dit la forme de la courbe), S9 ajoute le geste de descente et son chiffre. Deux diffs
  séparés, deux listes de profils changés à relire séparément ; mélangés, aucun des deux contrôles n'est
  faisable.
- **Vague 3 — contrôle** : **S8**, recette navigateur **en local** (`npm run dev`), comme P6 et P7 : le
  code n'est poussé qu'après validation.
- **Vague 4 — consolidation** : commits tâche par tâche, statuts de cet index, `STATUS.md`, `TASKS.md`,
  `VALIDATION.md`, push.

## Rapport avec P7

P7 reste ouvert et **n'est pas absorbé** : il lui manque **SA2** (T-052/T-053, cadrage de validité de
l'HbA1c — le point n° 2 par gravité du rapport) et **S2** (T-054, recette). À noter pour la
consolidation : la passe du 2026-07-30 a **vérifié les cinq arbitrages de P7 un par un** (tableau
dédié dans le rapport : 3 vus, 2 non livrés/non rencontrés) — T-054 peut être considéré comme **couvert
par cette recette** plutôt que rejoué. À trancher par le référent en même temps que les arbitrages
ci-dessus.

## Le fil rouge

## Consolidation (2026-07-30)

S1-S8 livrées et vérifiées (N0 : 865/865 tests, 0 échec, 11 skip ; recette N1 en local,
`docs/decision/validation/recette-P8-2026-07-30.md`). **S9 (T-067) n'a pas été livrée** — aucun bilan de
session, aucune carte « Réduire la basale » dans `insuline.yaml` : reste ouverte dans `TASKS.md`, à
reprogrammer. 8 commits tâche par tâche (S1-S8), un seul push.

Trois des huit sessions ne font que **rendre visible ce que le produit sait déjà** (les critères
manquants, la valeur suggérée, la vérité d'une étiquette) : le coût est faible et l'effet porte sur la
confiance que le praticien accorde à l'écran — c'est ce que le rapport mesure quand il dit « à cet
endroit, l'écran me fait perdre confiance en lui ». Les trois sessions de contenu (S4, S5, S7) encodent
des décisions **déjà rendues** ou rendues par les arbitrages ci-dessus. Toute session qui se retrouve à
arbitrer une question clinique s'est trompée de plan : elle doit s'arrêter et signaler, pas décider.
