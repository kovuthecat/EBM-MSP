# Journal de recherche — Seuil de DFG des sulfamides / répaglinide en IRC (DT2)

Format imposé par `.claude/skills/recherche-source-primaire/references/registre-affirmations.md` §
Journal de recherche.

| Date | Base / interface | Requête exacte | Filtres | Résultats affichés | Examinés | Retenus | Exclus (motif) |
|---|---|---|---|---|---|---|---|
| 2026-09-24 | Corpus local (`Glob`) | `docs/decision/sources/*` | aucun | 18 fichiers | 18 (liste des noms) | `SFD 2025.pdf`, `prescrire-dt2.md` (pertinents pour ce chantier) | Les 16 autres pièces du corpus (HAS parcours de soins, guides obésité, ebmfrance insuline, etc.) — non pertinentes pour le seuil DFG des SU/répaglinide, non ouvertes dans ce chantier |
| 2026-09-24 | `docs/decision/sources/SFD 2025.pdf` (outil `Read`) | `Read` avec `pages="1-10"` | aucun | non disponible (erreur avant tout résultat) | 0 | — | **échec technique** : `pdftoppm is not installed` (poppler-utils absent de l'environnement) |
| 2026-09-24 | `docs/decision/sources/SFD 2025.pdf` (outil `Read`) | `Read` avec `pages="1"` (retest ciblé) | aucun | non disponible | 0 | — | **échec technique**, même message — confirme un défaut d'environnement, pas un défaut de la pièce (méthode 1 écartée, passage à la méthode 2) |
| 2026-09-24 | `docs/decision/sources/SFD 2025.pdf` (outil `Read`) | `Read` avec `limit=50`, sans `pages` | aucun | 33 pages rendues (document complet, *Med Mal Metab* 2025;19:630-662) | 33 pages lues intégralement | Avis n° 1 à 24 (texte complet), tableaux I/II/III, Figures 1-10 (texte des légendes ; couleurs de la Figure 3 non rendues) | Aucune exclusion : lecture intégrale, pas de tri à faire sur un texte de reco de société savante |
| 2026-09-24 | `docs/decision/sources/prescrire-dt2.md` (`Grep`, insensible casse) | `sulfamide\|glinide\|répaglinide\|repaglinide\|rénal\|DFG\|insuffisance rénale` | `-i`, `-C 2` | 3 zones de contexte trouvées (l. 25-41, 67-92, 126-138) | 3 zones lues en contexte | Passage glibenclamide (l. 37-40 : « à écarter si risque d'hypoglycémie grand (âgé, IR) ») | Pas de seuil DFG chiffré trouvé pour les SU — lacune constatée, pas une déduction (témoin positif « rénal » présent ailleurs dans le fichier, confirmant que l'extraction fonctionne) |
| 2026-09-24 | `docs/decision/sources/prescrire-dt2.md` (`Grep`) | `répaglinide\|repaglinide\|glinide` | `-i`, mode contenu | 0 résultat | 0 | — | Aucune occurrence du répaglinide/glinide dans les notes Prescrire DT2 disponibles localement — lacune constatée (fichier entièrement accessible, pas un problème d'extraction) |
| 2026-09-24 | `epreuve/entrees/OE-retour-brut-extrait.md` (`Read`) | lecture intégrale du fichier | aucun | 1 fichier, ~158 lignes | intégralement lu | Sections « Guideline-Specific eGFR Thresholds for Sulfonylureas », « Repaglinide … ESRD/dialysis », « Drug Label » | Rien exclu — fichier déjà cadré comme débroussaillage SQ3 par le cadrage, pas une réponse à SQ1/SQ2 (le retour signale lui-même l'absence de couverture SFD/HAS) |
| 2026-09-24 | Web (`WebSearch`) | `RCP répaglinide ANSM insuffisance rénale contre-indication clairance créatinine` | aucun | 9 liens | 1 examiné en détail (page ANSM ecodex `R0309526`) | Page ANSM répaglinide retenue pour `WebFetch` | Autres liens (VIDAL, HUG, ClinicalTrials.gov, SFD article kiosque) non ouverts — hors périmètre RCP primaire ou déjà couverts par la SFD 2025/OE |
| 2026-09-24 | Web (`WebSearch`) | `RCP gliclazide ANSM insuffisance rénale sévère contre-indication clairance créatinine` | aucun | 9 liens | 1 examiné en détail (page ANSM ecodex `R0282177`) | — | **Incident d'identité** : la page `R0282177` s'est révélée être la RCP du **furosémide** (FUROSEMIDE SANDOZ), pas du gliclazide — écarté immédiatement, nouvelle recherche lancée (ligne suivante) conformément à `acces-identite.md` § 4 (« si l'article trouvé ne correspond pas … le dire et chercher à nouveau ») |
| 2026-09-24 | Web (`WebSearch`) | `"gliclazide" RCP ansm.sante.fr ecodex résumé caractéristiques produit` | aucun | 9 liens | 1 examiné en détail (page ANSM ecodex `R0172430`) | Page ANSM gliclazide retenue pour `WebFetch`, identité confirmée par le contenu retourné (« GLICLAZIDE MYLAN 30 mg ») | Autres liens (base-donnees-publique, VIDAL, brevets) non ouverts — hors périmètre RCP officielle ou déjà couverts |
| 2026-09-24 | Web (`WebSearch`) | `"glibenclamide" RCP ansm.sante.fr ecodex insuffisance rénale contre-indication` | aucun | 9 liens | 1 examiné en détail (page ANSM ecodex `R0296317`) | Page ANSM glibenclamide (DAONIL 5 mg) retenue pour `WebFetch`, identité confirmée par le contenu retourné | Autres liens non ouverts |
| 2026-09-24 | Web (`WebSearch`) | `"glimépiride" RCP ansm.sante.fr ecodex` | aucun | 9 liens | 1 examiné en détail (page ANSM ecodex `R0431162`) | Page ANSM glimépiride (GLIMEPIRIDE EG 4 mg) retenue pour `WebFetch`, identité confirmée par le contenu retourné | Autres liens (EMA referral glimepiride Parke Davis, Wikipedia) non ouverts — hors périmètre RCP française en vigueur |
| 2026-09-24 | Web (`WebFetch`) | Lecture assistée de `https://agence-prd.ansm.sante.fr/php/ecodex/rcp/R0309526.htm` (répaglinide), prompt ciblé sur les sections rénales | aucun | 1 page | 1 page (via résumé intermédiaire de l'outil, voir rapport § SQ3) | Passages 4.2/4.3/5.2 sur la fonction rénale | — |
| 2026-09-24 | Web (`WebFetch`) | Lecture assistée de `https://agence-prd.ansm.sante.fr/php/ecodex/rcp/R0172430.htm` (gliclazide), prompt ciblé + demande de confirmation d'identité | aucun | 1 page | 1 page (résumé intermédiaire) | Passages 4.2/4.3/4.4 sur la fonction rénale ; confirmation explicite que le document est bien le gliclazide | — |
| 2026-09-24 | Web (`WebFetch`) | Lecture assistée de `https://agence-prd.ansm.sante.fr/php/ecodex/rcp/R0296317.htm` (glibenclamide), prompt ciblé + confirmation d'identité | aucun | 1 page | 1 page (résumé intermédiaire) | Passages 4.2/4.3/4.4/5.2, dont le seuil chiffré « clairance de la créatinine > 30 ml/min » | — |
| 2026-09-24 | Web (`WebFetch`) | Lecture assistée de `https://agence-prd.ansm.sante.fr/php/ecodex/rcp/R0431162.htm` (glimépiride), prompt ciblé + confirmation d'identité | aucun | 1 page | 1 page (résumé intermédiaire) | Passages 4.2/4.3/4.4 sur la fonction rénale | — |

## Points de méthode

- **Synonymes/normalisation** : la recherche dans `prescrire-dt2.md` a couvert à la fois les formes
  françaises (« sulfamide », « rénal ») et anglaises/variantes orthographiques du répaglinide
  (« repaglinide », « glinide ») pour ne pas manquer une occurrence par un simple écart de graphie —
  conformément à `acces-identite.md` § 8, point 3 (normaliser avant de chercher).
- **Témoin positif** systématiquement recherché avant de conclure à une absence : pour le PDF SFD
  2025, le titre exact et le DOI (sortis dès la première page) ; pour `prescrire-dt2.md`, le mot
  « rénal » présent ailleurs dans le fichier.
- **Deux interfaces sur le même corpus** : `WebSearch` (repérage des URL ANSM) et `WebFetch` (lecture
  de la page trouvée) ne comptent pas comme deux recherches indépendantes au sens de la porte — la
  seconde dépend entièrement de la première.
- **Connecteurs MCP absents** : aucun connecteur PubMed/ClinicalTrials.gov/Consensus n'était exposé
  dans cette session (constaté au premier geste, cf. rapport § Provenance) ; aucune tentative
  d'appel n'a donc été faite sur ces outils, conformément à `acces-identite.md` § 1.
- **Bash indisponible** : aucune requête `identite.mjs`/`verifier-registre.mjs` n'a pu être journalisée
  faute d'accès à l'outil dans cette session (voir rapport principal).
