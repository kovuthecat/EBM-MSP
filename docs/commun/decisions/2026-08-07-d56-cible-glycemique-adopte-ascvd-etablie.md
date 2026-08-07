# 2026-08-07 — D56 · `cible-glycemique` adopte la définition STRICTE `ASCVD_etablie` à la place d'`antecedent_cv`

### Décision

Tranche l'**arbitrage 1** laissé ouvert par la matrice des faits de sécurité du domaine
(`docs/decision/validation/criteres-communs-2026-08-06.md` §6), et clôt le cas **N4** de la revue de
conception du 2026-08-04.

Le nœud `cible-glycemique` **retire `antecedent_cv`** (définition large : « tout antécédent
cardiovasculaire ») et **déclare `ASCVD_etablie`**, avec un encodage **rigoureusement identique** à celui
de `prescription` et `statine` (`type: bool`, `partage: true`, `presomption_non: true`, aucune `valeurs`,
aucun `derive`). Le domaine DT2 porte désormais **un seul** vocabulaire pour ce fait : *maladie
cardiovasculaire athéromateuse établie*, au sens des essais CTT/HPS — la prévention secondaire.

**Décision référent, en conversation, le 2026-08-07** : « *il faut appliquer `ASCVD_etablie` sur le nœud
de cible glycémique* ».

### Contexte

Deux noms, deux nœuds d'origine, deux `criteres_entree` indépendants : aucun `derive` ne les reliait,
aucun commentaire du dépôt n'affirmait l'équivalence. Les deux étaient traités **techniquement** de la
même façon par le moteur (`presomption_non: true` des deux côtés) — ce qui ne dit rien de leur
définition **clinique**.

**Ce que la matrice avait mesuré, et qui rendait l'arbitrage nécessaire.** Sur `cible-glycemique`,
`antecedent_cv == true` — **seul**, sans fragilité, sans comorbidité grave, sans espérance de vie
limitée — fait passer la cible de 7 % (repli) à **8 %**. Or la SFD, citée dans l'argumentaire du nœud
même, réserve ce relâchement à la maladie cardiovasculaire **évoluée/établie**, pas à un antécédent au
sens large. Si `antecedent_cv` se lit largement (un événement ancien et stabilisé compte) pendant
qu'`ASCVD_etablie` se lit strictement, alors le relâchement de cible s'appliquait à des patients pour
lesquels ni `prescription` ni `statine` ne considéraient la même chose comme « établie ». **Le même
patient était classé différemment selon l'écran ouvert.**

Ce qui manquait pour trancher était une **définition écrite et comparable** — aucun des deux fichiers ne
disait ce qui compte (infarctus ancien ? angor stable ? artériopathie asymptomatique d'imagerie ?). Sans
elle, impossible de dire si la fusion des deux noms était une clarification sans risque ou un changement
de seuil clinique déguisé en renommage. C'est ce que le référent a fourni.

### Raison du choix — et la perte assumée

**La définition stricte l'emporte parce qu'elle est celle qui est déjà écrite, sourcée et partagée.**
`ASCVD_etablie` est le nom porté par deux nœuds sur trois, avec `partage: true` (donc repris d'un écran
à l'autre dans la session), adossé à la définition de `docs/decision/noeuds/F-statine.md` (« maladie
athéromateuse établie … = prévention secondaire »). `antecedent_cv` était le nouveau venu (ajouté le
2026-08-06), **sans** `partage`, et c'est précisément cette absence qui avait déjà causé un défaut
mesuré en P12/S1 : une ré-entrée dans le nœud faisait revenir le critère à son défaut, et la suggestion
d'espérance de vie se recalculait sur un dossier amputé.

**Conséquence clinique assumée, écrite noir sur blanc** : des patients qui obtenaient l'assouplissement à
8 % sur la seule base d'un antécédent cardiovasculaire **ancien ou stabilisé** ne l'obtiendront plus par
ce critère. Ils restent éligibles par les **trois autres branches** du même `OR` — `fragilite`,
`comorbidite_grave`, `esperance_vie == limitee` — inchangées.

**Mesuré sur le banc, pas estimé** : **23 profils sur 195** changent de sortie (19 sur 180 profils
complets, 4 sur 15 profils à indétermination simulée), et les 23 s'expliquent **intégralement** par le
même mécanisme unique — la colonne de fixture figée manque pour le nom nouveau, combinée à
`presomption_non: true` (déterminé par défaut) et à la logique ternaire des `OR`. Sur les 19 : 16
retombent sur le repli « Cible ≤ 7 % », 3 remontent à « Cible ~6,5 % » (patients jeunes, diabète récent,
espérance de vie longue, que l'ancien critère excluait explicitement de la cible la plus stricte). Aucun
changement inexpliqué ; aucune bascule vers « Cible < 9 % ». Détail complet :
`plans/P14/S17-arbitrage1-antecedent-cv.md`.

L'`aide` de saisie posée sur `ASCVD_etablie` dans `cible-glycemique` est la **première du domaine** sur
ce critère, et elle nomme le périmètre : infarctus du myocarde, AVC ischémique ou AIT, artériopathie
périphérique symptomatique, revascularisation coronaire ou périphérique. Elle n'a **pas** été reportée
sur `prescription`/`statine` — signalé, hors périmètre de la session qui l'a écrite.

### Ce qui reste interdit

1. **Réintroduire un second nom pour ce fait**, dans quelque nœud que ce soit. Un nom, une définition,
   pour tout le domaine (`GRAMMAIRE-NOEUD.md` **R14**).
2. **Élargir la lecture d'`ASCVD_etablie` nœud par nœud.** Le fait est `partage: true` : une valeur
   saisie sur un écran est reprise sur le suivant. Deux lectures du même nom feraient circuler un concept
   sous un nom commun avec deux sens — exactement ce que R14 interdit.
3. **Réécrire l'historique.** Les entrées de changelog, dossiers de preuve et documents de recette datés
   qui nomment `antecedent_cv` restent tels quels : ce sont des enregistrements, pas des descriptions de
   l'état courant.

### Conséquences

- **Contenu** : `cible-glycemique.yaml` v2.17 → v2.18 — critère remplacé, plus toutes les occurrences
  actives (condition de « Cible ≤ 8 % », garde négatif de « Cible ~6,5 % », `contre_indications`, clé de
  `motifs`, prose de `cadrage` et d'`argumentaire`). L'argumentaire exhaustif n'a **pas** été modifié :
  relu intégralement, il employait déjà la nuance stricte (« un antécédent cardiovasculaire **établi**
  ouvre à lui seul la cible ≤ 8 % »).
- **Tests** : vignettes de `evaluateNode.cible-glycemique.test.ts` renommées, **aucune assertion
  changée** — la preuve que le renommage préserve les verdicts cliniques.
- **Invariants** : I19/I32 (`coherence-inter-noeuds.test.ts`) confirment l'encodage identique sur les
  trois nœuds — c'est cet invariant qui rend la décision opposable, et non la vigilance de l'auteur.
- **Golden master** : `caracterisation*.cible-glycemique.txt` régénérés, diff relu **par script** et non
  à l'œil (195 profils). Cf. **D58** pour la doctrine générale de peuplement d'une colonne nouvelle sur
  des profils gelés — non applicable ici, où le critère est **renommé** et non ajouté.
- **Code** : `src/features/decision/lib/esperanceVieDefault.ts` lisait `criteria.antecedent_cv` **en
  dur** — seul endroit du dépôt hors contenu où ce nom était un identifiant de code. Signalé comme dette
  par la session qui a fait le renommage (ses tests dédiés restaient verts en boîte blanche, donc
  aveugles à la rupture d'intégration) ; **corrigé depuis** : le driver s'appelle `ASCVD_etablie`
  (`ESPERANCE_VIE_DRIVERS`), avec une note « RENOMMÉ le 2026-08-07 » dans la docstring. `labels.ts`
  n'avait rien à corriger — `ASCVD_etablie` y portait déjà son libellé.
- **N2 humain** : le **périmètre clinique** de l'`aide` (faut-il y ajouter l'angor stable ? la
  revascularisation programmée ?) et la question de la reporter sur `prescription`/`statine` restent des
  jugements de référent → `VALIDATION.md`.
