# VALIDATION.md — jugement humain en attente (N2 uniquement) — ebm-msp

> **Ce fichier ne contient que du N2** : jugement esthétique/UX/ton/clinique. Tout ce qu'un navigateur
> peut constater seul est du **N1** — vérifié par Claude, jamais consigné ici. Cf. `WORKFLOW.md` §6.
> Plafond : 120 lignes (hook). Légende : `[ ]` à valider · `[x]` OK · `[!]` à corriger.
> Un bloc par écran/thème courant, état actuel uniquement — un écran réécrit **remplace** ses
> anciens critères. Le détail de chaque point vit dans le `plans/P<n>/S<k>.md` qui l'a produit.
>
> **Archive du 2026-08-07** (purge de plafond, P14/S12) — 3 blocs déplacés, rien de supprimé :
> `docs/decision/validation/VALIDATION-archive-2026-08-07.md` (note de purge P12 · décisions en attente
> T-120/T-132 · reste ouvert des plans antérieurs T-063 à T-111).

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

## Plan P13 (2026-08-05) — arbitrages référent rendus le 04/08, N2 accumulés en mode vague

- [ ] **T-140 — le classement par sécurité (« Commencez par… ») est-il le bon défaut ?** Un critère qui
      débloque une seule option de sécurité passe désormais devant un critère qui en débloque huit
      (ex. DFG relégué derrière HbA1c/glucotoxicité/cétonémie). Voulu par le plan, réversible.
      **Non tranché aussi** : la phrase enrichie (« … il débloque une mesure de sécurité ») n'a pas été
      écrite — deux choix de conception non résolus par le plan (quelle branche l'annoncer, comment
      traiter plusieurs critères sécurité simultanés).
- [ ] **T-143 — faut-il signaler qu'une saisie masquée a été restaurée** après une bascule d'intention
      (A→B→A) ? Livré **silencieux** (aucune mention, cohérent avec « rien n'a été perdu ») — alternative
      « · restauré après bascule », jamais tranchée.
- [ ] **T-147 — `risque_hypoglycemie_schema` est `partage: true` entre `prescription` et `insuline` alors
      qu'il cumule deux lectures irréductibles selon le nœud qui le pose** (investigation P9/S7). Signalé,
      non retiré (hors mandat de la tâche) — à arbitrer : retirer le partage, ou assumer la valeur reprise.
      **Résumé compact « N drapeaux : non »** (T-148) retenu par défaut, jamais soumis à comparaison avec
      nommer chaque drapeau.
- [ ] **T-153 — l'intitulé créé pour CK > 50 N** : « Arrêter la statine — suspicion de rhabdomyolyse, avis
      spécialisé urgent ». Seul texte clinique réellement écrit par S7 (T-154, l'alerte rétinopathie,
      s'est arrêtée faute de source — cf. `TASKS.md`).
- [ ] **T-156 — l'auto-avance après un choix segmenté unique est-elle agréable ou brusque ?** Jugement
      d'usage réservé à une consultation réelle.
- [ ] **T-159 — le panneau du compteur de session affiche les NOMS des critères mémorisés (jamais leurs
      valeurs) et leur origine (saisi/repris).** Compatible avec l'invariant « zéro donnée patient » ?
      Position par défaut retenue (un nom de critère n'est pas une donnée patient) ; si la réponse est
      négative, revenir à un compteur muet est un retrait simple (`Header.tsx`).

## Passe de rédaction des 4 niveaux (2026-08-05) — relecture clinique du texte réécrit

- [ ] **Les textes affichés des 6 nœuds ont été réécrits** (preuves, avantages/inconvénients, posologie,
      argumentaire, exhaustif). Rien de moteur n'a bougé, mais **ce que lit le praticien a changé partout** :
      à relire à l'écran, nœud par nœud.
- [ ] **13 arbitrages en attente**, dont deux points de fond qui ne relèvent pas de la rédaction : garde-fou
      d'hypoglycémie absent sans capteur (`insuline`), pas de conduite d'urgence pour des CK très élevées
      avant initiation (`statine`). Détail : `docs/decision/validation/passe-redaction-2026-08-05.md`.

## Plan P14 (2026-08-06/07) — la leçon consignée : R13/R14/R15, procédé P1/P5/P6, D52 → D58

> Points ouverts par **S12** (clôture documentaire). Les points N2 des sessions de **contenu** de P14
> (S4 à S8, S17-arbitrages, S18, S19) vivent dans leurs `plans/P14/S*.md` respectifs. **Consolidation
> (S13) partielle** — 4 des 6 YAML de contenu restent non commités (entrelacés avec un chantier hors
> P14) : `plans/P14/index.md` §Bilan.

- [ ] **S12/T-182 — les trois nouvelles règles de `GRAMMAIRE-NOEUD.md`.** **R13** (un signal se
      partitionne : une valeur, une carte) · **R14** (un nom de critère, une définition pour tout le
      domaine) · **R15** (un fait de sécurité appartient au domaine, pas au nœud). Chacune est adossée à
      un invariant vert et illustrée par le cas réel qui l'a produite. **Sont-elles énoncées au bon
      niveau de généralité** — assez précises pour être opposables à un futur domaine, assez larges pour
      ne pas décrire le seul DT2 ? R5, R8, R10 et R1 ont aussi été enrichies (liste close des lecteurs
      d'un critère · renvoi R8→R15 · couverture structurelle des replis · renvoi R1→D50).
- [ ] **S12/T-183 — les trois amendements du procédé (`CONSTRUIRE-UN-MODULE.md`).** **P1** ouvre le
      vocabulaire de sécurité du domaine avant le premier nœud (cliquet) · **P5** exige un *brouillon* de
      la table des conditions avant la 1ʳᵉ ligne de YAML · **P6** exige sa régénération mécanique et le
      **diff** contre ce brouillon, plus un 4ᵉ point de portée domaine. **Coût tenable ?** Le brouillon
      de P5 est le seul artefact vraiment nouveau à produire à la main ; le reste est mécanisé.
- [ ] **S12/T-184 — les sept décisions D52 → D58**, dont trois arbitrages cliniques rendus en
      conversation et jamais formalisés : **D52** (le ratio 0,5 U/kg redevient une alerte, sans capteur
      uniquement), **D56** (`cible-glycemique` adopte `ASCVD_etablie` strict — des patients perdent
      l'assouplissement à 8 % par ce seul critère), **D57** (`fragilite` alerte sur les 5 nœuds).
      **La formulation écrite dit-elle bien ce qui a été tranché oralement ?** Point le plus important.
      Vérifier aussi la limite que **D53** porte : « escalade = alternatives » **ne vaut pas pour les
      nœuds RHD** — la frontière est-elle assez nette pour qu'un futur lot ne l'applique pas à tort ?
