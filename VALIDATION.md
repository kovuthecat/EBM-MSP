# VALIDATION.md — jugement humain en attente (N2 uniquement) — ebm-msp

> **Ce fichier ne contient que du N2** : jugement esthétique/UX/ton/clinique. Tout ce qu'un navigateur
> peut constater seul est du **N1** — vérifié par Claude, jamais consigné ici. Cf. `WORKFLOW.md` §6.
> Plafond : 120 lignes (hook). Légende : `[ ]` à valider · `[x]` OK · `[!]` à corriger.
> Un bloc par écran/thème courant, état actuel uniquement — un écran réécrit **remplace** ses
> anciens critères. Le détail de chaque point vit dans le `plans/P<n>/S<k>.md` qui l'a produit.

## Purge du 2026-08-03 (clôture de P12)

**La recette praticien naïf du 2026-08-02** (`docs/decision/validation/recette-praticien-naif-2026-08-02.md`)
a rendu un jugement d'usage sur la majorité des items P8/P9/P10/P11 qui attendaient ici. Résolus et
retirés : T-055, T-056, T-057, T-058 (confirmation en deux temps, compteur de session, coût du
garde-fou de ré-entrée, champs estompés) · T-075, T-076 (titration metformine, aperçu de dépli —
« le correctif d'ergonomie le plus précieux de cette passe ») · T-084, T-086 (molécules/doses,
aide « risque hypoglycémique » — « le meilleur correctif de contenu ») · T-107 a et b (la couleur se
lit comme une information ; **ne pas colorer « Refuse »**, décision rendue) · T-112 (légende : à
garder, mais comme *sommaire de l'écran*, pas comme légende) · T-105 (cible tactile 32 px — arbitré
« usage tactile très rare, pas la priorité », référent 2026-08-02) · T-118 (plafond 1600 px —
remplacé par **D47**, mesuré). **T-085** (descente d'insuline sans chiffre) est résolu **en négatif** :
HAS 2024 R.87 porte la règle dans les deux sens, la source existait — cf. P12/S4.

## Contenu clinique écrit par P12 — la relecture la plus importante

- [ ] **S6/T-126 — les 11 aperçus de déprescription.** Textes affichés sur chaque carte qui prescrit un
      changement de dose. Vérifier les chiffres, la provenance (RCP / recommandation / **avis
      d'experts**) et le registre. Deux méritent une attention particulière : insuline et sulfamide
      portent un **double registre** (chiffre en relais thérapeutique · « au jugement clinique, aucun
      rythme chiffré sourcé » hors relais) — la vignette N7 doit rester sans réponse chiffrée.
- [ ] **S6/T-127 — l'alerte préventive d'acidocétose euglycémique** (jeûne, apports insuffisants,
      chirurgie ≥ 3 j). Formulation juste ? Et **faut-il l'étendre au patient DÉJÀ sous iSGLT2 qui
      devient dénutri** ? Aujourd'hui elle ne se déclenche que si l'iSGLT2 est *proposé*. Formulation
      prête : alerte de nœud sur `traitements_en_cours contient iSGLT2 AND denutrition == true`.
- [ ] **S5/T-125 — les 17 motifs rédigés** (« Proposé parce que ») sur 4 nœuds. Justes cliniquement ?
- [ ] **S4/T-067 — la carte « Réduire la basale »** (−2 U ou −10 % au-delà de 40 U/j, réévaluation à
      3 jours). Dit-elle assez pour agir ? Sa cohabitation avec « Corriger l'hypoglycémie » chez un
      patient à double signal est-elle informative ou redondante ?
- [!] **S4 — l'arbitrage du 2026-07-30 reposait sur une prémisse fausse.** Vous aviez chiffré la
      descente « par symétrie, faute de donnée EBM » ; **HAS 2024 R.87 écrit la règle dans les deux
      sens** et SFD 2025 Avis 18 porte le palier de 10 %. Corrigé dans le contenu (`niveau_preuve`
      aligné sur `modere`). **Voulez-vous rouvrir l'arbitrage maintenant que la prémisse a changé ?**
- [ ] **S2/T-121 — cinq coupes d'intitulés vont au-delà d'une parenthèse** (« Optimiser l'agent mal
      toléré », « Désintensifier… », « Reconsidérer un agent protecteur hors indication », « Discuter
      la statine », « Statine indisponible »). Se lisent-elles toujours comme des gestes distincts ?

## Écran de décision — présentation

- [ ] **S3/D47 — le CTA flottant mobile apparaît maintenant sur les fenêtres de bureau jusqu'à
      1199 px.** Conséquence attendue du relèvement du seuil (il se déclenchait sous 960 px). Gênant
      sur une fenêtre non maximisée ?
- [!] **S2 × S5 croisé — la carte iSGLT2 a perdu sa raison d'être sur la face visible.** Elle portait
      « (protection cardio-rénale et/ou contrôle glycémique) » ; le titre est raccourci et le motif est
      derrière une pastille. Chez un coronarien elle affiche `Recommandée` `Preuve élevée` sans qu'on
      voie pourquoi. Trois pistes au backlog (laisser · mention courte dans le socle · rendre la
      parenthèse aux seules cartes non glycémiques).
- [ ] **S10/T-135 — « Ce que dit la preuve — 2 positions de lecture ».** Le compte porte sur les
      **entrées** de cadrage, pas sur les items qu'elles contiennent : l'entrée qui nomme kaliémie,
      hémoglobine, fonction hépatique… compte pour 1. Suffisant pour donner envie d'ouvrir, ou
      faut-il un titre court par entrée (proposition au backlog) ?
- [ ] **S10/T-136 — la carte unique dépliée** sur « Fixer la cible ». L'argument EBM est revenu sans
      clic ; le nœud tenait en 35 secondes — est-il toujours aussi rapide à lire ?
- [ ] **S8/T-133 — « IMC (kg/m²) 27,0 · calculé »** sous poids et taille. Le registre est-il assez
      visible pour servir de vérification (une faute de frappe sur la taille doit sauter aux yeux) ?
- [ ] **S9/T-134 — le mot « Indisponible »** et la mention « Recommandation rendue sans le critère
      X : vous avez indiqué ne pas l'avoir. » Le mot est-il le bon (« Je ne l'ai pas » ? « Inconnu »
      écarté car il entre en collision avec l'indéterminé interne) ? La mention est-elle assez visible
      sans être anxiogène ?

## Décisions en attente

- [ ] **T-120 — abandonner ?** L'implication « athérome établi ⇒ antécédent cardiovasculaire » ne peut
      pas s'encoder : `cible-glycemique.yaml` ne déclare pas `ASCVD_etablie`, donc une règle de
      pré-remplissage qui le lit ne s'évaluerait jamais. La sûreté est déjà acquise par S1/T-119.
      Recommandation : **abandonner** (les deux autres voies coûtent plus qu'un clic économisé).
- [ ] **S7/T-132 — faut-il finalement demander la statine en cours** (molécule + dose) ? Section
      renommée « Tolérance de la statine » (option a, arbitrée). L'ajouter permettrait à l'outil de
      dire « il y est déjà, ne touchez à rien » — au prix de deux champs et d'un cadrage à réécrire.

## Reste ouvert des plans antérieurs (non tranché par la recette du 02/08)

- [ ] **T-063** — « Remplacer le glinide » chez un patient sous répaglinide à DFG 28 (scénario jamais
      rejoué en recette).
- [ ] **T-064/T-065** — libellés « Baisse/Hausse continue de la glycémie nocturne » sur un AGP réel.
- [ ] **T-068** — une contre-indication levée est-elle assez visible pour rester vérifiable, et assez
      discrète pour ne plus alerter à tort ?
- [ ] **T-080 à T-083** — les blocs `cadrage` des six nœuds : justes et complets ? (La liste du nœud
      `prescription` est validée par l'usage : la recette N15 la dit « exactement celle de ce qui me
      fait hésiter ». Restent `insuline`, `statine`, `cible-glycemique` et les deux RHD.)
- [ ] **T-111 (b)** — la pastille ambre se lit « attention », pas « une dose manque » (verdict rendu
      par la recette). La correction proposée — une mention courte dans le socle — n'est pas faite.
