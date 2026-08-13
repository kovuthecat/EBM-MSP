# Cadrage P1 — domaine HTA (hypertension artérielle)

> Suit `CONSTRUIRE-UN-MODULE.md` §P1. Écrit par le référent, sans agent et sans source — aucune donnée
> chiffrée, aucun seuil clinique ici : ce document fige une **structure**, pas un contenu. Tout point
> qui appelle une vérification EBM est marqué `[À VÉRIFIER — P4]` et renvoie à
> `recherche-preuve-triangulee`.
>
> **Statut** : cadrage initial, discuté 2026-08-13. **En pause** — reprise après clôture réelle du
> module diabète de type 2 (DT2). Rien ici n'est gelé au sens de P2 ; ce document peut encore bouger
> tant qu'il n'a pas produit les vignettes.

---

## 1. Intentions du praticien

Contrairement au DT2 (`initier / intensifier / optimiser / déprescrire`, une seule question), le
domaine HTA se cadre autour de **deux questions distinctes**, posées à des moments différents de la
prise en charge :

1. **« Dois-je initier un traitement ? »** — patient pas encore traité, ou déjà traité mais dont le
   diagnostic même est à reconsidérer (ex. contrôle apparent en cabinet à requestionner).
2. **« Comment traiter ? »** — patient déjà sous traitement antihypertenseur, intentions
   `initier / intensifier / optimiser / déprescrire` (transposées du DT2, à confirmer en pratique HTA).

Cette distinction commande le découpage en nœuds (§4).

---

## 2. Inventaire de l'existant (R9)

Ce que le nœud « comment traiter » doit connaître de ce qui est **déjà en place** :

- **Classe(s) en cours** — raisonnement par **classe** par défaut (IEC/ARA2, diurétique thiazidique,
  inhibiteur calcique, bêtabloquant, autre) ; granularité **molécule** seulement si soutenue par l'EBM
  (`[À VÉRIFIER — P4]`, par analogie avec le raisonnement DT2 sur les classes).
- **Tolérance clinique et biologique** (ex. toux sous IEC, œdèmes sous inhibiteur calcique, ionogramme
  sous diurétique/IEC-ARA2 — le détail exact des paramètres à collecter reste à trancher à l'écriture,
  pas ici).
- **Pas de dose collectée**, sauf si une dose pilote spécifiquement une contre-indication (cohérent
  avec la checklist 2.1 : un critère qui ne change rien à l'écran n'a pas sa place).
- **Pas de modélisation des associations fixes** (combinaisons commerciales à dose fixe) — le nœud
  raisonne classe par classe, pas par spécialité commerciale.

---

## 3. Trois questions de structure tranchées

### a) De quelle mesure parle le nœud ?

Trois méthodes possibles en entrée du nœud 1 : mesure **cabinet**, résultat **AMT**
(automesure), résultat **MAPA** (rare en médecine générale — traité comme voie alternative plutôt que
critère de premier rang systématique, cf. checklist 2.1 « coût de recueil »).

**Règle de préséance tranchée** : l'**AMT prime** sur la mesure cabinet, sauf quand la mesure cabinet
est très élevée, auquel cas elle déclenche directement la sortie « traitement médicamenteux immédiat »
sans attendre une AMT de confirmation. Les seuils numériques exacts (ce qu'est « très élevée », le
seuil AMT lui-même, stratifiés par le risque CV — voir ci-dessous) sont `[À VÉRIFIER — P4]`.

### b) La cible est-elle déclarée, jamais déduite ?

**Point ouvert, non tranché — à porter explicitement en P4.** Question posée telle quelle par le
référent : *une AMT à 135/85 chez un patient non traité signe l'absence d'HTA — une AMT à 135/85 chez
un patient déjà traité signifie-t-elle qu'il a atteint son objectif ?*

Deux issues possibles, dont le choix d'encodage dépendra de la réponse EBM (I4 — « un concept
clinique = un encodage », cf. l'incident des deux définitions concurrentes du risque hypoglycémique
sur `insuline`) :

- **Notion unique** : même calcul de cible, interrogé à deux moments (nœud 1 pour la décision
  initiale, nœud 2 pour évaluer le contrôle) → cible portée par un nœud/fonction partagé, comme
  « fixer l'objectif » en DT2.
- **Deux notions distinctes** (seuil de déclenchement du traitement ≠ seuil de contrôle sous
  traitement, cliniquement différents) → deux critères nommés différemment dès l'écriture, pas la même
  étiquette « cible » pour deux choses.

**Ne pas encoder avant d'avoir la réponse EBM.** Vignette(s) à prévoir en P2 : au moins un profil
patient traité avec AMT à la limite, dont la sortie attendue dépend de cette réponse.

### c) Découpage en nœuds, et module ou pas

Un seul module HTA, **4 nœuds** :

1. **Initier ?** — décision initiale, 4 sorties (traitement médicamenteux immédiat / à recontrôler —
   confirmer par AMT / RHD simple pour l'instant / absence d'HTA), plus un rappel de recommandations en
   cas de suspicion d'HTA secondaire (contenu informationnel intégré au nœud, pas une sortie séparée ni
   un nœud à part — ce module ne décide pas du bilan étiologique).
2. **RHD** — « quelles mesures de RHD proposer à ce patient ? », par analogie avec `H-rhd.md` du DT2 ;
   orienté depuis le nœud 1 plutôt que dupliqué en conclusion figée, pour ne maintenir le contenu RHD
   qu'à un seul endroit.
3. **Comment traiter** — intentions initier/intensifier/optimiser/déprescrire, patient déjà traité.
4. **Cible tensionnelle** — sous réserve de la question ouverte (b) : existera comme nœud séparé si la
   notion de cible est unique et partagée entre 1 et 3 ; à fusionner dans les nœuds concernés si les
   deux notions s'avèrent distinctes.

---

## 4. Dimensions de stratification identifiées (transverses aux nœuds)

À ce stade, les seuils/décisions du nœud 1 (et potentiellement du nœud « cible ») dépendent au moins
de : **âge**, **facteurs de risque cardiovasculaire**, **fragilité**. `fragilite` existe déjà dans le
catalogue de critères canonique (P0, partagé avec DT2) — à référencer, pas à réencoder. Les facteurs de
risque CV comme bloc structuré restent à confirmer contre ce catalogue à l'écriture (P5).

---

## 5. Points ouverts portés à P4 (`recherche-preuve-triangulee`)

- **Cible naïf vs traité** (§3b) — question prioritaire, structure deux nœuds différemment selon la
  réponse.
- Seuils de déclenchement (cabinet « très élevé », AMT, MAPA), stratifiés par le risque CV.
- Granularité classe vs molécule pour le nœud « comment traiter ».
- Paramètres exacts de tolérance biologique par classe (nœud « comment traiter »).

---

## 6. Point de blocage administratif — fichier de critères communs du domaine

`CONSTRUIRE-UN-MODULE.md` §P1 exige l'ouverture de
`content/decision/criteres-communs/hta.yaml` **avant le premier nœud, même vide**. En pratique,
`schema/decision/criteres-communs.schema.json` impose `criteres: minItems 1` — un fichier au tableau
vide ferait échouer `criteresCommuns.test.ts` (Ajv) dès `npm test`. Aucun fait de sécurité réel n'a
été identifié à ce stade du cadrage (la stratification par fragilité/FdR module des seuils, ce n'est
pas encore une contre-indication/retrait/alerte au sens R15/D54).

**Décision reportée** : le fichier sera ouvert au premier fait de sécurité réel rencontré à
l'écriture (P4/P5), pas maintenant sur un tableau vide qui casserait la suite verte. Item à signaler
au référent avant d'engager un futur domaine sur ce même gabarit — la porte P0 vérifie déjà les
invariants I3→I7 « verts sur tous les nœuds existants », ce blocage n'en fait pas partie mais mérite
d'être noté dans `CONSTRUIRE-UN-MODULE.md` lui-même à l'occasion.

---

## 7. Porte de sortie P1 — état

- [x] Intentions du praticien écrites (§1)
- [x] Inventaire de l'existant écrit (§2)
- [x] Trois questions de structure tranchées par écrit (§3) — b) tranchée comme *point ouvert explicite
      renvoyé à P4*, ce qui est une décision de structure en soi (ne pas encoder avant la réponse)
- [ ] Fichier de critères communs du domaine — **reporté**, cf. §6
- [ ] Vignettes (P2) — à écrire à la reprise, après clôture DT2
