# Contre-relecture des quatre niveaux d'argumentaire — DT2, 2026-08-06

> **Objet** : contre-relecture de la passe de rédaction du 2026-08-05
> (`passe-redaction-2026-08-05.md`) sur les quatre niveaux de lecture des six nœuds DT2 — badge de
> preuve (panneau « État des preuves »), carte dépliée, argumentaire du nœud, argumentaire exhaustif —
> puis application d'un **lot correctif** sur cinq nœuds. `cible-glycemique`, relu en premier pour
> calibrer, n'avait besoin de rien : c'est le nœud modèle.
> **Statut : corrections appliquées, en attente de relecture clinique.** Aucun champ moteur touché
> (une exception encadrée, cf. §3). Détail par nœud : l'entrée de changelog « contre-relecture
> rédactionnelle » de chaque YAML.

## 1. Méthode

Six relectures indépendantes (une par nœud), chacune sur le YAML **et** l'argumentaire exhaustif,
avec les mêmes critères : niveau 1 = ce que les essais ont mesuré + délai + sources de l'option ;
niveau 2 = une idée par puce, registre consultation, zéro jargon ; niveau 3 = logique de
hiérarchisation (~150 mots), incertitudes sur la donnée seule ; niveau 4 = document lecteur sans
méta-texte de fabrication ; et cohérence des chiffres entre niveaux (recoupés un à un sur
`prescription` et `insuline`). Puis un agent correcteur par nœud, sur fichiers disjoints,
spécification ligne à ligne, interdits moteur explicites.

## 2. Le constat transversal — la leçon à consigner

**La passe du 2026-08-05 a tenu.** Les chiffres concordaient entre niveaux (deux exceptions, cf. §3),
les divergences en trois faces sont lisibles partout, le jargon de champs YAML avait disparu des
cartes.

**Ce qui l'a trouée en un jour : les lots de comportement livrés le 2026-08-06** (T-167, T-168,
T-169/T-185, T-170) ont modifié des cartes sans repasser sur les textes qui les citent :

- `insuline` (T-167) : la sur-basalisation rétrogradée en repère d'alerte restait décrite comme
  déclencheur d'option à **cinq** endroits, dont l'argumentaire exhaustif qui affirmait l'inverse
  exact du comportement livré ;
- `prescription` (T-185) : quatre cartes renvoyaient vers « la désintensification » qui déclare ne
  plus les couvrir ; l'argumentaire exhaustif niait l'existence d'une carte créée la veille ;
- RHD ×2 (T-170) : la carte de repli, écrite hors de la discipline de la passe, parlait au praticien
  en jargon d'outil sur ses quatre niveaux et n'existait pas dans les `.argumentaire.md`.

> **Règle à opposer aux prochains lots** (candidate pour `CONSTRUIRE-UN-MODULE.md`, via P14/S12) :
> *un lot qui change le comportement d'une carte repasse tous les textes qui la citent, aux quatre
> niveaux — YAML et argumentaire exhaustif.* C'est l'équivalent rédactionnel du « correctif non
> propagé au nœud voisin » (famille déjà nommée pour le rendu, R6 volet rendu).

Second constat transversal : **les critères de rédaction n'existent nulle part en un seul endroit.**
`CONSTRUIRE-UN-MODULE.md` n'en donne pratiquement pas (P3 « registre de formulation », invariants de
rendu P6, trois lignes du §4) ; le reste est éparpillé entre R6 (+ volet rendu), R2, D11, D23, D49 et
le document de la passe. Une checklist « rédaction des quatre niveaux » dans
`CONSTRUIRE-UN-MODULE.md` (§2.6 naturelle) éviterait au prochain domaine la passe curative.

## 3. Ce que le lot correctif a changé

Détail complet : entrée « contre-relecture rédactionnelle » du changelog de chaque nœud. En résumé :

| nœud | version | corrections principales |
| --- | --- | --- |
| `insuline` | → 0.53 | sur-basalisation purgée des 5 emplacements (dont `.md`) ; SWITCH 2 : RR 0,70 réattribué à la symptomatique globale (0,58 nocturne) ; promesse « hypoglycémies nocturnes » retirée du niveau 3 ; `motifs` rédigés (« Réduire la basale », MCG) ; `effet_attendu` d'initiation restructuré ; alerte ratio réécrite sans pointer une carte ; argumentaire resserré |
| `prescription` | → 0.68 | 4 renvois « désintensification » recâblés vers les cartes d'arrêt réelles ; `.md` resynchronisé (la carte « Glinide — arrêter » existe) ; titres homogénéisés (« Sulfamide — introduire »…, `invariants.test.ts` suivi) ; `motifs` sur les citations négatives des replis ; attribution Prescrire au niveau 3 ; argumentaire resserré |
| `statine` | → 1.29 | bande CK « 4 à 10 » → « 5 à 10 » (seule contradiction de conduite de sécurité) ; carte rhabdomyolyse : 6 références sans rapport retirées ; NNT 42 (calculé, sous-groupe diabète) distingué du NNT 43 (publié, prévention primaire) ; **seul changement de `niveau_preuve` du lot** : carte « Statine indisponible » alignée sur sa jumelle par le raisonnement D49 (badge et délai qualifiaient l'acide bempédoïque, pas le geste) ; argumentaire 646 → ~200 mots |
| `rhd-alimentation` | → 0.17 | carte de repli réécrite au registre consultation ; `delai_benefice` renseigné sur les 16 cartes (motif d'ensemble 4,8-7 ans / « non établi », vérifié carte par carte) ; `.md` resynchronisé (17 pistes) et purgé de l'archéologie de vérification ; argumentaire resserré |
| `rhd-activite-physique` | → 0.19 | carte de repli réécrite ; `.md` resynchronisé (note sur le rôle de filet du repli) ; argumentaire 550 → ~160 mots, la logique de hiérarchisation par rang enfin énoncée ; renvois d'interface supprimés |

## 4. À arbitrer — non touché, signalé

S'ajoute aux 13 arbitrages ouverts de `passe-redaction-2026-08-05.md` (toujours valides sauf mention) :

1. **`insuline` — deux `niveau_preuve: modere` sur des accords d'experts** (« Corriger l'hypoglycémie
   ou la variabilité », « Réduire la basale ») quand leurs jumelles au même fondement portent
   `faible`. Descendre ou justifier l'écart.
2. **`insuline` — `delai_benefice` absent de 6 options `modere`** : durées de suivi des essais pas au
   dossier (= arbitrage n°6 de la passe, toujours ouvert).
3. **RHD ×2 — sens d'un badge de preuve sur une carte de repli** qui ne repose sur aucune source.
4. **`prescription` — IC de Huang & Yeh « 1,69 (1,25-2,59) »** non log-symétrique, affiché à
   3 endroits : à revérifier sur PMID 31108137 (= arbitrage n°3 de la passe).
5. **`statine` — fourchette « NNT 12 à 20 » (prévention secondaire)** quand la table du `.md` contient
   aussi 24 : vérifier laquelle est juste avant d'harmoniser.
6. **`statine` — l'encart CK > 50 N dément le titre de sa carte** (« Interrompre la statine — la
   classe reste indisponible ») : structurel, même motif que la scission T-153 sur la carte jumelle.
7. **`statine` — le parcours NHS England / AAC n'a pas d'entrée bibliographique** : la carte d'urgence
   rhabdomyolyse n'affiche plus de « D'après » du tout. Créer une entrée de type recommandation ?
8. **« Ce nœud » dans les champs affichés** (= arbitrage n°13 de la passe) : le lot a reformulé au cas
   par cas ce qui pouvait l'être sur la donnée, le reste attend la décision d'harmonisation.
9. **`labels.ts` — libellé dormant du dérivé `verrou_effort`** (« Signe imposant un avis… (limitation,
   ischémie, rétinopathie, pied) », l. ~293) : plus aucune option ne cite le dérivé, mais le libellé
   agrégatif ressortirait tel quel au premier réusage.

## 4 bis. Arbitrages du 2026-08-07 — tranchés avec le référent, exécutés

Quatre arbitrages tranchés en session (référent, 2026-08-07), en plus des corrections mécaniques du §3 :

1. **`insuline` — badges `modere` → `faible`** sur les deux cartes d'accord d'experts (« Corriger
   l'hypoglycémie ou la variabilité », « Réduire la basale »), alignées sur leurs jumelles au même
   fondement (aucun essai randomisé). Fait.
2. **RHD ×2 — badge de la carte de repli** : `faible` → `tres_faible`. Contrainte découverte en
   exécutant : `niveau_preuve` est un champ obligatoire du schéma, une suppression littérale du badge
   demanderait un changement de composant (`OptionCard.tsx`, rendu partagé par toutes les cartes) — hors
   mandat d'un lot de contenu. `tres_faible` (palier GRADE le plus bas) est l'approximation la plus
   proche de « aucune base de preuve » que le schéma permette d'écrire. Fait, signalé pour arbitrage
   ultérieur si une vraie suppression de badge est souhaitée.
3. **`statine` — scission de « Interrompre — la classe reste indisponible » pour CK > 50 N**, même
   défaut D6 que T-153 sur la carte jumelle rapportée. Plutôt que dupliquer une troisième carte
   d'urgence, la carte « Arrêter la statine — suspicion de rhabdomyolyse » existante est ÉLARGIE
   (`intolerance_statine == rapportee` → `!= non`) : la conduite d'urgence ne dépend pas de
   rapportée/avérée. Fait, 5 tests miroir ajoutés (F-21b, F-23b, F-24b, F-25-avr, F-25b-avr), suite
   verte (35/35).
4. **Harmonisation « ce nœud »/« le nœud » → formulation clinique** dans tous les champs affichés,
   sur les 6 nœuds + module RHD + les 6 argumentaires exhaustifs. Mesuré précisément via l'instrument
   `fragmentsNoeud`/`fragmentsOption` d'I25 (pas un grep brut, qui compte aussi les commentaires jamais
   rendus) : **82 occurrences réelles** dans des champs rendus (2 insuline / 8 prescription / 6+11+3
   RHD / 10+10+9+19+4 dans les cinq `.argumentaire.md` concernés — `cible-glycemique` et `statine.yaml`
   étaient déjà propres). Corrigées par lot délégué, un agent par nœud (RHD + son module traités
   ensemble pour garder les renvois croisés cohérents). Un 9ᵉ marqueur `n(?:œud|oeud)s?` a été ajouté à
   `jargon-projet.test.ts` (MARQUEURS_REDACTION) pour verrouiller le résultat en cliquet, comme les
   marqueurs du 2026-08-04/2026-08-05.

**Vérifications complémentaires (recherche, pas d'arbitrage)** :
- IC de Huang & Yeh (`prescription`, PMID 31108137) : le point estimé aHR 1,69 (répaglinide, risque
  cardiovasculaire vs glimépiride, p=0,001) est **confirmé exact** contre l'abstract PubMed. L'IC
  [1,25-2,59] n'est pas dans l'abstract — non vérifiable sans le texte complet (payant, *Diabetes
  Research and Clinical Practice* 2019). Dette non levée, mais le chiffre central n'est pas une
  invention.
- Fourchette NNT `statine` (« 12 à 20 » vs « 24 » de la table `.md`) : **fausse alerte**, pas une
  contradiction. Le 12-20 est calculé à partir de HPS/CARE/4S (statine vs placebo) ; le 24 vient de TNT
  (haute vs basse intensité) — deux questions cliniques différentes, correctement non fusionnées.
  Rien à corriger.

## 4 ter. Constat important — édition concurrente détectée pendant la session du 2026-08-07

La suite complète lancée en fin de session (§5) montre 4 échecs supplémentaires
(`evaluateNode.insuline.test.ts` ×3, `libelles.test.ts` ×1) qui ne viennent PAS de ce lot. Vérifié par
`git diff HEAD` sur `insuline.yaml` et `rhd-activite-physique.yaml` : des changements de `conditions`/
`exclusions` (retrait du terme `over_basalisation == true` de trois expressions ; retrait du dérivé
`verrou_effort`) correspondent exactement au mandat de **P14/S4 (T-167), S5 (T-168) et S8 (T-172)**,
et sont absents de tout journal d'agent de cette session (aucune mention de `criteres_entree`/
`derive`/`conditions` dans les transcripts). **P14 a donc continué à s'exécuter sur ces deux fichiers
pendant cette session**, malgré l'indication qu'il était en pause. Aucune correction n'a été tentée sur
ces 4 échecs : ils appartiennent au chantier P14 (probablement une session encore en cours de
finalisation — `evaluateNode.insuline.test.ts` n'a pas encore été mis à jour pour la nouvelle
partition, et `labels.ts` n'a pas encore perdu l'entrée `verrou_effort`), pas à cette contre-relecture.
**Avant toute consolidation (P14/S13), vérifier qu'aucune autre session P14 n'est active sur les
fichiers de contenu.**

## 5. Vérifications

Exécutées avec les modifications **non commitées de P14 (S10 en pause)** dans l'arbre de travail.

- Parse YAML des 6 nœuds : **OK** (versions 0.53 / 0.68 / 1.29 / 0.17 / 0.19 / 2.16, structure intacte).
- `npm run typecheck` : **vert**. `npm run build` : **vert**.
- `npm test` (suite complète, 1234 tests) : **un seul défaut imputable au lot, corrigé dans la
  foulée** — le garde-fou F-20 de `statine` (les HR défavorables de mortalité de CLEAR Outcomes
  doivent rester écrits en chiffres dans les `inconvenients` ; l'élagage les avait résumés en prose ;
  restaurés sur les deux cartes jumelles, F-20 revert). Restent rouges : `grammaire.test.ts` G1
  (préexistant, champ `icone` de T-149 non classé — documenté dans `STATUS.md`) et un échec I16 sur
  `prescription` **non reproductible machine libre** (vert en exécution isolée — l'instabilité sous
  charge que `STATUS.md` documente).
- Snapshots régénérés puis **relus** : `paires.prescription.txt` (seuls les intitulés changent, les
  comptes de co-activation dérivent des `conditions` intactes) et les 4 `caracterisation*.txt`
  d'`insuline`/`prescription`. Le diff de ces 4 fichiers se lit **contre le dernier commit**, donc il
  mélange les changements de comportement de P14 (T-167/T-168 : fusion de l'analogue 2ᵉ génération ;
  T-185 : redécoupage de la désintensification ; T-171 : retitrages) et les textes de ce lot.
  L'extraction des seules lignes d'option ajoutées/retirées ne montre **rien d'inexpliqué** : tous les
  mouvements d'option correspondent aux lots P14 nommés ci-dessus ou aux deux retitrages de ce lot
  (« Sulfamide — introduire », « Insuline — réduire la posologie »). **Un point à relire en
  consolidation P14/S13** : « Initier une insuline basale » perd son badge de mise en avant
  (`recommandee` → sans badge) sur 2 profils du banc — conséquence des lots P14 T-167/T-168 (ce lot-ci
  ne touche ni rôles, ni familles, ni ordre, ni conditions), à confirmer lors de la relecture des
  snapshots par P14.
- `statine`/`rhd`/`cible-glycemique` : caractérisation **inchangée au bit près** — attendu, leurs
  corrections ne touchent aucun champ entrant dans la signature du banc (intitulés, motifs, alertes).
