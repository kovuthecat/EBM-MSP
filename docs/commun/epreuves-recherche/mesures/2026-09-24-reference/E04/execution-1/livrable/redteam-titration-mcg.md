# Red-team (Agent B) — retour OpenEvidence titration basale pilotée par MCG (DT2), 2026-08-11

Nœud concerné : `insuline` — dossier « titration de l'insuline basale pilotée par la MCG, DT2 ».
Entrées : `epreuve/entrees/prompt-OE-titration-mcg.md` (prompt) et
`epreuve/entrees/OE-titration-mcg-brut-2026-08-11.txt` (retour brut, tel que collé).

## Écart au gabarit standard — à signaler

Le circuit `recherche-preuve-triangulee` prévoit normalement une attaque **conjointe** du rapport
Agent A et du retour OpenEvidence. Ici, aucun rapport Agent A n'a été fourni pour ce chantier : la
consigne demande explicitement de dérouler l'étape 2 **sur le seul retour OpenEvidence**. Ce rapport
est donc une red-team du retour OE isolé, pas une triangulation Agent A / OE. À compléter par une
collecte Agent A si le référent le juge nécessaire avant validation.

## Accès obtenus / accès bloqués (à lire avant les verdicts)

**Limite méthodologique importante.** Les deux agents de vérification ont vu leurs appels aux outils
MCP prescrits (`mcp__claude_ai_PubMed__*`, `mcp__claude_ai_Clinical_Trials__*`) **refusés par la
politique de permission de la session**, sur chaque tentative. Le repli s'est fait sur
`WebSearch`/`WebFetch` (PubMed web, PMC, Europe PMC, éditeurs). Résultat inégal :

- **Texte intégral réellement lu** (accès obtenu) : [5] Jancev (PMC10954850, en entier), [9] ADA
  ch.6 2026 (PMC12690178), [13] ADA ch.9 2026 (PMC12690185), [11] Bolli et al. (PMC12034903), [14]
  Peters et al. 2019 (PMC6618272), [15] Irace et al. (PMC12152825), [1] DIATEC — protocole publié
  séparément (résumé de recherche pointant vers PMC11071255), [3] MOBILE — via une analyse
  compagnon en texte intégral (PMC12587997) qui cite le protocole original.
- **Abstract ou résumé secondaire seulement** (éditeur bloqué : mur de cookies, 403, reCAPTCHA) :
  [2], [4], [6], [7], [10], [12], [16].
- **Accès bloqué sans alternative exploitable** : texte intégral AACE 2026 [10] (403/402 sur
  ScienceDirect, PDF de résumé exécutif illisible) ; texte intégral Battelino 2023 [16] et Goshrani
  2025 [8] (Lancet D&E et PMC tous deux bloqués).

Conséquence : plusieurs verdicts ci-dessous sont marqués **NON VÉRIFIABLE** plutôt que confirmés ou
infirmés — un résultat honnête compte tenu du blocage outil, pas un manquement des agents. Une
repasse avec les outils PubMed effectivement autorisés est recommandée avant toute validation
clinique finale.

---

## Verdict par référence (existence + soutien)

| Réf | Source citée par OE | Existence | Soutien de l'affirmation attachée |
|---|---|---|---|
| [1] | Olsen et al., DIATEC, Diabetes Care 2025;48(4):569-578, doi:10.2337/dc24-2222 | **OK** (titre/revue/DOI confirmés) | **SOUTENU** pour la caractérisation clinique (hospitalisé, algorithmes identiques sauf source de mesure, cible 5,6–7,8 mmol/L). **Anomalie grave** : le détail des pas de dose est attribué à la référence [19] (Khunti 2020), un article antérieur de 5 ans à l'essai — impossible matériellement. La vraie source du détail est le protocole DIATEC publié séparément (Olsen et al., BMC Endocrine Disorders 2024, PMID 38711112), absent de la liste 1-16. |
| [2] | Martens et al., analyse rétrospective nadir MCG, Diabetes & Metabolic Syndrome 2025;19(6):103266 | OK (DOI confirmé), PMID non confirmé | **SOUTENU** (7354 paires, 68 patients, définition du nadir, 3 algorithmes nommés, erreurs −10%/+10%) — via résumé secondaire, pas de texte intégral lu. |
| [3] | Martens et al., MOBILE, JAMA 2021;325(22):2262-2272, PMID 34077499 | **OK**, PMID confirmé exact | **SOUTENU** : absence de différence de dose totale entre bras (citée textuellement dans une analyse compagnon), effet TIR +15 % IC 8–23 (exact). **NON VÉRIFIABLE** : IC de l'HbA1c (−0,8 à −0,1). **Citation "verbatim" suspecte** : la formulation alléguée sur l'auto-titration patient / décisions du médecin de soins primaires n'a été retrouvée nulle part — à traiter comme non confirmée. |
| [4] | Wilmot et al., FreeDM2, Lancet D&E 2026;14(6):463-474 | OK dans l'ensemble, mais **ambiguïté non résolue** entre deux PMID voisins (42035781 vs 42303377), l'un pouvant être une notice secondaire plutôt que l'article princeps | **SOUTENU** : design en 2 phases, bénéfice phase 1 sans différence de dose (quasi verbatim). **PARTIELLEMENT SOUTENU** : mention d'un agoniste GIP dans la population — le protocole trouvé ne mentionne que SGLT2i et/ou agoniste GLP-1, pas explicitement GIP. |
| [5] | Jancev et al., méta-analyse, Diabetologia 2024;67(5):798-810, PMID 38363342 | **OK**, PMID confirmé exact | **SOUTENU intégralement**, texte intégral lu : 12 ECR/1248 patients, HbA1c −0,31 % (IC −0,43 à −0,19), TIR +6,36 % (IC 2,48–10,24), TAR −5,86 %, TBR −0,66 % — tous les chiffres correspondent au chiffre près. Meilleure référence du lot. |
| [6] | Aroda VR, Eckel RH, Diabetes Obes Metab 2022;24(12):2297-2308 | OK (existence confirmée) | **NON VÉRIFIABLE** (accès bloqué) — sujet réel = risque cardiovasculaire, pas les seuils MCG : peu plausible comme source des seuils TIR/TBR/TAR qui lui sont attribués. |
| [7] | Anagnostopoulou et al., Diabetes Obes Metab 2026;28(2):840-849 | OK | **NON VÉRIFIABLE** (accès bloqué) — sujet plausible (TIR et complications microvasculaires) mais chiffres non confirmés dans le texte. |
| [8] | Goshrani et al., Diabetes Obes Metab 2025;27(5):2342-2362, PMID 40000405 | **OK**, PMID confirmé exact | **NON VÉRIFIABLE** (accès bloqué, y compris la copie PMC en accès libre). |
| [9] | ADA Standards of Care 2026, chapitre 6, Diabetes Care 2026;49(S1):S132-S149 | **OK** (PMID 41358894 trouvé) | **PARTIELLEMENT SOUTENU** : citation verbatim n°1 tronquée en fin de phrase (le texte réel continue par « …and real-time detection, prevention, and treatment of hypoglycemia and significant hyperglycemia », omis par OE). Citation verbatim n°2 (Table 6.2) exacte au mot près. |
| [10] | AACE 2026 Consensus, Samson et al., Endocr Pract 2026;32(4):473-518 | **OK** (PMID 41842862 trouvé) | **NON VÉRIFIABLE / suspect** : accès texte intégral bloqué ; les sources tertiaires disponibles décrivent un algorithme **différent et plus simple** (cible glycémie à jeun <110 mg/dL, titration tous les 2–5 jours) que celui détaillé par OE (+2 U fixe ; +20 %/+10 %/+1 U ; réduction 10–20 % ; seuil de sur-basalisation 0,5 U/kg/j — aucun de ces chiffres retrouvé). |
| [11] | Bolli et al., Diabetes Care 2025;48(5):671-681 | **OK**, texte intégral lu | **SOUTENU** pour les chiffres (≤2 U/semaine chez les patients à haut risque hypoglycémique ; cible 100–120 mg/dL confirmée Table 3). **Mais étiquetage trompeur** : OE le nomme « ADA/Bolli 2025 », laissant croire à une position officielle ADA — c'est un article de synthèse d'auteurs individuels dans une revue éditée par l'ADA, pas un Standards of Care. |
| [12] | Dower et al., JAMA Intern Med 2026, doi:10.1001/jamainternmed.2026.2772 | **OK** (PMID 42545686 trouvé ; titre réel comporte un sous-titre « A Review » omis par OE) | **NON VÉRIFIABLE** en détail (accès bloqué) — cohérent avec le ton général de la revue mais formulation précise non confirmée mot pour mot. |
| [13] | ADA Standards of Care 2026, chapitre 9, Diabetes Care 2026;49(S1):S183-S215 | **OK** (PMID 41358900 trouvé), texte intégral lu | **PARTIELLEMENT SOUTENU** : le différentiel coucher-réveil ≥50 mg/dL est confirmé mot pour mot. **Le seuil « dose de basale > 0,5 U/kg/j » n'apparaît PAS dans ce chapitre** — misattribution confirmée directement sur la source elle-même (pas seulement non vérifiable : vérifié absent). Absence d'algorithme MCG de titration chiffré confirmée. |
| [14] | Peters et al., Diabetes Obes Metab 2019;21(7):1752-1756 | **OK**, texte intégral lu | **SOUTENU**, avec les p-values exactes (p=0,0006 vs p=0,533) confirmant que la variation nocturne prédit mieux la réponse au bolus que l'HbA1c de base. Nuance : l'article dit « may be better » (hedge), gommé dans la formulation OE — sans dénaturer le sens. |
| [15] | Irace et al., Diabetes Metab Res Rev 2025;41(5):e70059 | **OK**, texte intégral lu | **NON SOUTENU tel qu'utilisé** : Irace et al. est un commentaire secondaire d'experts italiens qui **rapporte lui-même** les positions ADA/EASD et NICE — OE aurait dû citer les documents sources (consensus report ADA/EASD, guidance NICE) et non ce résumé, utilisé deux fois pour deux affirmations distinctes. Le contenu rapporté semble fidèle, mais le choix de citation est erroné. |
| [16] | Battelino et al., Lancet D&E 2023;11(1):42-57 | **OK** | **Existence confirmée**, mais **ne correspond pas** au PMID 31177185 nommé explicitement dans le texte OE pour le consensus ATTD/ICTR — ce PMID est vérifié comme étant Battelino et al. 2019, Diabetes Care 42(8):1593-1603 (« Clinical Targets for CGM Data Interpretation »), un article distinct et thématiquement plus pertinent, absent de toute la liste 1-16. [16] porte sur les métriques pour essais cliniques, pas sur les cibles d'interprétation en pratique courante — rattachement thématique imparfait. |

---

## Findings classés par sévérité et par origine

### HAUTE sévérité

1. **[1] + [19] — incohérence chronologique confirmée, source réelle non citée.** OpenEvidence
   attribue le détail des pas de dose de DIATEC à sa référence [19] (Khunti et al. 2020, revue
   générale antérieure de 5 ans à l'essai) — matériellement impossible. La source réelle du détail
   (protocole DIATEC, Olsen et al., BMC Endocrine Disorders 2024, PMID 38711112) n'est citée nulle
   part dans les 16 références. **Origine : OpenEvidence seule fautive.**
2. **PMID 31177185 (consensus ATTD/ICTR original) absent de toute la liste numérotée.** Nommé
   explicitement dans le corps du texte pour justifier les seuils d'interprétation TIR/TBR/TAR (Q4
   et Q6), ce PMID est réel et vérifié (Battelino et al. 2019, Diabetes Care) mais **n'a aucun
   numéro de référence propre** — les brackets [6][7][8][9] (Q4) et [6][7][16][8] (Q6) pointent vers
   des sources dérivées/secondaires, dont aucune n'a pu être confirmée comme portant elle-même ces
   chiffres précis. Ce point touche directement la distinction interprétation/action posologique,
   la plus sensible du dossier. **Origine : OpenEvidence seule fautive.**
3. **[10] AACE — schéma de titration chiffré non confirmé, contredit par des sources tertiaires.**
   Les chiffres détaillés (+2 U fixe ; +20 %/+10 %/+1 U selon glycémie à jeun ; réduction 10–20 % ;
   seuil de sur-basalisation 0,5 U/kg/j) n'ont pu être confirmés dans aucune source accessible ; les
   résumés tertiaires trouvés décrivent un algorithme différent (cible <110 mg/dL, titration tous
   les 2–5 jours, sans les trois paliers ni le seuil par kg). Risque de sur-précision inventée sur un
   point qui irait directement dans le nœud comme seuil d'action posologique. **Origine : suspectée
   OpenEvidence seule (accès source primaire bloqué, contredit par du tertiaire).**
4. **[13] ADA ch.9 — seuil « > 0,5 U/kg/j » absent du texte réel.** Contrairement au différentiel
   coucher-réveil (≥50 mg/dL, confirmé mot pour mot), le seuil de dose par kilo attribué par OE à ce
   chapitre n'y figure pas, vérifié par lecture directe du texte intégral. **Origine : OpenEvidence
   seule fautive — confirmé sur la source primaire elle-même (qui est saine).**

### MOYENNE sévérité

5. **[3] MOBILE — citation « verbatim » non retrouvée.** La formulation alléguée sur l'auto-titration
   par le patient et les décisions du médecin de soins primaires n'apparaît dans aucune source
   consultée (y compris une analyse compagnon en texte intégral). À traiter comme non confirmée,
   potentiellement une paraphrase présentée à tort comme citation exacte. **Origine : non-vérifiable,
   OpenEvidence potentiellement fautive.**
6. **[11] Bolli — étiquetage trompeur en position d'autorité.** OE nomme la référence « ADA/Bolli
   2025 », ce qui laisse croire à une recommandation officielle ADA alors qu'il s'agit d'un article
   de synthèse d'auteurs individuels publié dans une revue éditée par l'ADA. Les chiffres eux-mêmes
   sont exacts. **Origine : OpenEvidence seule fautive (framing).**
7. **[15] Irace et al. — citation de source secondaire au lieu des documents primaires.** Utilisée
   deux fois (positions ADA/EASD et NICE) alors qu'elle ne fait que rapporter ces positions ; les
   documents sources (consensus report ADA/EASD, guidance NICE) auraient dû être cités directement.
   **Origine : OpenEvidence seule fautive (pratique de citation).**
8. **[4] FreeDM2 — ambiguïté de PMID non résolue et généralisation de population non confirmée.**
   Deux PMID voisins trouvés pour un même essai apparent, sans certitude sur lequel est l'article
   princeps ; la mention d'un agoniste GIP dans la population n'est pas confirmée par le protocole
   trouvé (qui ne mentionne que SGLT2i et/ou GLP-1). **Origine : non-vérifiable / imprécision
   possible d'OpenEvidence.**

### BASSE sévérité

9. **[9] ADA ch.6 — citation verbatim tronquée.** La fin de la phrase citée est coupée sans que cela
   change le sens général. **Origine : OpenEvidence seule fautive (mineure).**
10. **[12] Dower — sous-titre omis.** Le titre réel comporte « : A Review », omis par OE, ce qui
    minimise légèrement la nature de revue narrative (non une recommandation). **Origine :
    OpenEvidence seule fautive (mineure).**
11. **[14] Peters — nuance de hedge gommée.** L'article dit « may be better » ; OE l'énonce sans
    réserve. Le sens n'est pas dénaturé. **Origine : OpenEvidence seule fautive (mineure).**
12. **[16] Battelino 2023 — décalage thématique.** Utilisée pour justifier des cibles d'interprétation
    en pratique courante alors que son objet propre est la métrologie pour essais cliniques ; un
    article plus pertinent existe (PMID 31177185) mais n'est pas cité (cf. finding #2). **Origine :
    OpenEvidence seule fautive (mineure, liée au finding #2).**

### Non-vérifiable (accès bloqué — résultat honnête, pas un manquement)

13. [2] Martens rétrospective — PMID non confirmé, contenu vu seulement via résumé secondaire.
14. [6] Aroda/Eckel — accès bloqué ; sujet (risque cardiovasculaire) rend la pertinence pour les
    seuils TIR/TBR/TAR douteuse mais non tranchée.
15. [7] Anagnostopoulou — accès bloqué, plausible mais non confirmé.
16. [8] Goshrani — accès bloqué, y compris sur la copie en accès libre (PMC).
17. [12] Dower — contenu précis non confirmé au-delà de l'existence et du sujet général.

### Erreur de la source primaire elle-même

Aucune trouvée. Toutes les anomalies relevées retombent sur le choix, la précision ou la présentation
de la citation par OpenEvidence — jamais sur une coquille dans un document source lui-même.

---

## Confirmations obtenues

- **[5] Jancev** : intégralement confirmée au chiffre près via texte intégral — la référence la plus
  fiable du lot (12 ECR, 1248 patients, tous les effets absolus et IC corrects).
- **[3] MOBILE** : effet TIR (+15 %, IC 8–23) et absence de différence de dose totale entre bras
  confirmés via une analyse compagnon en texte intégral.
- **[1] DIATEC** : caractérisation clinique correcte (hospitalisé, algorithmes identiques sauf source
  de mesure, cible 5,6–7,8 mmol/L) — confirmée via le protocole publié.
- **[14] Peters 2019** : affirmation comparative confirmée avec les p-values exactes de l'étude.
- **[9] ADA ch.6** : la seconde citation verbatim (Table 6.2) est exacte au mot près.
- **[11] Bolli** : les chiffres numériques (≤2 U/semaine, cible 100–120 mg/dL) sont exacts, même si
  l'étiquette de source est trompeuse.
- **[13] ADA ch.9** : le seuil de 50 mg/dL est confirmé exact ; l'absence d'algorithme MCG chiffré
  dans ce chapitre est également confirmée.
- **PMID 31177185** : son identité réelle (Battelino et al. 2019, Diabetes Care, cibles
  d'interprétation MCG) a été établie avec certitude par les deux agents indépendamment — utile pour
  corriger la lacune de citation en cas de reprise du prompt OE.

---

## Décompte final

| | OpenEvidence seule fautive | Non-vérifiable (accès bloqué) | Source primaire elle-même | Total |
|---|---|---|---|---|
| HAUTE | 4 | 0 | 0 | **4** |
| MOYENNE | 3 | 1 | 0 | **4** |
| BASSE | 4 | 0 | 0 | **4** |
| Non classé par sévérité (accès bloqué pur) | — | 5 | — | **5** |
| **Total** | **11** | **6** | **0** | **17** |

(Note : le finding #8 [4] est compté une fois en MOYENNE ci-dessus bien qu'il combine une part
non-vérifiable et une part d'imprécision probable — classé du côté le plus sévère par prudence.)

---

## Verdict par sous-question

- **Q1** (ECR MCG vs glycémie capillaire, ambulatoire) : **conclusion soutenue**. « Aucun ECR trouvé »
  est confirmé exact ; la caractérisation de DIATEC (hospitalier, mesure seule différente) est
  vérifiée sur le protocole. Réserve : le protocole DIATEC lui-même (PMID 38711112) devrait être
  cité directement plutôt que la référence erronée [19].
- **Q2** (algorithme MCG publié + évalué prospectivement) : **conclusion probablement correcte**
  (Martens = rétrospectif confirmé ; DIATEC = hospitalier confirmé) mais **l'appui documentaire est
  fautif** (citation [19] chronologiquement impossible) — à corriger avant tout usage.
- **Q3** (protocoles réels MOBILE/FreeDM2/Jancev) : **soutenu pour Jancev** (entièrement vérifié),
  **soutenu avec réserve pour FreeDM2** (ambiguïté PMID, population à préciser), **fragile pour
  MOBILE** (une citation verbatim centrale n'est pas retrouvée). Le sens global (titration non
  pilotée par capteur dans les 3 essais) tient, mais ne pas encoder la citation verbatim MOBILE sans
  vérification directe du texte intégral JAMA.
- **Q4** (seuils MCG posologiques) : **conclusion qualitative probablement correcte** (« aucun seuil
  d'action posologique validé ») mais **la base de citation est la plus fragile du dossier** : la
  source primaire réelle des seuils d'interprétation (PMID 31177185) est absente, et le détail
  chiffré de l'algorithme AACE n'est pas confirmé et contredit par du tertiaire. **Ne pas encoder les
  chiffres AACE (+2U/+20%/+10%/+1U, 0,5 U/kg/j) sans vérification directe du document source.**
- **Q5** (profil nocturne/AGP, sur-basalisation) : **partiellement soutenu**. Le signal Peters 2019
  (bolus, pas basale) est solide. Le différentiel coucher-réveil ≥50 mg/dL est confirmé (source ADA
  ch.9). Le seuil « > 0,5 U/kg/j » n'est confirmé dans aucune des deux sources qui lui sont
  attribuées ([10] non vérifiable, [13] vérifié absent) — **à retirer ou à re-sourcer avant tout
  usage**.
- **Q6** (recommandations internationales post-2019) : **conclusion globale probablement correcte**
  (aucune définit d'algorithme MCG chiffré) mais **discipline de citation déficiente sur deux points**
  : ADA/EASD et NICE cités via une source secondaire ([15]) plutôt que les documents officiels ;
  ATTD/ICTR cité sans référence numérotée propre pour son PMID nommé. Les citations verbatim ADA
  (ch.6) sont globalement fiables (une légère troncature sans distorsion de sens).

---

## Proposition de libellé concret (sous réserve de validation du référent)

**Formulation prudente (recommandée en l'état) :**

> À ce jour, aucun essai randomisé ambulatoire ni algorithme publié et évalué prospectivement ne
> valide une titration de la basale pilotée par les métriques de mesure continue du glucose (temps
> dans la cible, temps au-dessus/sous la cible, tendance nocturne AGP) chez le DT2. Les métriques MCG
> disposent de seuils d'interprétation reconnus (temps dans la cible, temps au-dessus/sous la cible),
> mais aucun seuil d'action posologique chiffré (déclencheur + pas de dose) fondé sur ces métriques
> n'est à ce jour validé. Les algorithmes de titration chiffrés actuellement disponibles restent
> fondés sur la glycémie à jeun. Le profil nocturne (AGP) contribue surtout à repérer une
> sur-basalisation (différentiel coucher-réveil élevé) devant faire réévaluer le schéma plutôt qu'à
> déclencher directement une majoration de dose de basale.

**Points explicitement à NE PAS encoder tels quels dans le nœud, en l'état de cette vérification :**
- Le détail chiffré de l'algorithme AACE 2026 (finding HAUTE #3).
- Le seuil « dose de basale > 0,5 U/kg/j » comme signal de sur-basalisation (finding HAUTE #4) — au
  minimum, retirer l'attribution à l'ADA ch.9.
- La citation verbatim MOBILE sur l'auto-titration patient (finding MOYENNE #5).
- Toute référence à « ADA/Bolli 2025 » comme position officielle ADA (finding MOYENNE #6) —
  reformuler en « revue narrative publiée dans Diabetes Care (Bolli et al., 2025) ».

Aucun de ces points ne remet en cause la conclusion qualitative centrale (Q1/Q2/Q4/Q6), mais chacun
affaiblirait la traçabilité du nœud s'il était encodé avec la source ou le chiffre actuellement
donné par OpenEvidence.

---

## Étape 3 (boucle) — points décisionnels restant `[À VÉRIFIER]`

À relancer en priorité si le référent souhaite lever ces points avant validation :
1. Contenu exact du chapitre insuline/titration de l'AACE 2026 (Algorithme 8) — accès payant à
   obtenir autrement que via web scraping.
2. Texte intégral JAMA 2021 (MOBILE) pour confirmer ou infirmer la citation verbatim sur
   l'auto-titration.
3. Résolution de l'ambiguïté PMID FreeDM2 (42035781 vs 42303377) via accès PubMed direct.
4. Confirmation qu'aucune des références [6][7][8] ne porte elle-même les chiffres TIR/TBR/TAR
   attribués au groupe [6][7][8][9], une fois l'accès à ces éditeurs obtenu.
