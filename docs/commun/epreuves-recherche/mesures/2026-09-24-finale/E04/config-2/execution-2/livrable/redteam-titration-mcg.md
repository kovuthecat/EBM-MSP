# Red-team (Agent B) — retour OpenEvidence « titration de la basale pilotée par MCG », DT2

Nœud : `insuline`. Vérification bornée (checkpoint), pas le circuit complet `recherche-preuve-triangulee` :
pas de cadrage, pas d'Agent A, pas de registre des affirmations. Point de contrôle demandé par le
référent : pour chaque appel de référence numéroté du corps du retour OE ([1] à [16]), vérifier que la
référence existe telle que citée **et** qu'elle soutient l'affirmation à laquelle elle est rattachée.

## Provenance

- Date : 2026-09-24
- Orchestrateur : Claude (Sonnet 5), session Claude Code
- Entrées : `epreuve/entrees/prompt-OE-titration-mcg.md` (prompt posé le 2026-08-11) ;
  `epreuve/entrees/OE-titration-mcg-brut-2026-08-11.txt` (retour brut collé par le référent)
- Agents lancés : 4 × `general-purpose` (rôle Agent B, mode Décision), en parallèle, chacun sur un
  quart des références ([1]-[4], [5]-[8], [9]-[12], [13]-[16]) — modèle hérité de la session,
  consignes datées du 2026-09-24 (pas de fichier d'agent dédié dans cette configuration)
- OpenEvidence : **non interrogé** — interdit par la consigne du référent pour ce travail ; aucun outil
  OE n'est de toute façon exposé dans cette session
- Porte du registre : sans objet (pas de registre des affirmations dans cette tâche bornée)

**Limite méthodologique transversale, à signaler au référent** : dans les quatre sous-agents, aucun
outil Bash/shell n'était exposé (impossible d'exécuter `identite.mjs`) et les outils MCP PubMed,
bien que leurs schémas aient pu être chargés, ont vu **chacun de leurs appels refusés** par la
politique de permission de la session (« don't ask mode »). Les vérifications d'identité et de lecture
ci-dessous reposent donc sur les voies ouvertes de secours (`acces-identite.md` §5) : API REST Europe
PMC (recoupement DOI/PMID/PMCID, résumé, parfois texte intégral), Crossref (rétractation/correction),
Unpaywall, PMC via lecture web, pages éditeur, et pour deux références des sources indépendantes
(réseaux sociaux d'auteur, communiqués institutionnels, presse spécialisée) pour corroborer l'existence
d'articles très récents. C'est une voie fonctionnellement acceptable (§5) mais moins systématique que
`identite.mjs` ; à refaire avec l'outillage complet si un chiffre issu de ce dossier doit peser
directement sur un nœud.

---

## Verdict par référence

| Réf | Identité (existence) | Soutien de l'affirmation | Sévérité du pire problème | Origine |
|---|---|---|---|---|
| [1] DIATEC (Olsen 2025, doi:10.2337/dc24-2222) | OK | PARTIEL — « algorithmes identiques, seule la source différait » est trop fort (règle de déclenchement différente) ; le reste (population hospitalière, fourchette cible, pas de dose) confirmé | MOYENNE | OE seule |
| [2] Martens et al. rétrospective (PMID 40683222) | OK | OK, intégralement | — | — |
| [3] MOBILE (Martens 2021 JAMA, PMID 34077499) | OK | OK sur les chiffres (TIR, HbA1c, dose) ; PARTIEL sur la présentation « verbatim » des citations (traduction, clause de sécurité omise) | BASSE-MOYENNE | OE seule |
| [4] FreeDM2 (Wilmot 2026, PMID 42035781) | OK | OK sur les phases 1/2 ; NON VÉRIFIABLE sur l'attribution « sans différence de dose, bénéfice mode de vie » (paywall) | MOYENNE | non vérifiable |
| [5] Jancev méta-analyse (PMID 38363342) | OK | OK, intégralement (4 chiffres + IC exacts) | — | — |
| [6] Aroda & Eckel 2022 (doi:10.1111/dom.14830) | OK | PARTIEL — l'article ne *définit* pas les seuils TIR/TBR/TAR (sujet : risque CV), mais les *reproduit* verbatim dans une section annexe | BASSE | OE seule |
| [7] Anagnostopoulou 2026 (doi:10.1111/dom.70288) | OK | OK, seuils confirmés en texte intégral | — | — |
| [8] Goshrani 2025 (doi:10.1111/dom.16279) | OK | OK, seuils confirmés ; **doublon** avec une légende de figure non numérotée plus haut dans le document | BASSE (anomalie de forme) | — |
| [9] ADA Standards of Care 2026, ch. 6 (doi:10.2337/dc26-S006) | OK | OK, y compris les deux citations « verbatim » reconstituées malgré la corruption de symboles à la copie | — | — |
| [10] AACE 2026, Algorithme 8 (doi:10.1016/j.eprac.2026.01.006) | OK | NON VÉRIFIABLE — chiffres précis (+2 U/palier, +20 %/+10 %/+1 U, seuils TBR) non atteints en texte intégral malgré 3 voies essayées ; un corrigendum existe et n'est pas signalé par OE | MOYENNE | non vérifiable |
| [11] Bolli et al. 2025 (doi:10.2337/dci24-0104) | OK | OK sur le chiffre (≤2 U/semaine, cible 100-120 mg/dL, confirmé Table 3) ; PROBLÈME sur l'étiquette « ADA/Bolli » (revue narrative d'auteurs indépendants, pas une position officielle ADA) | MOYENNE | OE seule |
| [12] Dower et al. 2026, JAMA Intern Med (doi:10.1001/jamainternmed.2026.2772) | OK, avec anomalie (champ « pages » = identifiant interne JAMA Network, pas un PMID ni une pagination réelle) | NON VÉRIFIABLE (paywall sur le passage précis de Q5) | BASSE (identité) / non vérifiable (soutien) | OE seule (pagination) |
| [13] ADA Standards of Care 2026, ch. 9 (doi:10.2337/dc26-S009) | OK | PARTIEL — 3 des 4 signaux de sur-basalisation confirmés dans ce chapitre ; le terme « BeAM value » accolé à [13] n'y figure pas (le chapitre dit « bedtime-to-morning glucose differential ») | BASSE | OE seule |
| [14] Peters et al. 2019 (doi:10.1111/dom.13729) | OK | OK — résultat direct de l'étude | — | — |
| [15] Irace et al. 2025 (doi:10.1002/dmrr.70059) | OK | OK sur le contenu rapporté (ADA/EASD **et** NICE tous deux fidèlement résumés) ; mais c'est un **relais tertiaire unique** cité pour deux documents officiels distincts, alors que le prompt demandait « le paragraphe exact » des recommandations elles-mêmes | MOYENNE | OE seule |
| [16] Battelino et al. 2023, *Lancet D&E* (doi:10.1016/S2213-8587(22)00319-9) | OK (en tant que document 2023) | PROBLÈME — substitution non signalée : le prompt nommait explicitement PMID 31177185 (Battelino 2019, *Diabetes Care*, cibles d'interprétation en pratique clinique) ; [16] est un **autre** document Battelino (2023, périmètre : métriques pour essais cliniques). PMID 31177185 lui-même n'est jamais fourni comme référence numérotée | **HAUTE** | OE seule |

**Aucune référence fabriquée ou introuvable parmi [1]-[16]** : les 16 DOI résolvent vers l'article
annoncé (titre, auteurs, revue, année, volume/pages concordants), et chaque PMID donné explicitement
dans le corps du texte ([2], [3], [4], [5]) correspond bien à la référence à laquelle il est
rattaché. C'est le résultat le plus important de ce contrôle : le risque principal de ce dossier n'est
pas l'invention de sources, mais l'**attribution** (ce qu'une source réelle est réputée dire).

---

## Findings, classés par sévérité puis par origine

### HAUTE

**F1 — [16] Substitution non signalée du consensus ATTD/ICTR cité par le référent.**
Le prompt (Q4, Q6) nomme explicitement « le consensus ATTD, PMID 31177185 » comme l'autorité de
référence pour les seuils d'interprétation MCG. Le retour OE écrit « ATTD/ICTR (PMID 31177185 et
actualisations) » puis appuie l'affirmation sur les références [6][7][16][8] — mais aucune de ces
quatre n'est PMID 31177185 lui-même, et [16] (Battelino 2023, *Lancet Diabetes & Endocrinology*) est un
document au périmètre différent (métriques pour essais cliniques, pas cibles de pratique clinique
générale). Le document explicitement demandé par le référent n'apparaît donc jamais dans la liste
numérotée finale, sans que ce remplacement soit signalé.
- Localisation : Q6, paragraphe ATTD/ICTR ; liste de références, entrée [16]
- Origine : OE seule

### MOYENNE

**F2 — [1] DIATEC : « algorithmes identiques, seule la source différait » est trop fort.**
Le protocole publié de l'essai (lu en texte intégral, PMC) montre que la règle de déclenchement
diffère aussi : le bras glycémie capillaire décide sur une valeur ponctuelle, le bras MCG ajoute un
seuil de proportion de mesures dans la bande cible avant d'agir. Cette nuance affaiblit aussi la
conclusion de Q2 (« pas piloté par TIR/AGP ») : la règle du bras MCG s'apparente en partie à un
pilotage de type « temps dans la plage ».
- Localisation : Q1, 2ᵉ paragraphe ; Q2, puce DIATEC
- Origine : OE seule

**F3 — [4] FreeDM2 : attribution non vérifiée sur la source primaire.**
« Les auteurs soulignent explicitement » l'absence de différence de dose d'insuline en phase 1 et
l'attribution du bénéfice au mode de vie : cohérent avec un communiqué de presse relayant les propos du
chercheur principal, mais non confirmé dans l'article lui-même (texte intégral bloqué par paywall sur
les deux voies éditeur essayées).
- Localisation : Q3, puce FreeDM2
- Origine : non vérifiable (accès bloqué, résultat honnête — pas imputable à OE sur les seules preuves
  disponibles)

**F4 — [10] AACE 2026, Algorithme 8 : chiffres précis non vérifiés.**
Les chiffres les plus spécifiques du dossier (+2 U par palier ; +20 %/+10 %/+1 U selon la glycémie à
jeun ; réduction 10-20 % si <70 ; seuils TBR<70<4 % et TBR<54<1 % pour l'Algorithme 8) n'ont pu être
confirmés dans aucun texte primaire malgré 3 voies essayées dans l'ordre prescrit (page éditeur,
PDF officiel AACE, résumés secondaires). Un corrigendum de cet article existe (PMID 42283653,
*Endocrine Practice* 2026;32(8):1332) et n'est pas mentionné par OE ; son contenu n'a pas pu être
identifié pour savoir s'il touche ces chiffres.
- Localisation : Q4, puce AACE 2026 ; Q6, puce AACE 2026
- Origine : non vérifiable

**F5 — [11] Étiquette « ADA/Bolli 2025 » trompeuse.**
Le chiffre (≤2 U de variation par semaine, cible glycémie à jeun 100-120 mg/dL) est exact et confirmé
en texte intégral. Mais l'article est une revue narrative signée par des auteurs académiques
indépendants (Bolli, Home, Porcellati et al.), publiée dans *Diabetes Care* — une revue éditée par
l'ADA, non un document de position officiel de l'ADA. L'étiquette « ADA/Bolli » laisse croire à tort à
une recommandation de société savante, alors que Q6 demandait précisément de distinguer
recommandations officielles et avis d'experts.
- Localisation : Q4, puce ADA/Bolli 2025
- Origine : OE seule

**F6 — [15] Source tertiaire unique pour deux organismes distincts.**
Le contenu rapporté (ADA/EASD *et* NICE) est fidèle à l'article Irace et al. 2025, vérifié en texte
intégral. Mais c'est une synthèse d'un groupe d'experts italien, citée comme unique source pour
caractériser ce que disent deux documents officiels différents, alors que Q6 demandait « le paragraphe
exact et son grade » des recommandations elles-mêmes plutôt qu'un relais.
- Localisation : Q6, puces « Consensus ADA/EASD » et « NICE »
- Origine : OE seule

### BASSE

**F7 — [3] MOBILE : citations présentées comme « verbatim » sans l'être totalement.**
Le rendu français est fidèle sur le fond, mais présenté entre guillemets comme une citation verbatim
d'un article en anglais (implicite : traduction), et la seconde citation omet la clause d'exception
(« unless deemed imperative for safety by the study center investigator ») qui nuance « la titration
restait à la discrétion du clinicien de soins primaires ».
- Localisation : Q3, puce MOBILE
- Origine : OE seule

**F8 — [6] Attribution thématiquement à l'écart.**
L'article (risque cardiovasculaire) reproduit bien les seuils cités, mais ne les définit pas ; il
existe probablement une source plus directement dédiée aux cibles MCG que ce choix de citation.
- Localisation : Q4/Q6, cluster [6][7][8][9] puis [6][7][16][8]
- Origine : OE seule

**F9 — [8] Doublon de citation.**
Le même article (Goshrani et al. 2025) apparaît une fois comme légende de figure non numérotée juste
avant la liste de références, une fois comme référence numérotée [8]. Contenu cohérent dans les deux
cas ; anomalie de forme, pas de fond.
- Localisation : bloc de légendes avant « References » ; référence [8]
- Origine : anomalie de mise en forme (sans objet pour la colonne origine)

**F10 — [12] Champ bibliographique corrompu.**
« ;:2851941 » est l'identifiant interne JAMA Network de l'article, pas une pagination ni un PMID (le
vrai PMID est 42545686 ; pagination définitive retrouvée : 2026;186(9):1166-1173). Le sous-titre
« : A Review » est aussi omis. N'affecte pas l'identification de l'article.
- Localisation : liste de références, entrée [12]
- Origine : OE seule (recopie d'identifiant)

**F11 — [13] « BeAM value » non sourcé dans le chapitre cité.**
Le chapitre 9 de l'ADA Standards of Care 2026 confirme 3 des 4 signaux de sur-basalisation cités, mais
n'emploie jamais le terme « BeAM value » (il écrit « bedtime-to-morning glucose differential ») ; ce
terme et le seuil « dose de basale > 0,5 U/kg/j » relèvent vraisemblablement de [10] (AACE), pas de
[13], sans que la phrase ne distingue les deux sources.
- Localisation : Q5, puce sur-basalisation
- Origine : OE seule

**F12 — Anomalie de numérotation dans le corps de Q2.**
La phrase sur DIATEC contient l'insertion « [19 dans la source] » en son milieu ; la référence 19 de
la liste finale (Khunti et al. 2020, sur la période initiale de titration de basale) n'a aucun rapport
avec le point discuté (pas de dose du protocole DIATEC). Artefact de formatage ou confusion de
numérotation à signaler tel quel au référent, indépendamment du fond (correct par ailleurs).
- Localisation : Q2, puce DIATEC
- Origine : anomalie de mise en forme

---

## Décompte

**Par sévérité** : HAUTE — 1 (F1) · MOYENNE — 5 (F2-F6) · BASSE — 6 (F7-F12)

**Par origine** : OE seule — 9 (F1, F2, F5, F6, F7, F8, F10, F11, F12) · non vérifiable — 2 (F3, F4) ·
anomalie de mise en forme (hors classement origine) — 1 (F9)

Aucun finding d'origine « A et OE », « A seule » ou « source elle-même » : cette tâche bornée ne
comporte pas de rapport d'Agent A à comparer, et aucune coquille dans le document source lui-même
(erreur de l'article original) n'a été identifiée — les 16 sources, quand elles ont pu être lues,
disent bien ce qu'elles disent ; c'est l'usage qu'en fait le corps du texte OE qui, dans 8 cas sur 16,
appelle une nuance.

---

## Confirmations obtenues

- **[2] Martens et al., analyse rétrospective (PMID 40683222)** — identité et soutien intégralement
  confirmés en résumé (Europe PMC) : 7354 paires, 68 patients, les trois algorithmes nommés (INSIGHT
  canadien, Treat2Target, AT.LANTUS), erreurs de dose −10 % à +10 %, tous concordants au chiffre près.
- **[3] MOBILE** — chiffres confirmés en texte intégral (PMC8173473) : TIR +15 % (IC 95 % 8-23),
  HbA1c −0,4 % (IC 95 % −0,8 à −0,1) à 8 mois, absence de différence de dose totale d'insuline entre
  bras.
- **[4] FreeDM2** — identité fortement corroborée par des sources indépendantes du système
  bibliographique (annonce du premier auteur, communiqués institutionnels, presse spécialisée), malgré
  la parution très récente (avril 2026) ; les deux phases de l'essai (auto-titration puis clinicien)
  confirmées en résumé.
- **[5] Jancev, méta-analyse** — identité et les 4 résultats chiffrés (HbA1c, TIR, TAR, TBR + IC)
  confirmés exactement en résumé (Europe PMC), y compris une conversion d'unité correcte pour l'IC de
  l'HbA1c.
- **[7] Anagnostopoulou 2026** — identité et seuils TIR/TBR/TAR confirmés en texte intégral (PMC).
- **[9] ADA Standards of Care 2026, ch. 6** — identité confirmée ; les deux citations « verbatim » de
  Q6 retrouvées et reconstituées dans le texte intégral (PMC) malgré la perte de symboles (< > %) à la
  copie markdown, avec le sens correctement rapporté par OE.
- **[11] Bolli et al. 2025** — chiffre confirmé en texte intégral (Table 3 et corps du texte) : ≤2
  unités de variation par semaine, cible glycémie à jeun 100-120 mg/dL (le problème sur cette référence
  porte uniquement sur l'étiquette « ADA/Bolli », pas sur le chiffre — voir F5).
- **[14] Peters et al. 2019** — soutien confirmé en texte intégral (PMC6618272) : la comparaison « la
  variation glucidique nocturne prédit mieux la réponse à l'intensification prandiale que l'HbA1c » est
  un résultat direct de l'étude (P = 0,0006 vs P = 0,533), pas une extrapolation d'OE.

---

## Ce que ce contrôle ne couvre pas

- Les références [17] à [23] de la liste finale (citées uniquement en fin de document, jamais
  appelées par un numéro dans le corps des six sous-questions) sont hors du périmètre demandé
  ([1]-[16]) et n'ont pas été vérifiées.
- Le bloc de légendes de figures non numérotées, situé entre la conclusion synthétique et la liste
  « References » (Wallia & Molitch 2014, Khunti et al. 2020, Hramiak et al. 2022, Russell-Jones et al.
  2019, Franc et al. 2019, Hirsch et al. 2025), n'a pas été vérifié individuellement — seul son
  chevauchement avec [8] (Goshrani) a été noté (F9).
- Ce rapport ne se prononce pas sur la conclusion synthétique globale du retour OE (absence
  d'algorithme de titration validé sur métriques MCG) : c'est un contrôle référence par référence, pas
  une réévaluation de la synthèse clinique. Aucun des findings ci-dessus ne renverse cette conclusion
  d'ensemble ; F1, F4 et F6 en fragilisent cependant certains sous-appuis (Q4, Q6) et méritent d'être
  reportés si ce dossier progresse vers un nœud validé.
- Aucune requête OpenEvidence n'a été effectuée pour produire ce rapport, conformément à la consigne du
  référent.
