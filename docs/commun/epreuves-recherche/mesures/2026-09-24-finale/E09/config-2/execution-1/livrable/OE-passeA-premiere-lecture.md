# Première lecture — OE-A2 (titration de la basale sur GAJ : monter et descendre)

## Provenance

- Date de rédaction : 2026-09-24.
- Fait par : orchestrateur (session courante), aucune requête OpenEvidence effectuée pour ce travail.
- Entrées lues : `epreuve/entrees/PROMPTS-OE-passeA.md` (question posée) et
  `epreuve/entrees/OE-passeA-brut-2026-07-29.txt` (retour brut du référent, archivé tel quel).
- Périmètre : uniquement le bloc **OE-A2** du retour, et à l'intérieur de ce bloc uniquement sa
  **Question 1 « The down-titration rule »** — le mandat de cette lecture. Les questions 2
  (plafond/règle d'arrêt) et 3 (sujet âgé/fragile) du même bloc, ainsi que les blocs OE-A1/A3/A4/A5,
  n'ont pas été relus ici.
- Statut : **première lecture, non validée**. Ce document prépare la transmission à l'Agent B
  (contradiction) ; il ne consolide rien et ne doit pas alimenter `content/**`.

## Localisation du bloc dans le fichier brut

Le fichier brut concatène les réponses aux cinq questions à la suite, sans séparateur ni ligne
« Modèle : » repérable. Repères utilisés pour délimiter OE-A2 :

- Début : ligne ~203 (« *This is a comprehensive, structured response organized by trial, then
  addressing the three specific questions.* »), qui correspond au libellé de la question posée dans
  `PROMPTS-OE-passeA.md` (« self-titration algorithms based on capillary fasting plasma glucose »,
  « Three questions the algorithms are usually silent about »).
- Fin : ligne ~397/398, juste avant l'amorce du bloc suivant (« *this is a comprehensive, structured
  synthesis organized by population* », qui correspond à OE-A3 — autosurveillance).
- La table de synthèse demandée par la question se trouve ligne ~329-333, sous le titre
  « **Question 1: The down-titration rule** ».

**Point bloquant en soi** : aucune ligne « Modèle : » n'est présente nulle part dans le fichier brut,
pour aucun bloc. L'étape 3 du circuit (`openevidence.md` § 4) exige de comparer le modèle observé au
modèle demandé avant de qualifier un retour comme `complet`. Cette qualification n'a **pas** été
faite — elle manque en amont de cette lecture et devra être obtenue du référent avant toute décision
sur le statut du retour.

## Table des règles de réduction de dose (telles que rapportées par OE-A2)

Colonnes : essai · déclencheur de la réduction (tel qu'écrit dans le retour) · montant de la
réduction · référence numérotée telle qu'écrite dans le retour. Les cellules `[valeur absente du
texte]` signalent un endroit où la phrase ou le tableau source s'interrompt avant la valeur
numérique attendue — ce n'est pas une omission de ma part, c'est un trou du fichier brut lui-même
(voir § Ce qui empêche de s'y fier).

| Essai | Déclencheur de la réduction (texte brut) | Montant | Réf. (numéro dans le retour) |
|---|---|---|---|
| Treat-to-Target (Riddle 2003) | Table de synthèse (L.331) : « Any PG [valeur absente du texte] ». Description détaillée de l'essai (L.218) : « no dose increase was made if any plasma glucose was [valeur absente du texte] » — décrit une règle de **pause de la hausse**, pas explicitement une **baisse** de dose | Table de synthèse : « Fixed units (−2 à −4 U) ». Description détaillée : montant non donné (la phrase ne parle que de « no dose increase ») | [1], [2] dans la table de synthèse (Khunti 2020, Riddle 2003) |
| AT.LANTUS — bras Fritsche (physician-led) | Table de titration (L.230) : ligne « **−2 U** » sans intitulé de seuil visible — la ligne juste au-dessus est « 90–110 mg/dL (5,0–6,1) → No change », donc un seuil `< 90 mg/dL` est plausible **par déduction de la mise en forme**, non lu explicitement | −2 U | [1] dans la table (renvoi Khunti 2020) ; [3] dans la table de synthèse (Barnett 2007 — revue, pas la publication princeps AT.LANTUS) |
| AT.LANTUS — bras Davies (patient-led) | Texte (L.232) : « increases by +2 U every 3 days if mean FBG >110 mg/dL, in the absence of BG [valeur absente du texte] » — la clause de baisse est coupée avant tout seuil | [valeur absente du texte] | [6], [3] dans le texte ; [3] dans la table de synthèse |
| INSIGHT (Gerstein 2006) | Explicitement déclaré **non publié** dans le document source (« does not specify a formal down-titration step size ») | Explicitement déclaré **non grounded** | [4] dans la table de synthèse (mais le vrai article INSIGHT est référencé [7] dans la liste numérotée finale — incohérence, voir plus bas) |
| LANMET (Yki-Järvinen 2006) | Explicitement déclaré **non publié** dans le document source | Explicitement déclaré **non grounded** | [5] dans la table de synthèse (le vrai article LANMET est [9] dans la liste finale — incohérence) |
| PREDICTIVE 303 (Meneghini 2007) | Table de titration (L.272) : ligne à seuil non affiché (symétrique de « 80–110 mg/dL (4,4–6,1) → No change », donc `<80 mg/dL` plausible par déduction). Texte (L.274) : « reduce by 3 U if mean aFPG [valeur absente du texte] » | −3 U (amont confirmé par la table et par le texte) | [10] dans le texte ; [6] dans la table de synthèse (le vrai article est [10]/[11] dans la liste finale — incohérence) |
| ATLAS (Garg 2015) | Texte (L.286) : « if BG ≤56 mg/dL (≤3,1 mmol/L) » — **seule ligne complète et non coupée de toute la table** | « reduced at physician's discretion (no fixed unit decrement specified in the protocol) » | [1] dans le texte (renvoi à la figure de la revue Khunti 2020, **pas** à Garg 2015 lui-même) ; [7] dans la table de synthèse (le vrai article ATLAS est [12] dans la liste finale — incohérence) |
| EDITION 3 (Bolli 2015, Gla-300) | Texte (L.296) : « +3 U if SMPG >5,6 and [valeur absente du texte] » — la clause de baisse est absente, la phrase s'arrête sur la clause de hausse | [valeur absente du texte] | [13] dans le texte ; [8] dans la table de synthèse (le vrai article EDITION 3 est [13] dans la liste finale — incohérence) |
| TAKE CONTROL (Russell-Jones 2019, Gla-300) | Texte (L.303) : « −3 U if SMPG [valeur absente du texte] » | −3 U | [1], [14] dans le texte ; [7] dans la table de synthèse — **même numéro que ATLAS**, alors que le vrai article Take Control est [14] dans la liste finale |
| SENIOR (Ritzel 2018) | Texte (L.312) : « −3 U if SMPG [valeur absente du texte] » | −3 U | [1] dans le texte ; [7] dans la table de synthèse — **même numéro que ATLAS et Take Control**, alors que le vrai article SENIOR est [15] dans la liste finale |
| Home 2015 (algorithme hypo-sensible) | Texte (L.323) : « −2 U if any measurement [valeur absente du texte] » — palier supplémentaire annoncé (« if [coupé] ») mais son contenu est totalement absent | −2 U (premier palier seulement) | [16] dans le texte ; [9] dans la table de synthèse (le vrai article Home 2015 est [16] dans la liste finale — incohérence) |

## Ce qui empêche de s'y fier avant transmission à B

1. **Les seuils numériques de déclenchement sont massivement absents du texte, pas seulement
   « non trouvés dans l'essai ».** Sur 11 lignes du tableau, un seul essai (ATLAS) porte un seuil
   complet et lisible. Dans les dix autres cas, la phrase ou la cellule de tableau s'interrompt
   exactement à l'endroit où devrait figurer le chiffre (souvent juste après « if FBG », « if SMPG »,
   « if mean aFPG », « in the absence of BG »). Ce point d'interruption systématique, toujours au
   même endroit syntaxique, ressemble à une perte liée à un caractère `<` suivi d'un nombre
   (interprété comme un début de balise et supprimé à l'export) plutôt qu'à une absence réelle dans
   les essais — mais je n'ai aucun moyen de le confirmer sans rouvrir OE, ce qui n'est pas autorisé
   ici. **Chaque seuil manquant doit être re-établi par B sur la publication princeps, pas déduit du
   tableau adjacent.**
2. **Contradiction interne sur Treat-to-Target.** La table de synthèse (Question 1) affirme un
   montant chiffré (« Fixed units (−2 à −4 U) ») alors que la description détaillée de l'essai,
   quelques dizaines de lignes plus haut dans le même document, ne décrit qu'une règle de **pause**
   de la hausse (« no dose increase »), sans jamais mentionner de baisse effective ni son montant. Le
   retour se contredit donc lui-même sur l'existence d'une vraie règle de descente pour cet essai —
   point que la table seule ne laisse pas voir.
3. **Numérotation des références incohérente entre la table de synthèse et la liste numérotée
   finale du bloc.** La table « Question 1 » cite `[1]` à `[9]`, mais la liste de références
   numérotée en fin de bloc (25 entrées) attribue des articles différents à ces mêmes numéros — par
   exemple `[4]` désigne INSIGHT dans la table mais Frier 2019 (un article sur le *reporting* des
   hypoglycémies, sans rapport) dans la liste finale ; `[7]` est réutilisé trois fois dans la table
   (pour ATLAS, Take Control et SENIOR) alors que la liste finale attribue trois articles distincts
   à `[7]`, `[14]` et `[15]`. Aucun numéro de la table de synthèse ne peut donc être suivi tel quel
   jusqu'à sa source — il faut réapparier chaque ligne à son vrai article par le nom de l'essai, pas
   par le chiffre entre crochets.
4. **Attribution de section incertaine pour le premier essai du bloc (« Treat-to-Target »).** Le nom
   de l'essai n'apparaît nulle part en tête de sa propre description (L.210-219) : je l'identifie par
   déduction (756 patients, glargine vs NPH, cible ≤100 mg/dL — paramètres qui correspondent à Riddle
   2003) et par la table de synthèse qui le nomme explicitement. Un intitulé de section a
   vraisemblablement sauté au même endroit que les seuils numériques. À confirmer par B avant
   d'attribuer quoi que ce soit à cet essai avec certitude.
5. **Le retour ne porte pas la ligne « Modèle : »** attendue par `openevidence.md` § 4-5 pour
   qualifier un retour `complet` — voir § Localisation ci-dessus. Le statut du retour (complet /
   incomplet / précision demandée) n'a pas été établi.
6. **Deux essais sont honnêtement déclarés « non fondables »** (INSIGHT, LANMET) — ce n'est pas un
   défaut du retour mais un résultat exploitable tel quel : la publication princeps ne publie pas de
   règle de descente chiffrée. Ces deux lignes n'ont pas besoin d'être revérifiées pour leur seuil
   (il n'y en a pas à trouver), seulement pour la validité de la publication princeps citée.
7. **Deux règles sont sourcées à la revue de Khunti et al. 2020 (figure), pas à la publication
   princeps de l'essai** (ATLAS et, plus largement, la table de titration servant de repère visuel
   pour Treat-to-Target et AT.LANTUS). Une figure de revue secondaire n'est pas la source primaire —
   B doit remonter à Garg 2015 (ATLAS), Riddle 2003 et Davies 2005/2007 (AT.LANTUS) eux-mêmes.

## Ce qui peut être transmis tel quel à B

- La liste des **essais couverts** et leur identité bibliographique de base (auteur, année, revue),
  qui recoupe correctement la couverture demandée dans le prompt OE-A2 (Treat-to-Target, AT.LANTUS,
  INSIGHT, LANMET, PREDICTIVE 303, ATLAS — les deux trials additionnels EDITION 3, Take Control,
  SENIOR et Home 2015 ne faisaient pas partie de la liste demandée mais sont pertinents et à garder).
- Le **constat de rareté et d'hétérogénéité des règles de descente** («*Down-titration rules are
  heterogeneous and often incompletely reported*») : cohérent avec ce qu'on peut effectivement lire
  dans le détail (seuils très majoritairement absents ou non publiés), donc probablement une
  observation réelle plutôt qu'un artefact — mais B doit vérifier si l'hétérogénéité vient des essais
  eux-mêmes ou de la perte de texte décrite au point 1.
- Le repérage **INSIGHT / LANMET = pas de règle publiée** — seul résultat négatif propre du bloc, net
  et directement utilisable pour signaler une lacune de couverture au nœud.

## Recommandation avant l'étape 4

Ne transmettre à B ni la table de synthèse « Question 1 » ni les montants isolés (−2 U, −3 U, etc.)
comme des faits établis : transmettre plutôt, par essai, la question « quel est le seuil et le
montant exacts de la règle de descente dans la publication princeps ? », avec pour chaque essai le
numéro de référence bibliographique **réapparié à la main** (voir table ci-dessus) plutôt que le
numéro entre crochets du retour brut. Demander en priorité confirmation du statut du retour
(ligne « Modèle : » manquante) auprès du référent avant que B n'investisse du temps sur un retour
dont on ne sait pas encore s'il correspond au modèle demandé.
