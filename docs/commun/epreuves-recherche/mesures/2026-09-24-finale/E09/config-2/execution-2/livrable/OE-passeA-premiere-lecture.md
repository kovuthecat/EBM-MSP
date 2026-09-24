# Première lecture — retour OE passe A, bloc OE-A2 (titration basale sur GAJ : monter et descendre)

## Provenance

- Date de lecture : 2026-09-24
- Lecteur : orchestrateur (session courante), première lecture avant transmission à l'Agent B — **pas** un
  rapport d'Agent A, pas une passe de contradiction.
- Source lue : `epreuve/entrees/OE-passeA-brut-2026-07-29.txt` (retour archivé tel quel par le référent),
  bloc correspondant au prompt **OE-A2** de `epreuve/entrees/PROMPTS-OE-passeA.md`.
- Aucune requête OpenEvidence posée pour ce travail. Aucune vérification PubMed / `identite.mjs` n'a été
  faite non plus : cette lecture reste au niveau du texte OE lui-même, c'est le travail de l'Agent B (et de
  la porte du registre) d'aller à la source primaire.
- Repérage du bloc OE-A2 dans le fichier brut : il n'existe **aucun séparateur explicite** entre les
  réponses aux questions OE-A1 à OE-A5 dans l'archive (pas de ligne « OE-A2 », pas de ligne `Modèle :`, pas
  de code de sortie). Le bloc a été identifié par son contenu (structure « essai par essai puis 3
  questions », correspondant au prompt OE-A2) : il commence après la liste de références de OE-A1 (« *This
  is a comprehensive, structured response organized by trial…* ») et se termine avant le début du bloc SMBG
  (OE-A3, « *PART A — NON-INSULIN-TREATED…* »). **Cette délimitation est une inférence de lecture, pas une
  donnée du fichier** — à confirmer avant tout usage qui dépendrait d'une frontière exacte.

## Table — règles de réduction de dose rapportées pour la basale (déclencheur GAJ/SMPG · montant · référence)

Colonne « Statut » = ce que la lecture permet de dire sur la fiabilité de la ligne, **avant** vérification
source primaire.

| Essai | Déclencheur de la réduction (tel que rapporté par OE) | Montant de la réduction | Référence(s) dans le retour | Statut |
|---|---|---|---|---|
| **Treat-to-Target** (Riddle 2003) | Une glycémie plasmatique isolée (« *any plasma glucose was* [valeur **perdue**] ») — décrit dans le paragraphe consacré à l'essai comme une règle de **maintien de dose** (« *no dose increase* »), pas explicitement comme une règle de **réduction** | **Absent du paragraphe consacré à l'essai.** La table de synthèse d'OE (« Question 1 ») affirme ailleurs « Fixed units (−2 to −4 U) », un chiffre qui n'apparaît nulle part dans le texte dédié à l'essai | Texte : [5][4] ; synthèse : [1],[2] | ⚠️ **Contradiction interne** entre le paragraphe par essai (règle de maintien, pas de montant) et la table de synthèse (montant chiffré) + seuil perdu |
| **AT.LANTUS — bras Fritsche** (médecin) | Ligne de tableau juste sous « 90–110 mg/dL : pas de changement » ; le seuil proprement dit (vraisemblablement < 90 mg/dL) n'est pas écrit, seule la case « −2 U » apparaît en gras sans son intitulé de ligne | **−2 U** | Texte : [1] (= revue Khunti 2020, secondaire) ; synthèse : [3] (= Barnett 2007, revue narrative de dosage — **pas** la publication princeps AT.LANTUS) | ⚠️ Seuil non écrit + référence de synthèse pointant vers une source secondaire sans rapport apparent avec l'essai |
| **AT.LANTUS — bras Davies** (patient) | Phrase coupée : « *increases by +2 U every 3 days if mean FBG >110 mg/dL, in the absence of BG* [texte **tronqué**] » — la règle de réduction elle-même (seuil bas + montant) n'apparaît pas dans ce paragraphe | Repris à **−2 U** seulement dans la table de synthèse, **introuvable tel quel** dans le paragraphe consacré au bras Davies | Synthèse : [3] (même renvoi erroné que ci-dessus) | ⚠️ Montant non confirmé au niveau du paragraphe par essai + référence de synthèse suspecte |
| **INSIGHT** (Gerstein 2006) | — | — | [4] (texte) / [4] (synthèse) | OE affirme explicitement, aux deux endroits, qu'**aucune règle de réduction chiffrée n'est publiée** dans l'article princeps. Cohérent entre les deux passages → à traiter comme une vraie lacune de la littérature, pas comme un artefact de copie |
| **LANMET** (Yki-Järvinen 2006) | — | — | [5] (texte et synthèse) | Idem INSIGHT : lacune assumée et cohérente, pas un signal de corruption |
| **PREDICTIVE 303** (Meneghini 2007) | « Mean aFPG » — seuil bas non écrit (la cible étant 80–110 mg/dL, le seuil de réduction est vraisemblablement < 80 mg/dL, **à confirmer**, pas affirmé par OE) | **−3 U** | [6] (texte et synthèse — cohérent ici) | ⚠️ Seuil perdu ; montant et référence cohérents entre les deux passages |
| **ATLAS** (Garg 2015) | BG ≤ 56 mg/dL (≤ 3,1 mmol/L) — seuil intact (symbole « ≤ », non tronqué) | Laissée à la **discrétion du médecin**, pas de montant fixe | Texte : [1] (Khunti 2020, secondaire) et citation propre de l'essai = [12] plus haut dans le retour ; synthèse : [7] (= INSIGHT/Gerstein, **sans rapport** avec ATLAS) | ⚠️ Règle elle-même complète et cohérente, mais la table de synthèse cite une référence qui ne correspond pas à l'essai |
| **EDITION 3** (Bolli 2015) | Phrase coupée net : « *+3 U if SMPG >5.6 and* [texte **tronqué**] » — le volet réduction n'apparaît pas du tout | **Non rapporté** | Texte : [13] ; synthèse : [8] (incohérent avec [13]) | ⚠️ Règle de réduction absente du texte transmis |
| **Take Control** (Russell-Jones 2019) | Seuil perdu : « *Down-titration: −3 U if SMPG* [valeur **perdue**] » | **−3 U** | Texte : [14] ; synthèse : [7] (= INSIGHT, sans rapport) | ⚠️ Seuil perdu + référence de synthèse suspecte |
| **SENIOR** (Ritzel 2018, sujet âgé) | Seuil perdu : « *Down-titration: −3 U if SMPG* [valeur **perdue**] » | **−3 U** | Texte : [1]/[15] ; synthèse : [7] (= INSIGHT, sans rapport) | ⚠️ Seuil perdu + référence de synthèse suspecte — **pénalisant** car c'est le seul essai dédié au sujet âgé |
| **Home et al. 2015** (algorithme sensible à l'hypoglycémie) | Seuil perdu : « *−2 U if any measurement* [valeur **perdue**] » | **−2 U** | [16] | ⚠️ Seuil perdu |
| *Pour mémoire, hors essai* : AACE 2022–2026 (recommandation, pas un essai) | Seuil perdu : « *reduce by 10–20% for FBG* [valeur **perdue**] » | **−10 à −20 %** (approche en pourcentage, pas en unités fixes) | [17][18] | À ne pas mélanger aux lignes d'essais ci-dessus : c'est un avis d'experts, pas une règle de protocole d'essai |

## Ce qui empêche de s'y fier, avant transmission à l'Agent B

1. **Corruption systématique des seuils numériques.** Dans la quasi-totalité des lignes ci-dessus, la
   valeur du seuil déclenchant la réduction a disparu de la copie au point exact où un symbole « < » aurait
   dû apparaître (ex. Treat-to-Target, Davies/AT.LANTUS, PREDICTIVE 303, EDITION 3, Take Control, SENIOR,
   Home 2015, AACE). Les seuils qui survivent utilisent tous « ≤ » plutôt que « < » (ATLAS). C'est
   exactement le mode de défaillance documenté par le circuit lui-même
   (`.claude/skills/recherche-source-primaire/references/openevidence.md` § 7 : « *la copie markdown peut
   perdre ou déformer des symboles (inégalités, signes, exposants)* »). Conséquence pratique : la colonne
   « déclencheur » de cette table n'est fiable que pour ATLAS ; partout ailleurs le chiffre manquant doit
   être repris sur la conversation OE d'origine (si le référent peut la rouvrir) ou directement sur la
   source primaire — jamais reconstitué par déduction pour entrer dans un nœud.
2. **La table de synthèse d'OE (« Question 1 ») cite des références qui ne correspondent pas aux essais
   qu'elle prétend documenter.** ATLAS, Take Control et SENIOR y sont chacun rattachés à la référence [7],
   qui est en réalité la citation Gerstein/INSIGHT — sans rapport avec ces trois essais, et différente de la
   citation propre que chacun reçoit plus haut dans le même retour (ATLAS = [12], Take Control = [14],
   SENIOR = [15]). AT.LANTUS (les deux bras) y est rattaché à [3], qui pointe vers une revue narrative de
   dosage (Barnett 2007) et non vers la publication princeps de l'essai. Un tableau censé consolider les
   essais individuels introduit donc ses propres erreurs de renvoi — il ne peut pas servir de raccourci à
   l'Agent B, qui doit repartir des paragraphes par essai (eux-mêmes incomplets, cf. point 1).
3. **Contradiction interne sur Treat-to-Target.** Le paragraphe consacré à l'essai ne décrit qu'une règle
   de *maintien* de dose (pas d'augmentation si une glycémie est basse), sans chiffrer de réduction. La
   table de synthèse affirme pourtant un montant précis (« −2 à −4 U ») pour ce même essai, sans qu'aucun
   passage du retour ne le justifie. À traiter comme une affirmation non étayée par le retour lui-même, pas
   seulement comme un chiffre à vérifier.
4. **Aucune fiche de retour exploitable dans l'archive.** Le fichier ne contient ni ligne `Modèle :`, ni
   code de sortie, ni séparateur entre les cinq réponses OE-A1 à OE-A5 (`.claude/skills/
   recherche-source-primaire/references/openevidence.md` § 5 demande cette fiche en tête de chaque retour
   archivé). Il est donc impossible, à partir de ce seul fichier, de savoir si le modèle observé correspond
   au modèle demandé, si le retour est `complet`, `incomplet` ou `précision demandée`, ni où s'arrête
   exactement le bloc OE-A2 (cf. Provenance ci-dessus — la frontière a dû être devinée). Point à faire
   confirmer par le référent avant toute synthèse qui s'appuierait sur un statut de complétude.
5. **Recherche guidée, pas une découverte indépendante.** Le prompt OE-A2 imposait déjà la liste d'essais à
   couvrir (Treat-to-Target, AT.LANTUS, INSIGHT, LANMET, PREDICTIVE 303, ATLAS). Le fait que le retour les
   couvre tous ne mesure donc pas la capacité d'OE à trouver la littérature pertinente. Les seuls essais
   apportés « spontanément » par OE (EDITION 3, Take Control, SENIOR, Home 2015, méta-analyse en réseau
   Boonpattharatthiti 2025) sont précisément ceux dont la règle de réduction est le plus souvent tronquée ou
   absente (cf. table) — c'est sur cette partie non guidée du retour que la vigilance de l'Agent B doit
   porter en priorité.
6. **Précédent du dépôt sur les PMID.** Le prompt OE-A2 rappelle lui-même (motif écrit en tête de
   `PROMPTS-OE-passeA.md`) que sur les nœuds H et E, la totalité des PMID rendus par OE se sont révélés
   faux. Chaque PMID cité dans ce bloc (Riddle, AT.LANTUS/Davies-Fritsche, INSIGHT, LANMET, PREDICTIVE 303,
   ATLAS, EDITION 3, Take Control, SENIOR, Home 2015…) reste donc **non vérifié** tant qu'il n'est pas passé
   par `identite.mjs` — cette table ne doit pas être lue comme une liste de références utilisables telles
   quelles.
7. **Écart au prompt, pour mémoire.** Le prompt OE-A2 demande explicitement « PMID/DOI » alors que la règle
   du circuit (`openevidence.md` § 6) interdit de demander le PMID à OE (justement à cause du point 6). Ce
   n'est pas un défaut de la présente lecture — le prompt est antérieur à ce chantier — mais cela explique
   en partie pourquoi autant de PMID bruts, non recoupés, circulent dans ce retour.
8. **Absence de violation constatée sur le périmètre des sources exclues.** Aucune des 25 références de ce
   bloc ne renvoie à HAS, SFD, CMG, Prescrire, Médicalement Geek/DragiWebdo, Minerva ou ebmfrance — la
   clause d'exclusion du prompt paraît avoir été respectée pour ce bloc. Point positif, à ne pas
   sur-interpréter : il ne dit rien de la fiabilité des références qui sont bien citées.

## Transmission à l'Agent B

- Ce document **n'est pas** une passe de contradiction : aucun retour à la source primaire n'a été fait ici.
- Avant d'ouvrir la table ci-dessus pour vérification essai par essai, l'Agent B doit être informé que :
  - la colonne « déclencheur » est **structurellement incomplète** pour toutes les lignes sauf ATLAS
    (point 1) — inutile de chercher une faute de lecture de notre part, c'est une perte de la copie elle-même ;
  - la table de synthèse d'OE (« Question 1 ») ne doit **pas** servir de raccourci de vérification : ses
    renvois de référence sont eux-mêmes fautifs pour au moins ATLAS, Take Control, SENIOR et AT.LANTUS
    (point 2) ;
  - le statut de complétude du retour (complet / incomplet / précision demandée) et le modèle observé sont
    **inconnus** faute de fiche de retour dans l'archive (point 4) — à faire confirmer par le référent en
    parallèle plutôt que supposés ;
  - la priorité de vérification devrait aller aux essais non imposés par le prompt (EDITION 3, Take
    Control, SENIOR, Home 2015) plutôt qu'aux six essais nommés dans la question, dont la « couverture »
    par OE ne prouve rien en soi (point 5).
