# Passe A — retour OpenEvidence : défaut d'intégrité, et première lecture

> Fourni par le référent le 2026-07-29 (`OE Passe A.txt`, 132 Ko, 1182 lignes), archivé tel quel en
> [`OE-passeA-brut-2026-07-29.txt`](OE-passeA-brut-2026-07-29.txt).
>
> ⚠ **Statut : PROVISOIRE.** OE est du **débroussaillage, jamais une source primaire**
> (`00-global.md`, Règles de sourcing). Rien de ce qui suit n'entre dans `content/**` avant la passe
> adversariale (agent B), qui re-vérifie chaque PMID / DOI / chiffre contre la source primaire. Sur les
> nœuds E et H de ce projet, **la totalité des PMID rendus par OE étaient faux** — ceux de ce retour-ci
> ont l'air nettement meilleurs, ce qui ne dispense de rien.

---

## 1. LE DÉFAUT — tous les signes « inférieur à » ont disparu du fichier

**Mesure, pas impression** : le fichier contient **0 caractère `<`** sur 132 Ko, contre **48 `>`**.
L'asymétrie est la preuve : ce n'est pas OE qui a omis les seuils, c'est le transfert qui les a mangés
(un `<` ouvre ce qu'un assainisseur HTML prend pour une balise, et avale tout jusqu'au `>` suivant).

**Et c'est exactement la moitié dont on avait besoin.** Le sujet de la passe est *en dessous de quelle
valeur faut-il réduire la dose* — donc tout s'écrit avec `<`. Résultat, dans le tableau de synthèse des
règles de descente (§ Question 1 du bloc OE-A2), **les montants de réduction ont survécu et les seuils
qui les déclenchent ont disparu** :

| Ce que le fichier dit | Ce qu'il devrait dire |
|---|---|
| « Treat-to-Target — Any PG ⟨vide⟩ — Fixed units (−2 to −4 U) » | « Any PG **< X mg/dL** → −2 à −4 U » |
| « AT.LANTUS Fritsche — FBG ⟨vide⟩ — −2 U » | « FBG **< X** → −2 U » |
| « PREDICTIVE 303 — Mean aFPG ⟨vide⟩ — −3 U » | « Mean aFPG **< X** → −3 U » |
| « SENIOR (elderly) — SMPG ⟨vide⟩ — −3 U » | « SMPG **< X** → −3 U » |
| « HEART2D — prandial arm targeting 2-h PPG ⟨vide⟩ » | la cible post-prandiale de l'essai |

**18 emplacements** sont touchés de cette façon. Or la contrepartie — les montants (−2 U, −3 U,
−10-20 %) — est précisément ce que le nœud portait **déjà**. Le retour, en l'état, confirme ce qu'on
savait et ne livre pas ce qu'on cherchait.

**Ce qui a survécu, en revanche** : tout ce qui s'écrit avec `≤`, `≥`, `>` ou en toutes lettres. Les
cibles `≤135 mg/dL` d'OPAL et de l'étude POC sont intactes, les fourchettes (`90–130 mg/dL`) aussi, et
tous les PMID/DOI, designs, populations, résultats et appréciations GRADE le sont également. **Le
fichier reste largement exploitable** — il manque une classe précise de nombres.

### Ce qu'il faut refournir

Relancer **OE-A2 seul** (le bloc « titration »), en ajoutant au prompt une consigne de format qui
contourne le problème :

> *Express every threshold in words or with the `≤` sign — never with the `<` character (e.g. write
> « at or below 70 mg/dL » or « ≤70 mg/dL », not « <70 mg/dL »). Restate each down-titration trigger
> explicitly in a numbered list.*

Ou, plus sûr : **exporter le résultat en fichier** plutôt que le copier-coller.

---

## 2. Première lecture — ce que ce retour apporte réellement

> Tout ce qui suit est **à re-vérifier en source primaire** par l'agent B. Les rapports des 5 agents A
> n'étaient pas encore rendus au moment d'écrire.

### 2.1 Il répond par la négative à la question qui bloquait la passe

**Aucun ECR n'établit que cibler la glycémie post-prandiale améliore un critère dur.** Les trois essais
dimensionnés pour le tester sont tous négatifs :

> ⚠ **PMID CORRIGÉS APRÈS RED-TEAM B2 (2026-07-29).** Le tableau ci-dessous portait les PMID rendus par
> OpenEvidence. B2 les a vérifiés un à un : **six des sept PMID d'OE sont faux**, dont deux de ce
> tableau — `28711407` pointe sur de la neuro-imagerie et `20228404` sur ACCORD Lipid. Seul celui de
> HEART2D était bon. **Le motif est net et exploitable : les DOI d'OE sont justes (3/3) et ses chaînes de
> citation aussi (6/7) ; ce sont ses PMID qui sont faux.** Ne jamais recopier un PMID d'OE — reprendre le
> DOI ou la citation, et retrouver le PMID soi-même.

| Essai | PMID annoncé par OE | Verdict B2 | Population | Résultat |
|---|---|---|---|---|
| **HEART2D** | 19246588 | ✅ correct | DT2 post-IDM, prandial vs jeûne | **HR 0,98** — nul, arrêté pour futilité |
| **ACE** | ~~28711407~~ | ❌ **FAUX** (= neuro-imagerie) | Intolérance au glucose + coronaropathie, acarbose | **HR 0,98 (0,86-1,11)** — nul |
| **NAVIGATOR** | ~~20228404~~ | ❌ **FAUX** (= ACCORD Lipid) | Intolérance au glucose + risque CV, natéglinide | **HR 0,94 (0,82-1,09)** — nul |

Le sous-groupe post-hoc HEART2D chez les plus de 65,7 ans (HR 0,69) est **générateur d'hypothèse, rien
de plus**. Et le `1,80 g/L` que le nœud affiche depuis le début se confirme comme **un consensus
d'experts** — l'AACE l'emploie pour définir la sur-basalisation (PPG au-dessus de 180 mg/dL avec une
glycémie à jeun à la cible, **ou** dose de basale au-delà de 0,5 U/kg/j), pas comme un seuil issu d'un
essai. C'est la réponse que la vignette V-A4 attendait : le seuil existe, il est traçable, et il faut
l'afficher **comme un accord d'experts**.

### 2.2 ⚠ Un point qui contredit le cadrage de la passe, et qui te revient

Le cadrage du 2026-07-27 posait : *« la glycémie à jeun sert de critère pour la basale, les glycémies
post-prandiales pour la rapide. »* Or, d'après ce retour :

- **FullSTEP** — l'essai que le nœud cite précisément pour le basal-plus par étapes — **titrait sur la
  glycémie PRÉ-prandiale** (72-130 mg/dL), pas post-prandiale ;
- **l'étude 1-2-3** utilisait elle aussi des cibles **pré-repas / coucher** ;
- seuls **OPAL** et l'étude **POC** ont titré sur une post-prandiale à 2 h (≤135 mg/dL), et encore : dans
  la branche américaine de POC, c'était du pré-repas ;
- **4-T** utilisait les deux (pré-repas 72-99, post-repas 2 h 90-126 mg/dL).

Autrement dit, la pratique majoritaire des essais est de **piloter le bolus sur la glycémie AVANT le
repas suivant**, pas 2 h après celui qu'on couvre. Ce n'est pas un détail d'encodage : ça change le
champ à créer, et la question qu'on pose au praticien. **À trancher par le référent** — c'est
exactement le genre de point que l'invariant 6 interdit de décider seul.

### 2.3 Il répond aussi à la question de conception des créneaux — et l'invalide en partie

Verbatim du retour, à re-vérifier : *« **No guideline or trial retrieved uses a fixed clock-time
four-period division** (e.g., 00:00-06:00, 06:00-12:00, 12:00-18:00, 18:00-24:00) for insulin dose
attribution. The meal-anchored approach is universal in clinical practice. »*

Et la logique d'attribution elle-même (hypo nocturne → basale, hypo avant le repas suivant → bolus du
repas précédent) est cotée **⊕◯◯◯ très faible — « physiological reasoning only ; never validated in an
RCT »**, adossée au seul tableau de consensus AACE 2022.

Plus gênant encore pour le découpage proposé, **Bolli 2019** (analyse poolée post-hoc EDITION,
doi:10.1111/dom.13515) : les hypoglycémies culminent **entre 06:00 et 08:00**, c'est-à-dire *juste après*
la fenêtre nocturne standard ; étendre la fenêtre à 07:59 **double environ** le nombre d'épisodes
capturés. Une case « nuit 0-6 h » manquerait donc le pic.

Les définitions de la fenêtre nocturne, par ailleurs, divergent d'une source à l'autre (Global HAT :
00:00-06:00 ; DEVOTE et SWITCH 2 : 00:00-05:59 ; SoliMix : les deux, horaire **et** « coucher-réveil »).
**Conséquence pour la vignette V-A9** : ta piste des 4 créneaux reste défendable, mais le nœud n'aura pas
le droit de la présenter comme documentée, et le découpage horaire fixe devra probablement céder à un
découpage **ancré sur les repas**.

### 2.4 Sur le sujet âgé (vignette V-A6), il tranche net

- **SENIOR** (PMID 29895556, n=1014, ≥65 ans) est **le seul ECR dédié**. Il a relevé la borne basse de la
  cible de glycémie à jeun (**90** au lieu de 80 mg/dL) — mais **n'a pas testé** un pas plus petit ni un
  intervalle plus long : même schéma hebdomadaire que les autres EDITION.
- **Aucun ECR n'a testé une titration ralentie chez le sujet ≥ 75 ans ou fragile.** Tout le reste est
  accord d'experts (⊕◯◯◯).
- Une prise de position ADA 2025 (Bolli, *Diabetes Care* 2025;48(5):671-681) recommande, en cas de risque
  hypoglycémique élevé, **pas plus de 2 U de changement par semaine** et une **cible de glycémie à jeun
  de 100-120 mg/dL** plutôt que 80-100. C'est chiffré, c'est attribuable, et c'est exactement ce que
  V-A6 réclamait — mais c'est un **accord d'experts**, à afficher comme tel.

### 2.5 Sur l'autosurveillance (vignettes V-A7, V-A8)

- DT2 **non insuliné** : effet réel mais marginal sur l'HbA1c (~0,15-0,30 %), porté presque entièrement
  par l'ASG **structurée** ; **aucun critère dur**.
- DT2 **insuliné** : **un seul ECR** de fréquence d'ASG (Nauck 2014), ⊕⊕◯◯.
- **Densité minimale d'ASG pour titrer en sécurité : aucune donnée directe**, ⊕◯◯◯ — pragmatique.
- **L'ASG manque la majorité des hypoglycémies nocturnes.** HYPOAGE (≥75 ans, insulino-traités) :
  65,2 % ont fait une hypoglycémie nocturne de niveau 2 ; Hypo-METRICS : ~75-78 % des épisodes
  asymptomatiques ou non rapportés. **⊕⊕⊕◯ modéré, constant.** → C'est la limite que le nœud devra
  énoncer, et elle borne ce que la voie capillaire peut prétendre.

### 2.6 Ce qui NE contredit pas l'existant — et c'est à noter

Le seuil de **0,5 U/kg/j** est décrit à peu près comme le red-team du 2026-07-27 l'avait établi : post-hoc
d'Umpierrez 2019, plateau de l'effet au-delà de 0,5, **aucun ECR n'ayant randomisé « plafonner » contre
« continuer à titrer »**, AACE le maintient. **Convergence avec
[`preuve-sur-basalisation.md`](../chantier-2026-07-27/preuve-sur-basalisation.md) : l'arbitrage rendu ne se
rouvre pas.**

⚠ **DEUX CORRECTIONS APPORTÉES PAR LE RED-TEAM (2026-07-29), et elles vont en sens inverse.**

1. **La taille d'Umpierrez 2019 rendue par OE est fausse.** OE annonce « n=3 014, 12 essais » ; B2 a
   vérifié en primaire : **N = 458, 3 essais**, verbatim. C'est le dossier du 2026-07-27 qui avait raison,
   et c'est OE qui se trompe — le sens de la correction compte, parce que le nombre d'OE rendait le
   post-hoc bien plus solide qu'il ne l'est.
2. **En revanche, ce même dossier de 2026-07-27 avait tort sur un autre point** : il conclut qu'*aucune
   source SFD ne porte ce seuil*. B1 et B3 l'ont trouvé **verbatim, SFD 2025 Avis n°19**. Cause tracée par
   B1 : le corpus local n'avait jamais été ouvert, le travail s'était fait sur un téléchargement web
   illisible. Le texte affiché par le nœud (« retiré par l'ADA, retenu par l'AACE ») **omet donc la société
   savante française**, dont la position est « avis spécialisé souhaitable ». À corriger — sans rouvrir
   l'arbitrage, qui portait sur le canal (déclencheur, pas exclusion) et qui tient.

---

## 3. Consigne permanente du référent (2026-07-29) — à appliquer à la conciliation

> *« Après la phase de conciliation, toute nouvelle donnée utilisée devra être consignée dans [la] base
> de données consolidée et ajoutée dans les argumentaires spécifiques et dans l'argumentaire exhaustif
> de façon pertinente. »*

Checklist opposable, à dérouler **après** la réconciliation A × OE × red-team B, et **jamais avant** :

| Destination | Quoi |
|---|---|
| `docs/decision/noeuds/E-insuline.md` §3 | la **grille par étude** — une ligne par essai retenu : PMID/DOI, design, population, résultat en **effet absolu + NNT + horizon**, **dur vs substitution**, GRADE. C'est la base consolidée. |
| `insuline.yaml` → `sources.references_primaires` | chaque essai réellement **cité** par une option, avec son `id` |
| `insuline.yaml` → `options[].references` | le lien option → sources. **Invariant I8** : une option en preuve `modere`/`eleve` doit déclarer au moins une référence |
| `insuline.yaml` → `avantages` / `inconvenients` / `effet_attendu` | les **argumentaires spécifiques** : le chiffre qui justifie l'option, à sa place |
| `insuline.argumentaire.md` | l'**argumentaire exhaustif** (niveau 3) : matrices de preuve par option, argumentation négative, reco officielle vs position critique, incertitudes, toutes les sources avec DOI |
| `insuline.yaml` → `incertitudes` | ce qui reste non tranché, **classé par nature** (`CONSTRUIRE-UN-MODULE.md` §5) |

⚠ Une donnée **n'entre nulle part** tant qu'elle n'a pas passé le red-team B. Et une entrée
`incertitudes` périmée est pire qu'absente.
